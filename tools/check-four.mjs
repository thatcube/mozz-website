#!/usr/bin/env node
/**
 * Local QA for the four new sites. Not committed logic anyone else depends on —
 * it just loads each page at three widths, records console errors, failed
 * requests and horizontal overflow, and writes a full-page screenshot.
 *
 *   node tools/check-four.mjs http://localhost:4324 syzygy imprint
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] ?? 'http://localhost:4324';
const SLUGS = process.argv.slice(3);
if (!SLUGS.length) throw new Error('pass at least one slug');

const OUT = join(root, '.qa');
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '2000x1264', width: 2000, height: 1264 },
  { name: '402x874', width: 402, height: 874 },
];

const browser = await chromium.launch();
let failures = 0;

for (const slug of SLUGS) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    const bad = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('requestfailed', (r) => bad.push(`${r.url()} — ${r.failure()?.errorText}`));
    page.on('response', (r) => {
      if (r.status() >= 400) bad.push(`${r.url()} — HTTP ${r.status()}`);
    });

    const res = await page.goto(`${BASE}/v/${slug}`, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '.vbar{display:none !important}' });
    await page.waitForTimeout(400);

    // Scroll the whole document so lazy / scroll-driven sections settle.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));
    });

    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const out = [];
      if (de.scrollWidth > de.clientWidth + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            const cs = getComputedStyle(el);
            // An element clipped by an ancestor is not an overflow problem.
            let clipped = false;
            for (let p = el.parentElement; p; p = p.parentElement) {
              const pc = getComputedStyle(p);
              if (/hidden|clip|auto|scroll/.test(pc.overflowX)) { clipped = true; break; }
            }
            if (clipped) continue;
            out.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ').filter(Boolean).join('.')} right=${Math.round(r.right)} pos=${cs.position}`);
          }
        }
        return { docScroll: de.scrollWidth, docClient: de.clientWidth, culprits: out.slice(0, 8) };
      }
      return null;
    });

    const tag = `${slug} @ ${vp.name}`;
    const problems = [];
    if (!res || !res.ok()) problems.push(`HTTP ${res ? res.status() : 'none'}`);
    if (overflow) problems.push(`overflow ${overflow.docScroll}>${overflow.docClient} :: ${overflow.culprits.join(' | ') || '(all clipped by ancestors)'}`);
    if (errors.length) problems.push(`console: ${errors.slice(0, 4).join(' | ')}`);
    if (bad.length) problems.push(`requests: ${bad.slice(0, 4).join(' | ')}`);

    await page.screenshot({ path: join(OUT, `${slug}-${vp.name}.png`), fullPage: true });
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.screenshot({ path: join(OUT, `${slug}-${vp.name}-hero.png`) });

    if (problems.length) {
      failures += 1;
      console.log(`FAIL  ${tag}\n      ${problems.join('\n      ')}`);
    } else {
      console.log(`ok    ${tag}`);
    }

    await context.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} viewport(s) with problems` : '\nall clean');
