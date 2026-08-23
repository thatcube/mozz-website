#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public/hero-thumbs');
const base = process.argv[2] ?? 'http://localhost:4322';
const source = readFileSync(join(root, 'src/data/heroes.ts'), 'utf8');
const slugs = [...source.matchAll(/^\s{4}slug: '([a-z-]+)',$/gm)].map((match) => match[1]);

mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});

for (const slug of slugs) {
  const page = await context.newPage();
  const response = await page.goto(`${base}/h/${slug}`, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });
  if (!response?.ok()) throw new Error(`${slug}: HTTP ${response?.status() ?? 'unknown'}`);
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '.hero-bar{display:none !important}' });
  await page.screenshot({ path: join(out, `${slug}.png`) });
  await page.close();
  console.log(`  ${slug}`);
}

await context.close();
await browser.close();
