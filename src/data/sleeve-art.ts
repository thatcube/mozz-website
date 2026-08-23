/**
 * The sleeve system.
 *
 * A single vocabulary of flat, hard-edged marks — the Blue Note / ECM / Vignelli
 * lineage — shared by every page that speaks this language. Four concepts
 * (`sleeve`, `rota`, `emblem`, `pressing`) compose from these primitives, so the
 * set reads as one house style rather than four unrelated drawings.
 *
 * Rules of the system, enforced by the components that consume it:
 *   – absolutely flat. No gradient, no shadow, no glow, no blur.
 *   – three inks only: bone, near-black, one signal red.
 *   – everything on a strict grid, drawn in a 100×100 field.
 *   – the marks are diagrams. Past the one library wall each page is allowed,
 *     a mark has to be explaining something to earn its place.
 *
 * Palette values are sampled from what the repo already prints with — BRAND in
 * src/data/site.ts, the paper and ink of /v/ledger, the bone and red of /h/umbra
 * — rather than invented here.
 */

export const SLEEVE = {
  /** /v/ledger's paper. The default ground for a light page. */
  bone: '#f2efe6',
  /** /h/umbra's bone, a half-step cooler. */
  paper: '#eeeae2',
  /** One step down, for a panel that must separate from the ground. */
  boneDeep: '#e3ded1',
  /** /v/ledger's ink. */
  ink: '#131313',
  /** BRAND.ink — slightly open, for large fields. */
  inkSoft: '#1b1c1e',
  /** The ground for a dark page. */
  night: '#0d0d0e',
  /** BRAND.red. The only signal colour. */
  red: '#c80028',
  /** /h/umbra's red, for a mark that has to hold against black. */
  redBright: '#d8002d',
  /** /v/ledger's hairline. */
  rule: '#cdc7b8',
} as const;

/**
 * The marks.
 *
 * `rings`      concentric rings with a solid centre — a record, a target.
 * `vesica`     two crossing ellipses forming a lens, centre dot — an eye, an orbit.
 * `rules`      stacked hairlines of varying length — liner notes, a track list.
 * `disc`       a filled circle with one radial cue line.
 * `nowplaying` a solid red square holding a bone circle with a centre dot.
 * `cutring`    a ring with a clean gap cut out of it.
 * `bars`       graduated bars built from the hairline logic.
 * `arcs`       nested quarter arcs, one corner.
 * `quadrant`   a ring with a single quadrant filled.
 * `halves`     a circle split hard down the middle.
 * `crosshair`  a ring crossed by two full-bleed hairlines.
 * `nest`       three concentric squares.
 * `lens`       one ellipse, on its side, with a centre bar.
 */
export type MotifKind =
  | 'rings'
  | 'vesica'
  | 'rules'
  | 'disc'
  | 'nowplaying'
  | 'cutring'
  | 'bars'
  | 'arcs'
  | 'quadrant'
  | 'halves'
  | 'crosshair'
  | 'nest'
  | 'lens';

export interface Motif {
  kind: MotifKind;
  /** Feeds the deterministic variation inside a mark. */
  seed: number;
  /** Whether this tile carries the signal red. Roughly one in five. */
  red: boolean;
  /** Whether this tile is inked solid, so the wall has weight in it. */
  inked: boolean;
}

/**
 * mulberry32.
 *
 * The wall has to be identical on every build, or the committed thumbnails
 * churn on a page nobody touched. Deterministic, seeded, and cheap.
 */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WALL_KINDS: MotifKind[] = [
  'rings',
  'vesica',
  'rules',
  'disc',
  'nowplaying',
  'cutring',
  'bars',
  'arcs',
  'quadrant',
  'halves',
  'crosshair',
  'nest',
  'lens',
];

/**
 * A library wall.
 *
 * Deliberately unbalanced in the way a real shelf is: mostly line, a little
 * solid ink, and red on about one tile in five so the eye has somewhere to land.
 */
export function sleeveWall(count: number, seed = 7): Motif[] {
  const random = rng(seed);
  const wall: Motif[] = [];
  let sinceRed = 0;
  let sinceInk = 0;

  for (let i = 0; i < count; i += 1) {
    const kind = WALL_KINDS[Math.floor(random() * WALL_KINDS.length)];
    const wantsRed = kind === 'nowplaying' || sinceRed >= 6 || random() < 0.16;
    const wantsInk = kind !== 'nowplaying' && (sinceInk >= 9 || random() < 0.12);

    sinceRed = wantsRed ? 0 : sinceRed + 1;
    sinceInk = wantsInk ? 0 : sinceInk + 1;

    wall.push({
      kind,
      seed: Math.floor(random() * 4096),
      red: wantsRed,
      inked: wantsInk && !wantsRed,
    });
  }

  return wall;
}

