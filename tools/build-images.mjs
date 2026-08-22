#!/usr/bin/env node
/**
 * Builds the responsive screenshot ladders in public/screenshots/ from the
 * pristine masters in screenshots-src/.
 *
 * Ported from the plozz-website pipeline, with the width ladders re-derived for
 * this site's contexts. Every published screenshot ships as a set of hashed
 * rungs in two formats:
 *
 *   mozz-nowplaying-660.a1b2c3d4.avif   <- primary, what almost everyone gets
 *   mozz-nowplaying-660.e5f6a7b8.webp   <- fallback for browsers without AVIF
 *
 * Encoder settings come from the plozz DSSIM sweep: at these sizes AVIF q85
 * -s 2 --yuv 444 measured both smaller and sharper than cwebp -q 95
 * -sharp_yuv. `--yuv 444` matters because these frames are full of small UI
 * text, which is exactly what chroma subsampling smears.
 *
 * Masters here are iPhone 16 Pro Max captures at 1320x2868 (3x), so no rung is
 * ever generated above 1320 — there are no pixels up there to serve.
 *
 * Usage:  node tools/build-images.mjs [--force] [--only <name>]
 */

import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';

const run = promisify(execFile);

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'screenshots-src');
const OUT_DIR = path.join(ROOT, 'public', 'screenshots');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'screenshots.json');

const AVIF = { quality: 85, speed: 2 };
const WEBP = { quality: 94 };

/**
 * Display contexts as a width ladder, sized from the painted width each
 * context can actually reach and then doubled or tripled for retina.
 *
 *   hero    the phone inside a hero device frame paints ~300 CSS px at most,
 *           so 900 covers 3x on the one image that is guaranteed to be the LCP
 *   figure  a screenshot standing alone in a section, up to ~440 CSS px
 *   tile    gallery/strip thumbnails, up to ~220 CSS px
 *
 * Deriving these from the stylesheet rather than measuring is how you end up
 * shipping a 2000px rung for a tile that can never paint wider than 220 CSS px.
 */
const LADDERS = {
  hero: [300, 480, 660, 900, 1320],
  figure: [280, 440, 660, 880, 1320],
  tile: [200, 320, 440, 660],
};

/**
 * Which ladder each master belongs to. An image used in more than one place
 * gets the union of its ladders, so the browser always has a rung close to the
 * size it actually needs.
 */
const USAGE = {
  'mozz-nowplaying': ['hero', 'figure', 'tile'],
  'mozz-album-red': ['hero', 'figure', 'tile'],
  'mozz-album-warm': ['figure', 'tile'],
  'mozz-album-dark': ['figure', 'tile'],
  'mozz-artist': ['figure', 'tile'],
  'mozz-playlist': ['figure', 'tile'],
};

/** Masters kept for safekeeping but not published. */
const UNPUBLISHED = new Set();

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIndex = args.indexOf('--only');
const only = onlyIndex === -1 ? null : args[onlyIndex + 1];

