/**
 * Invented record sleeves, drawn in nothing but red, white and black.
 *
 * The four synthesis sites (anthology, union, chorus, finale) all need walls,
 * marquees and grids of album art. None of it may be photography or borrowed
 * artwork, so every sleeve here is a small SVG built out of the same geometry
 * the wordmark studies use: discs, hard bands, eclipsed circles, halftone.
 *
 * `sleeve()` returns a string for `set:html`, so a page can lay out fifty of
 * them without fifty components. The records, the artists and the catalogue
 * numbers are all fictional — nothing here is a claim about the product.
 */

export interface SleeveInk {
  /** The paper the sleeve is printed on. */
  ground: string;
  /** The single spot colour. */
  spot: string;
  /** Type and hairlines. */
  ink: string;
}

export const INK_LIGHT: SleeveInk = { ground: '#eeeae2', spot: '#d8002d', ink: '#14101a' };
export const INK_DARK: SleeveInk = { ground: '#14101a', spot: '#d8002d', ink: '#eeeae2' };
export const INK_RED: SleeveInk = { ground: '#d8002d', spot: '#14101a', ink: '#fdf6ec' };

export type SleeveKind =
  | 'eclipse'
  | 'band'
  | 'grooves'
  | 'halftone'
  | 'arc'
  | 'stack'
  | 'split'
  | 'target'
  | 'wave'
  | 'crop';

export const SLEEVE_KINDS: SleeveKind[] = [
  'eclipse',
  'band',
  'grooves',
  'halftone',
  'arc',
  'stack',
  'split',
  'target',
  'wave',
  'crop',
];

/**
 * Fictional records. Titles and artists are invented for the artwork; they are
 * never presented as anything the product ships with.
 */
export const RECORDS = [
  { title: 'Second Shadow', artist: 'Halo North' },
  { title: 'Long Measure', artist: 'Iona Petrel' },
  { title: 'Copper Weather', artist: 'Field Assembly' },
  { title: 'Ground Black', artist: 'Sable Field' },
  { title: 'Run-Out', artist: 'Paper Cinema' },
  { title: 'Quiet Geometry', artist: 'Air Index' },
  { title: 'Half-light', artist: 'North Window' },
  { title: 'Penumbra', artist: 'Common Weather' },
  { title: 'No Signal', artist: 'Quiet Motor' },
  { title: 'Home Server', artist: 'Kindred Lines' },
  { title: 'Every Room', artist: 'June Current' },
  { title: 'Full Measure', artist: 'Glass Arcade' },
  { title: 'Take It With You', artist: 'Low Tide Club' },
  { title: 'Own It', artist: 'The Hard Line' },
  { title: 'Local Only', artist: 'Nightside' },
  { title: 'Gapless', artist: 'Long Shadow' },
] as const;

/** A tiny deterministic hash, so a given seed always draws the same sleeve. */
function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

export interface SleeveOptions {
  kind?: SleeveKind;
  ink?: SleeveInk;
  /** Drawn at 120x120 and scaled by the caller's box. */
  seed?: string;
}

/**
 * One sleeve, as an SVG string.
 *
 * Every kind is built from the same vocabulary as the hero studies — an
 * eclipsed disc, a hard band, concentric grooves — so a wall of them reads as
 * one label's catalogue rather than a pile of unrelated graphics.
 */
