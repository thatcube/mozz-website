#!/usr/bin/env node
/**
 * Local QA for the four extended sites.
 *
 * Scrolls each page end to end at three viewports and reports console errors,
 * failed requests, horizontal overflow and the elements causing it. Also drops
 * full-page screenshots into shots/ (gitignored) for visual review.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4329';
const slugs = (process.env.SLUGS ?? 'umbra-site,eclipse-site,cover-site,poster-site').split(',');
const OUT = 'shots/qa';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '2000x1264', width: 2000, height: 1264 },
  { name: '402x874', width: 402, height: 874 },
];

const browser = await chromium.launch();
let bad = 0;

for (const slug of slugs) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
    page.on('response', (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });

    await page.goto(`${BASE}/v/${slug}`, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.evaluate(() => document.fonts.ready);

    // Scroll the whole document so every reveal fires and lazy work happens.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.7);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1600));
    });

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const scrollW = Math.max(doc.scrollWidth, document.body.scrollWidth);
      const clientW = doc.clientWidth;
      const culprits = [];
      if (scrollW > clientW + 1) {
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > clientW + 1 || r.left < -1) {
            const cs = getComputedStyle(el);
            if (cs.position === 'fixed') continue;
            culprits.push(
              `${el.tagName.toLowerCase()}.${(el.className && typeof el.className === 'string' ? el.className : '')
                .split(' ')
                .filter(Boolean)
                .slice(0, 3)
                .join('.')} [${Math.round(r.left)}→${Math.round(r.right)}]`,
            );
          }
        }
      }
      return { scrollW, clientW, culprits: [...new Set(culprits)].slice(0, 12) };
    });

    const overflows = overflow.scrollW > overflow.clientW + 1;
    const ok = !errors.length && !failed.length && !overflows;
    if (!ok) bad += 1;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${slug.padEnd(13)} ${vp.name.padEnd(10)} ` +
        `overflow=${overflows ? `${overflow.scrollW}>${overflow.clientW}` : 'no'} ` +
        `errors=${errors.length} failedReq=${failed.length} h=${await page.evaluate(() => document.body.scrollHeight)}`,
    );
    for (const c of overflow.culprits) console.log(`       ↳ ${c}`);
    for (const e of errors.slice(0, 6)) console.log(`       ! ${e}`);
    for (const f of [...new Set(failed)].slice(0, 6)) console.log(`       ✗ ${f}`);

    await page.screenshot({
      path: join(OUT, `${slug}-${vp.name}.png`),
      fullPage: true,
    });
    await context.close();
  }
}

await browser.close();
process.exit(bad ? 1 : 0);
