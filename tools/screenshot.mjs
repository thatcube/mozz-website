#!/usr/bin/env node
/**
 * Full-page screenshots of every variant, desktop and mobile, in one pass.
 *
 * Visual review is the only way to know whether a page is actually good, and
 * doing it one page at a time is slow and expensive. This batches the whole set
 * against a running preview server.
 *
 *   npm run build && npm run preview &     # or astro dev
 *   node tools/screenshot.mjs [baseURL]
 *
 * Writes shots/<slug>-desktop.png and shots/<slug>-mobile.png (gitignored).
 */
import { chromium } from 'playwright';
import { mkdirSync, rmSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'shots');
const BASE = process.argv[2] ?? 'http://localhost:4321';

/** Slugs come from the single source of truth so this never drifts. */
const site = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
const slugs = [...site.matchAll(/^\s{4}slug: '([a-z-]+)',$/gm)].map((m) => m[1]);
if (!slugs.length) throw new Error('no variant slugs found in src/data/site.ts');

const ROUTES = [
  { slug: 'index', path: '/' },
  ...slugs.map((slug) => ({ slug, path: `/v/${slug}` })),
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 402, height: 874 },
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.name === 'mobile' ? 2 : 1,
    // Screenshots must show the authored resting state, not a half-played
    // entrance animation, so motion is disabled for the capture.
    reducedMotion: 'reduce',
  });

  for (const route of ROUTES) {
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
    page.on('pageerror', (e) => consoleErrors.push(String(e)));

    const res = await page.goto(BASE + route.path, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    });

    if (!res || !res.ok()) {
      problems.push(`${route.path} → HTTP ${res ? res.status() : 'no response'}`);
    }

    // Webfonts decide the whole composition; capturing before they land shows a
    // layout nobody will ever see.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);

    // Horizontal overflow is the defect that screenshots hide, because the shot
    // is taken at the document width rather than the viewport width.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) problems.push(`${route.path} @${vp.name} → ${overflow}px horizontal overflow`);
    if (consoleErrors.length) problems.push(`${route.path} @${vp.name} → ${consoleErrors[0]}`);

    await page.screenshot({
      path: join(OUT, `${route.slug}-${vp.name}.png`),
      fullPage: true,
    });
    await page.close();
    process.stdout.write(`  ${route.slug}-${vp.name}\n`);
  }

  await context.close();
}

await browser.close();

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exitCode = 1;
} else {
  console.log('\nno overflow, no console errors');
}