/**
 * Placeholder catalogue entries.
 *
 * Nothing here is a product claim — these are stand-in record titles so a
 * library wall reads as a library, in the same spirit as the sample index rows
 * on /v/ledger. Every factual statement on these pages comes from site.ts.
 */
export const CATALOG = [
  { no: 'A-101', artist: 'Sable Atlas', title: 'Penumbra Rooms' },
  { no: 'A-102', artist: 'Low Orchard', title: 'Glasshouse Sunday' },
  { no: 'A-103', artist: 'Mara Vale', title: 'Quarter-inch Weather' },
  { no: 'A-104', artist: 'The Foundry Choir', title: 'Night Receipt' },
  { no: 'B-201', artist: 'Golden Index', title: 'Shelf Register' },
  { no: 'B-202', artist: 'Aster House', title: 'Private Wing' },
  { no: 'B-203', artist: 'North Annex', title: 'Catalog Light' },
  { no: 'B-204', artist: 'Vera Signal', title: 'Plain Copy' },
  { no: 'C-301', artist: 'Paper Channel', title: 'Third Drawer' },
  { no: 'C-302', artist: 'Rook & Rail', title: 'Platform Ledger' },
  { no: 'C-303', artist: 'Clerk of Waves', title: 'Filed Under Home' },
  { no: 'C-304', artist: 'The Quiet Archive', title: 'Building Copy' },
] as const;

/** Short technical keys, one per FEATURES entry, for pages that set a rail. */
export interface FeatureMark {
  key: string;
  kind: MotifKind;
  /** Why that mark, in the register of a plate caption. */
  note: string;
}

/**
 * A mark per capability.
 *
 * Kept here rather than in each page so the four concepts agree about which
 * drawing stands for which feature. The accessor falls back rather than
 * throwing, because src/data/site.ts is edited far more often than this file
 * and a new claim must never take a page down.
 */
export const FEATURE_MARKS: FeatureMark[] = [
  { key: 'CAT', kind: 'rings', note: 'the catalogue, mirrored ring by ring' },
  { key: 'OFF', kind: 'vesica', note: 'stream and offline, the same size' },
  { key: 'FTS', kind: 'rules', note: 'the register, narrowing as you type' },
  { key: 'CUE', kind: 'crosshair', note: 'tap, and the needle is already down' },
  { key: 'RAD', kind: 'quadrant', note: 'a bearing taken across your own shelves' },
  { key: 'WKY', kind: 'lens', note: 'one week, cut from what you already own' },
  { key: 'EQ', kind: 'bars', note: 'ten bands, and no paid tier behind them' },
  { key: 'ASK', kind: 'arcs', note: 'a request leaving the room and coming back' },
];

export function featureMark(i: number): FeatureMark {
  return (
    FEATURE_MARKS[i] ?? {
      key: `F${String(i + 1).padStart(2, '0')}`,
      kind: WALL_KINDS[i % WALL_KINDS.length],
      note: '',
    }
  );
}

/** A plate per ownership clause. The subscription clause carries the red. */
export const TERM_MARKS: { key: string; kind: MotifKind; red: boolean }[] = [
  { key: 'NO ACCT', kind: 'vesica', red: false },
  { key: 'NO TRACK', kind: 'crosshair', red: false },
  { key: 'NO SUB', kind: 'nowplaying', red: true },
  { key: 'NO LOCK', kind: 'cutring', red: false },
];

export function termMark(i: number) {
  return (
    TERM_MARKS[i] ?? {
      key: `T${String(i + 1).padStart(2, '0')}`,
      kind: WALL_KINDS[(i + 3) % WALL_KINDS.length],
      red: false,
    }
  );
}

/**
 * Real hardware, in millimetres, so a drawn device is never a stretched
 * rectangle. iPhone 15/16 class and iPad Pro 11".
 */
export const DEVICE_RATIO = {
  iphone: { w: 71.6, h: 147.6 },
  ipad: { w: 178.5, h: 247.6 },
} as const;

/**
 * The search-narrowing diagram's rungs.
 *
 * Stacked hairlines whose count and length collapse as a query gets longer —
 * the on-device catalogue answering while you are still typing.
 */
export function narrowingSteps(): { query: string; rows: number[] }[] {
  return [
    { query: '', rows: [96, 88, 92, 74, 84, 90, 68, 80, 94, 72, 86, 78] },
    { query: 'g', rows: [88, 74, 92, 66, 80, 70, 84] },
    { query: 'gl', rows: [82, 68, 76, 60] },
    { query: 'gla', rows: [74, 58] },
    { query: 'glass', rows: [64] },
  ];
}

/** Graduated bar heights for the equalizer mark, in field units. */
export const EQ_BANDS = [34, 52, 66, 58, 44, 62, 76, 48, 38, 56] as const;
