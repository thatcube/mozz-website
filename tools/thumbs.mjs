#!/usr/bin/env node
/**
 * Generates the picker's thumbnails from the variants themselves.
 *
 * The picker is only useful if the cards show what the pages actually look like
 * right now, so the thumbnails are screenshots rather than hand-made art. They
 * are committed to public/thumbs/ because the built site is deployed as static
 * files and cannot take its own screenshots.
 *
 *   npm run thumbs            # against the running dev server
 *   node tools/thumbs.mjs http://localhost:4322
 *
 * Re-run whenever a variant's hero changes.
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public/thumbs');
const BASE = process.argv[2] ?? 'http://localhost:4322';

const site = readFileSync(join(root, 'src/data/site.ts'), 'utf8');
const slugs = [...site.matchAll(/^\s{4}slug: '([a-z-]+)',$/gm)].map((m) => m[1]);
if (!slugs.length) throw new Error('no variant slugs found in src/data/site.ts');

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  // The card shows a resting composition, not a half-finished entrance.
  reducedMotion: 'reduce',
});

for (const slug of slugs) {
  const page = await context.newPage();
  const res = await page.goto(`${BASE}/v/${slug}`, { waitUntil: 'networkidle', timeout: 30_000 });
  if (!res || !res.ok()) {
    console.log(`  ${slug.padEnd(10)} skipped — HTTP ${res ? res.status() : 'no response'}`);
    await page.close();
    continue;
  }

  await page.evaluate(() => document.fonts.ready);

  // The review bar is scaffolding for humans browsing the set; it must not end
  // up baked into the artwork the cards display.
  await page.addStyleTag({ content: '.vbar{display:none !important}' });
  await page.waitForTimeout(350);

  await page.screenshot({ path: join(OUT, `${slug}.png`) });
  await page.close();
  console.log(`  ${slug.padEnd(10)} → public/thumbs/${slug}.png`);
}

await context.close();
await browser.close();