export function sleeve(options: SleeveOptions = {}): string {
  const seed = options.seed ?? 'mozz';
  const rand = seeded(seed);
  const ink = options.ink ?? INK_LIGHT;
  const kind = options.kind ?? SLEEVE_KINDS[Math.floor(rand() * SLEEVE_KINDS.length)];
  const { ground, spot, ink: line } = ink;
  const uid = `s${Math.floor(rand() * 1e6).toString(36)}`;

  const base = `<rect width="120" height="120" fill="${ground}"/>`;
  let body = '';

  switch (kind) {
    case 'eclipse': {
      const off = 10 + rand() * 22;
      body = `
        <circle cx="60" cy="56" r="46" fill="none" stroke="${spot}" stroke-width="1.4" opacity="0.45"/>
        <circle cx="60" cy="56" r="34" fill="${spot}"/>
        <circle cx="${60 - off}" cy="${52 + rand() * 6}" r="31" fill="${ground}"/>
        <rect x="14" y="103" width="${28 + rand() * 30}" height="3" fill="${line}" opacity="0.7"/>`;
      break;
    }
    case 'band': {
      const y = 30 + rand() * 34;
      body = `
        <rect x="0" y="${y}" width="120" height="${16 + rand() * 14}" fill="${spot}"/>
        <rect x="0" y="${y - 9}" width="120" height="3" fill="${line}" opacity="0.75"/>
        <circle cx="${28 + rand() * 60}" cy="${y - 22}" r="11" fill="${line}" opacity="0.85"/>
        <rect x="14" y="102" width="42" height="3" fill="${line}" opacity="0.55"/>`;
      break;
    }
    case 'grooves': {
      const rings = Array.from({ length: 7 }, (_, i) => {
        const r = 12 + i * 7.4;
        return `<circle cx="60" cy="58" r="${r}" fill="none" stroke="${i % 2 ? spot : line}" stroke-width="${i % 2 ? 3 : 1.2}" opacity="${i % 2 ? 0.95 : 0.5}"/>`;
      }).join('');
      body = `${rings}<circle cx="60" cy="58" r="6" fill="${spot}"/>`;
      break;
    }
    case 'halftone': {
      body = `
        <defs><pattern id="${uid}" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="${2 + rand() * 1.4}" fill="${spot}"/>
        </pattern></defs>
        <rect width="120" height="120" fill="url(#${uid})" opacity="0.9"/>
        <rect x="0" y="${44 + rand() * 20}" width="120" height="22" fill="${line}"/>`;
      break;
    }
    case 'arc': {
      body = `
        <path d="M0 120A72 72 0 0 1 120 120Z" fill="${spot}"/>
        <path d="M22 120a38 38 0 0 1 76 0Z" fill="${ground}"/>
        <circle cx="60" cy="30" r="${9 + rand() * 6}" fill="${line}"/>`;
      break;
    }
    case 'stack': {
      const bars = Array.from({ length: 5 }, (_, i) => {
        const w = 26 + rand() * 74;
        return `<rect x="12" y="${20 + i * 17}" width="${w}" height="9" fill="${i === 2 ? spot : line}" opacity="${i === 2 ? 1 : 0.82}"/>`;
      }).join('');
      body = bars;
      break;
    }
    case 'split': {
      const x = 40 + rand() * 40;
      body = `
        <rect x="0" y="0" width="${x}" height="120" fill="${spot}"/>
        <circle cx="${x}" cy="60" r="${20 + rand() * 12}" fill="${line}"/>
        <rect x="${x + 8}" y="96" width="26" height="3" fill="${line}" opacity="0.6"/>`;
      break;
    }
    case 'target': {
      body = `
        <circle cx="60" cy="60" r="52" fill="${spot}"/>
        <circle cx="60" cy="60" r="38" fill="${ground}"/>
        <circle cx="60" cy="60" r="24" fill="${spot}"/>
        <circle cx="60" cy="60" r="10" fill="${line}"/>`;
      break;
    }
    case 'wave': {
      const bars = Array.from({ length: 16 }, (_, i) => {
        const h = 10 + rand() * 74;
        return `<rect x="${5 + i * 7.1}" y="${106 - h}" width="4.2" height="${h}" fill="${i % 3 === 0 ? spot : line}" opacity="${i % 3 === 0 ? 1 : 0.7}"/>`;
      }).join('');
      body = bars;
      break;
    }
    default: {
      /* A crop: two hard fields with a bar driven through them. Deliberately
         not the wordmark — the logo is a hero gesture, not wallpaper. */
      const y = 24 + rand() * 30;
      body = `
        <rect x="0" y="0" width="120" height="${y}" fill="${spot}"/>
        <rect x="0" y="${y + 20}" width="120" height="${100 - y}" fill="${line}" opacity="0.9"/>
        <rect x="${8 + rand() * 20}" y="${y - 6}" width="${58 + rand() * 40}" height="32" fill="${ground}"/>
        <circle cx="${86 + rand() * 20}" cy="${y + 10}" r="9" fill="${spot}"/>`;
    }
  }

  return `<svg viewBox="0 0 120 120" role="presentation" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">${base}${body}</svg>`;
}

/** A run of sleeves, for walls and marquees. */
export function sleeveRun(count: number, ink: SleeveInk, prefix = 'r'): string[] {
  return Array.from({ length: count }, (_, i) =>
    sleeve({ ink, seed: `${prefix}-${i}`, kind: SLEEVE_KINDS[(i * 3 + prefix.length) % SLEEVE_KINDS.length] })
  );
}