async function probe(file) {
  const { stdout } = await run('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file]);
  const width = Number(/pixelWidth:\s*(\d+)/.exec(stdout)?.[1]);
  const height = Number(/pixelHeight:\s*(\d+)/.exec(stdout)?.[1]);
  if (!width || !height) throw new Error(`Could not read dimensions from ${file}`);
  return { width, height };
}

/**
 * The rungs worth emitting for one master. The top rung is the smaller of the
 * master's native width and the widest size any of its contexts can render at.
 * Rungs within 12% of each other collapse, because the byte difference is not
 * worth an extra file or an extra srcset candidate for the browser to weigh.
 */
function widthsFor(name, nativeWidth) {
  const ladders = USAGE[name] ?? ['figure'];
  const ceiling = Math.max(...ladders.map((ladder) => Math.max(...LADDERS[ladder])));
  const top = Math.min(nativeWidth, ceiling);

  const wanted = new Set([top]);
  for (const ladder of ladders) {
    for (const width of LADDERS[ladder]) {
      if (width < top) wanted.add(width);
    }
  }

  const sorted = [...wanted].sort((a, b) => a - b);
  const kept = [];
  for (const width of sorted) {
    const previous = kept[kept.length - 1];
    if (previous && width / previous < 1.12) kept[kept.length - 1] = width;
    else kept.push(width);
  }
  return kept;
}

/**
 * Build-input fingerprint for one rung: the master's bytes, the width, and the
 * exact encoder settings. It goes in the filename, which is what lets
 * public/_headers serve these as `immutable` honestly — re-shooting a master or
 * changing a quality setting lands on a new URL instead of silently rewriting
 * bytes a visitor may have cached for a year.
 */
function rungHash(masterBytes, width, recipe) {
  return createHash('sha256')
    .update(masterBytes)
    .update(`|${width}|${recipe}`)
    .digest('hex')
    .slice(0, 8);
}

const AVIF_RECIPE = `avif-q${AVIF.quality}-s${AVIF.speed}-yuv444`;
const WEBP_RECIPE = `webp-q${WEBP.quality}-m6-sharpyuv`;

/**
 * Each rung is resized from the master by ImageMagick into a temporary PNG, so
 * every encode starts from pristine pixels rather than downscaling an
 * already-lossy intermediate. Anything already on disk under the right hashed
 * name is by definition current, so it is skipped.
 */
async function encodeRung({ master, masterBytes, width, isNative, name, tmpDir }) {
  const avifName = `${name}-${width}.${rungHash(masterBytes, width, AVIF_RECIPE)}.avif`;
  const webpName = `${name}-${width}.${rungHash(masterBytes, width, WEBP_RECIPE)}.webp`;
  const avifOut = path.join(OUT_DIR, avifName);
  const webpOut = path.join(OUT_DIR, webpName);

  const needAvif = force || !existsSync(avifOut);
  const needWebp = force || !existsSync(webpOut);
  if (!needAvif && !needWebp) return { avif: avifName, webp: webpName, skipped: true };

  const resized = path.join(tmpDir, `${name}-${width}.png`);
  if (isNative) {
    await run('magick', [master, '-colorspace', 'sRGB', '-depth', '8', resized]);
  } else {
    await run('magick', [
      master,
      '-colorspace', 'sRGB',
      '-filter', 'Lanczos',
      '-resize', `${width}x`,
      '-depth', '8',
      resized,
    ]);
  }

  await Promise.all([
    needAvif
      ? run('avifenc', ['-q', String(AVIF.quality), '-s', String(AVIF.speed), '--yuv', '444', resized, avifOut])
      : Promise.resolve(),
    needWebp
      ? run('cwebp', ['-q', String(WEBP.quality), '-m', '6', '-sharp_yuv', '-quiet', resized, '-o', webpOut])
      : Promise.resolve(),
  ]);

  await rm(resized, { force: true });
  return { avif: avifName, webp: webpName, skipped: false };
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const tmpDir = path.join(os.tmpdir(), `mozz-img-${process.pid}`);
  await mkdir(tmpDir, { recursive: true });

  const entries = (await readdir(SRC_DIR)).filter((file) => /\.(png|jpe?g)$/i.test(file));

  // A partial run must not drop the other images from the manifest, or every
  // Shot that is not being rebuilt throws and the site stops building.
  const manifest = only ? await readManifest() : {};
  let written = 0;
  let skipped = 0;

  for (const entry of entries.sort()) {
    const name = entry.replace(/\.(png|jpe?g)$/i, '');
    if (UNPUBLISHED.has(name)) {
      delete manifest[name];
      continue;
    }
    if (only && name !== only) continue;

    const master = path.join(SRC_DIR, entry);
    const masterBytes = await readFile(master);
    const { width: nativeWidth, height: nativeHeight } = await probe(master);
    const widths = widthsFor(name, nativeWidth);
    const top = widths[widths.length - 1];

    const rungs = [];
    for (const width of widths) {
      const { avif, webp, skipped: wasSkipped } = await encodeRung({
        master, masterBytes, width, isNative: width === nativeWidth, name, tmpDir,
      });
      rungs.push({ w: width, avif, webp });
      if (wasSkipped) skipped += 1;
      else written += 1;
    }

    manifest[name] = {
      // Intrinsic size of the widest rung. The <img> carries these so the box
      // is reserved before a byte of image arrives, which keeps CLS at zero on
      // a slow connection.
      width: top,
      height: Math.round((nativeHeight / nativeWidth) * top),
      rungs,
    };
    process.stdout.write(
      `  ${name.padEnd(20)} master ${String(nativeWidth).padStart(4)}px  ->  ${widths.join(', ')}\n`
    );
  }

  /*
   * Sweep up anything no longer referenced: rungs from a previous ladder, and
   * pre-hash filenames. Without this, changing a ladder leaves stale files that
   * still get deployed — and, being served immutable, cached for a year.
   */
  const wanted = new Set();
  for (const entry of Object.values(manifest)) {
    for (const rung of entry.rungs) {
      wanted.add(rung.avif);
      wanted.add(rung.webp);
    }
  }

  const prunable = only
    ? new RegExp(`^${only.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+\\.`)
    : /\.(avif|webp)$/i;

  let pruned = 0;
  for (const file of await readdir(OUT_DIR)) {
    if (wanted.has(file)) continue;
    if (!prunable.test(file)) continue;
    await rm(path.join(OUT_DIR, file), { force: true });
    pruned += 1;
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  await rm(tmpDir, { recursive: true, force: true });
  console.log(`\nEncoded ${written} rung(s), ${skipped} already current, pruned ${pruned} stale file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
