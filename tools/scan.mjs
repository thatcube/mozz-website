#!/usr/bin/env node
/**
 * Walks a page in viewport-sized steps and writes one screenshot per step, so
 * a full-length site can be reviewed panel by panel instead of as one enormous
 * strip. Local review scaffolding only.
 *
 *   node tools/scan.mjs http://localhost:4324/v/syzygy 1440 900
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = process.argv[2];
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 900);
const slug = url.split('/').pop();

const OUT = join(root, '.qa');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width, height } });
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: '.vbar{display:none !important}' });

const total = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.ceil(total / height);
for (let i = 0; i < steps; i += 1) {
  await page.evaluate((y) => window.scrollTo(0, y), i * height);
  await page.waitForTimeout(320);
  await page.screenshot({ path: join(OUT, `${slug}-${width}-p${String(i).padStart(2, '0')}.png`) });
}
console.log(`${slug} ${width}px — ${steps} panels, ${total}px tall`);

await browser.close();
