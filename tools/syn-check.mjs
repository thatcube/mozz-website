#!/usr/bin/env node
/**
 * Checks the synthesis pages end to end at the three review sizes.
 *
 * For each page and viewport it reports horizontal overflow, console errors,
 * failed requests and any element wider than the document — the four things
 * that make a page look unfinished in review.
 *
 *   node tools/syn-check.mjs [baseUrl] [slug...]
 */
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const BASE = args[0]?.startsWith('http') ? args.shift() : 'http://127.0.0.1:4399';
const SLUGS = args.length ? args : ['anthology', 'union', 'chorus', 'finale'];

const SIZES = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '2000x1264', width: 2000, height: 1264 },
  { name: '402x874', width: 402, height: 874 },
];

const browser = await chromium.launch();
let failures = 0;

for (const slug of SLUGS) {
  for (const size of SIZES) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    const failed = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    page.on('requestfailed', (req) => failed.push(`${req.url()} — ${req.failure()?.errorText}`));
    page.on('response', (res) => {
      if (res.status() >= 400) failed.push(`${res.url()} — HTTP ${res.status()}`);
    });

    const res = await page.goto(`${BASE}/v/${slug}`, {
      waitUntil: 'networkidle',
      timeout: 45_000,
    });

    if (!res || !res.ok()) {
      console.log(`✗ ${slug} @ ${size.name} — HTTP ${res ? res.status() : 'no response'}`);
      failures += 1;
      await context.close();
      continue;
    }

    await page.evaluate(() => document.fonts.ready);
    // Walk the page so lazy reveals and scroll-tracked sections settle.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));
    });

    const report = await page.evaluate(() => {
      const de = document.documentElement;
      const overflow = de.scrollWidth - de.clientWidth;
      const wide = [];
      const limit = de.clientWidth + 1;
      for (const el of document.querySelectorAll('body *')) {
        const box = el.getBoundingClientRect();
        if (box.width === 0 && box.height === 0) continue;
        if (box.right > limit + 0.5 || box.left < -0.5) {
          const cs = getComputedStyle(el);
          // Deliberate bleed inside a clipped parent is fine.
          let parent = el.parentElement;
          let clipped = false;
          while (parent) {
            const ps = getComputedStyle(parent);
            if (/hidden|clip/.test(ps.overflowX)) {
              clipped = true;
              break;
            }
            parent = parent.parentElement;
          }
          if (!clipped && cs.position !== 'fixed') {
            wide.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 42)} → ${Math.round(box.left)}..${Math.round(box.right)}`
            );
          }
        }
      }
      return {
        overflow,
        wide: wide.slice(0, 6),
        height: document.body.scrollHeight,
        sections: document.querySelectorAll('section, header, footer').length,
      };
    });

    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
    );

    const problems = [];
    if (report.overflow > 0) problems.push(`horizontal overflow ${report.overflow}px`);
    if (report.wide.length) problems.push(`unclipped: ${report.wide.join(' | ')}`);
    if (errors.length) problems.push(`console: ${errors.slice(0, 3).join(' | ')}`);
    if (failed.length) problems.push(`requests: ${failed.slice(0, 3).join(' | ')}`);
    if (brokenImages.length) problems.push(`images: ${brokenImages.slice(0, 3).join(' | ')}`);

    if (problems.length) {
      failures += 1;
      console.log(`✗ ${slug} @ ${size.name}`);
      problems.forEach((p) => console.log(`    ${p}`));
    } else {
      console.log(
        `✓ ${slug} @ ${size.name} — ${report.sections} sections, ${report.height}px tall`
      );
    }

    await context.close();
  }
}

await browser.close();
if (failures) {
  console.log(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll checks passed.');
