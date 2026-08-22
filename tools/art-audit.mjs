#!/usr/bin/env node
/**
 * Illustration audit.
 *
 * Full-page screenshots are useless for judging drawing quality — everything is
 * shrunk to thumbnail size and defects hide. This finds every substantial piece
 * of artwork on a variant, screenshots each one on its own at 2x, and reports
 * its size and position.
 *
 * It also flags the two failure modes that matter for the illustrated variants:
 *
 *   overflow  — a shape drawn outside its own viewBox, which is how an
 *               illustration ends up clipped on one edge
 *   collision — two text nodes whose boxes overlap, which is how the tiny
 *               isometric legends ended up as unreadable mush
 *
 * Usage:  node tools/art-audit.mjs <slug> [slug...]
 * Output: qa/art/<slug>-NN-<label>.png  plus a report on stdout
 */

import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';

const PORTS = [4322, 4399, 4321, 4323];
let BASE = process.env.BASE ?? null;
if (!BASE) {
  for (const port of PORTS) {
    try {
      const r = await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(2500) });
      if (r.ok) { BASE = `http://localhost:${port}`; break; }
    } catch {}
  }
}
if (!BASE) {
  console.error(`No dev server on ${PORTS.join(', ')}. Set BASE to override.`);
  process.exit(1);
}

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('Usage: node tools/art-audit.mjs <slug> [slug...]');
  process.exit(1);
}

/** Artwork worth auditing: big enough that a reader would judge it. */
const MIN_AREA = 130 * 130;

const browser = await chromium.launch();

for (const slug of slugs) {
  const outDir = `qa/art/${slug}`;
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(`${BASE}/v/${slug}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);

  // Lazy artwork below the fold never renders until it has been near the viewport.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle').catch(() => {});

  const found = await page.evaluate((minArea) => {
    const out = [];
    const seen = new Set();

    for (const el of document.querySelectorAll('svg')) {
      // Only audit outermost SVGs; nested ones are parts of their parent.
      if (el.parentElement?.closest('svg')) continue;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < minArea) continue;
      if (seen.has(el)) continue;
      seen.add(el);

      /* A shape drawn outside the viewBox is clipped in the render. Compare the
         union of the content's bounding box against the declared viewBox. */
      let overflow = null;
      try {
        const vb = el.viewBox?.baseVal;
        if (vb && vb.width) {
          const bb = el.getBBox();
          const pad = 0.5;
          const over = {
            left: +(vb.x - bb.x).toFixed(1),
            top: +(vb.y - bb.y).toFixed(1),
            right: +((bb.x + bb.width) - (vb.x + vb.width)).toFixed(1),
            bottom: +((bb.y + bb.height) - (vb.y + vb.height)).toFixed(1),
          };
          const worst = Math.max(over.left, over.top, over.right, over.bottom);
          if (worst > pad) overflow = { worst, ...over, vb: `${vb.width}x${vb.height}` };
        }
      } catch {}

      /* Overlapping text boxes inside one drawing — the legend-mush failure. */
      const texts = [...el.querySelectorAll('text')].map((t) => {
        const b = t.getBoundingClientRect();
        return { s: (t.textContent || '').trim().slice(0, 28), b };
      }).filter((t) => t.s && t.b.width > 0);

      const collisions = [];
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i].b, c = texts[j].b;
          const ox = Math.min(a.right, c.right) - Math.max(a.left, c.left);
          const oy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
          if (ox > 2 && oy > 2) {
            const frac = (ox * oy) / Math.min(a.width * a.height, c.width * c.height);
            if (frac > 0.22) collisions.push(`"${texts[i].s}" ∩ "${texts[j].s}"`);
          }
        }
      }

      const label = (el.getAttribute('aria-label') || el.closest('figure,section')?.querySelector('h2,h3,figcaption')?.textContent || el.className?.baseVal || 'art')
        .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 34) || 'art';

      el.setAttribute('data-audit-id', String(out.length));
      out.push({
        i: out.length,
        label,
        w: Math.round(r.width),
        h: Math.round(r.height),
        texts: texts.length,
        overflow,
        collisions: collisions.slice(0, 4),
      });
    }
    return out;
  }, MIN_AREA);

  console.log(`\n${'='.repeat(64)}\n${slug} — ${found.length} illustration(s) ≥130px\n${'='.repeat(64)}`);

  for (const f of found) {
    const el = page.locator(`[data-audit-id="${f.i}"]`);
    const name = `${String(f.i).padStart(2, '0')}-${f.label}`;
    try {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(160);
      await el.screenshot({ path: `${outDir}/${name}.png` });
    } catch (e) {
      console.log(`  [${f.i}] ${f.label} — CAPTURE FAILED: ${e.message.slice(0, 50)}`);
      continue;
    }
    const flags = [];
    if (f.overflow) flags.push(`OVERFLOWS viewBox by ${f.overflow.worst}u (${f.overflow.vb})`);
    if (f.collisions.length) flags.push(`TEXT COLLISION ×${f.collisions.length}: ${f.collisions[0]}`);
    console.log(
      `  [${f.i}] ${f.label.padEnd(34)} ${String(f.w).padStart(4)}x${String(f.h).padEnd(4)} ` +
      `text:${String(f.texts).padStart(3)}  ${flags.length ? '⚠ ' + flags.join(' | ') : 'ok'}`
    );
  }
  await page.close();
}

await browser.close();
console.log('\nWrote crops to qa/art/<slug>/. View them individually to judge the drawing.');
