import manifest from './screenshots.json';

export interface ShotRung {
  w: number;
  avif: string;
  webp: string;
}

export interface ShotEntry {
  /** Intrinsic size of the widest rung, used for the <img> width/height. */
  width: number;
  height: number;
  rungs: ShotRung[];
}

const shots = manifest as Record<string, ShotEntry>;

export function shot(name: string): ShotEntry {
  const entry = shots[name];
  if (!entry) {
    throw new Error(
      `No screenshot named "${name}". Run \`npm run images\` after adding a master to screenshots-src/.`
    );
  }
  return entry;
}

/**
 * Filenames carry a build-input hash, so they are safe to serve as immutable
 * and are never hand-written — tools/build-images.mjs puts them in the manifest
 * and everything here reads them back out.
 */
export function shotSrcset(name: string, extension: 'avif' | 'webp'): string {
  return shot(name)
    .rungs.map((rung) => `/screenshots/${rung[extension]} ${rung.w}w`)
    .join(', ');
}

/** The widest rung, used as the plain <img> fallback inside <picture>. */
export function shotFallback(name: string, extension: 'avif' | 'webp' = 'webp'): string {
  const { rungs } = shot(name);
  return `/screenshots/${rungs[rungs.length - 1][extension]}`;
}

/** Every published master, for gallery/strip call sites that want them all. */
export const SHOT_NAMES = Object.keys(shots);

/**
 * Alt text lives here rather than at each call site so the seven variants
 * cannot drift into describing the same screen six different ways.
 *
 * Each one names the screen and the fact that the interface has taken its
 * colour from the artwork, because that adaptive tint is the thing a sighted
 * visitor actually notices and a screen-reader user would otherwise miss.
 */
export const SHOT_ALT: Record<string, string> = {
  'mozz-nowplaying':
    'The Mozz now-playing screen, its interface tinted violet to match the album artwork above the transport controls.',
  'mozz-album-red':
    'An album page in Mozz, the whole screen tinted deep red to match the record’s sleeve, with a track list below.',
  'mozz-album-warm':
    'An album page in Mozz tinted warm amber to match its cover, showing play, shuffle and download actions.',
  'mozz-album-dark':
    'An album page in Mozz tinted dark crimson to match its cover, with the full track list and running time.',
  'mozz-artist':
    'An artist page in Mozz, tinted sepia to match the artist photo filling the top of the screen, with top songs listed below.',
  'mozz-playlist':
    'A playlist in Mozz tinted cool silver, listing tracks from several artists with a mini player docked at the bottom.',
};

export function shotAlt(name: string): string {
  return SHOT_ALT[name] ?? 'A screenshot of the Mozz app.';
}
