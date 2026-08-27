#!/usr/bin/env node
/**
 * Launch QA.
 *
 * Checks the routes that have to be right on the day Emblem Round goes live:
 * the homepage, the concept gallery, the shortlist and the five shortlisted
 * variants. For each it scrolls the whole document at three viewports and
 * reports console errors, failed requests, broken images and horizontal
 * overflow, then asserts the launch copy rules — no performance figures, no
 * store placeholder, no physical-record marketing — and the homepage's
 * canonical, robots and comparison-bar state.
 *
 * Screenshots land in shots/launch, which is gitignored.
 *
 * Run against the built output:  node tools/qa-launch.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4330';
const OUT = 'shots/launch';
mkdirSync(OUT, { recursive: true });

const WINNERS = ['emblem', 'emblem-mark', 'emblem-round', 'poster-site', 'masthead'];
const ROUTES = ['/', '/concepts', '/winners', ...WINNERS.map((s) => `/v/${s}`)];

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '2000x1264', width: 2000, height: 1264 },
  { name: '402x874', width: 402, height: 874 },
];

/** Copy that must not survive on any launch route. */
const BANNED = [
  '16ms',
  '75ms',
  'milliseconds',
  'Coming soon',
  'coming soon',
  'Coming to the',
  'Every record',
  'a record on',
  'A record on',
  'take a record',
  'Take a record',
];

const browser = await chromium.launch();
let failures = 0;

for (const route of ROUTES) {
  const slug = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-');

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
    page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));

    const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    const status = res?.status() ?? 0;

    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(280);

    const overflow = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const guilty = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > w + 1.5 || r.left < -1.5) {
          const s = getComputedStyle(el);
          if (s.position === 'fixed' || s.visibility === 'hidden') continue;
          guilty.push(
            `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ` +
              `[${Math.round(r.left)}..${Math.round(r.right)}]`
          );
        }
      }
      return {
        scroll: document.documentElement.scrollWidth > w + 1,
        guilty: [...new Set(guilty)].slice(0, 6),
      };
    });

    const brokenImages = await page.evaluate(() =>
      [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src)
        .slice(0, 6)
    );

    const text = await page.evaluate(() => document.body.innerText);
    const hits = BANNED.filter((b) => text.includes(b));

    await page.screenshot({
      path: join(OUT, `${slug}--${vp.name}.png`),
      fullPage: vp.name === '1440x900',
    });

    const problems = [];
    if (status !== 200) problems.push(`status ${status}`);
    if (errors.length) problems.push(`console: ${errors.slice(0, 3).join(' | ')}`);
    if (failed.length) problems.push(`requests: ${failed.slice(0, 3).join(' | ')}`);
    if (overflow.scroll) problems.push(`overflow: ${overflow.guilty.join(' | ') || 'unattributed'}`);
    if (brokenImages.length) problems.push(`broken images: ${brokenImages.join(' | ')}`);
    if (hits.length) problems.push(`banned copy: ${hits.join(', ')}`);

    if (problems.length) {
      failures += 1;
      console.log(`FAIL  ${route} @ ${vp.name}`);
      problems.forEach((p) => console.log(`      ${p}`));
    } else {
      console.log(`ok    ${route} @ ${vp.name}`);
    }

    await context.close();
  }
}

/* Homepage-only assertions: it is the one route that has to be indexable, free
   of the review bar, and canonical at the bare domain. */
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
const meta = await page.evaluate(() => ({
  canonical: document.querySelector('link[rel=canonical]')?.href ?? null,
  robots: document.querySelector('meta[name=robots]')?.content ?? null,
  title: document.title,
  description: document.querySelector('meta[name=description]')?.content ?? null,
  variantBar: !!document.querySelector('nav[aria-label="Design variants"]'),
  h1: document.querySelector('h1')?.textContent ?? null,
}));
await context.close();

const homeProblems = [];
if (meta.canonical !== 'https://mozzmusic.com/') homeProblems.push(`canonical ${meta.canonical}`);
if (!meta.robots?.startsWith('index')) homeProblems.push(`robots ${meta.robots}`);
if (meta.variantBar) homeProblems.push('VariantBar present');
if (homeProblems.length) {
  failures += 1;
  console.log('FAIL  / metadata');
  homeProblems.forEach((p) => console.log(`      ${p}`));
} else {
  console.log('ok    / metadata');
}

console.log('\nhomepage:');
console.log(`  h1:          ${meta.h1}`);
console.log(`  title:       ${meta.title}`);
console.log(`  canonical:   ${meta.canonical}`);
console.log(`  robots:      ${meta.robots}`);

await browser.close();
console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
