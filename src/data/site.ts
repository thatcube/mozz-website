/**
 * Everything the variants say about Mozz, in one place.
 *
 * Each landing page below is a different *art direction*, not a different set
 * of claims — so the facts live here and every variant reads from them. If a
 * number or a feature changes in the app, it changes once, here.
 *
 * Sources (all verified against thatcube/Mozz on GitHub, never a local clone):
 *   README.md            — free forever, GPL-3.0 + App Store Exception, iOS now / tvOS planned
 *   docs/PRIVACY.md      — no account, no analytics, no telemetry; the MetaBrainz exception
 *   ARCHITECTURE.md §8   — FTS p95 15.7 ms @ 100k tracks, 75 ms time-to-first-audio
 *   Sources/MozzApp/Resources/Brands.xcassets — Plex, Jellyfin, Navidrome
 */

export const SITE = 'https://mozzmusic.com';
export const GITHUB_URL = 'https://github.com/thatcube/Mozz';
export const DONATE_URL = 'https://github.com/sponsors/thatcube';

/**
 * The App Store listing does not exist yet.
 *
 * Leave this empty and every variant renders its store button in a visibly
 * pending state instead of a dead link. Paste the real URL here — one place,
 * one edit — and all seven pages become live download buttons.
 */
export const APP_STORE_URL = '';

export const NAME = 'Mozz';
export const TAGLINE = 'One app for your music, wherever it lives.';
export const SUBLINE = 'Free forever. Open source.';

/** The brand red, sampled from docs/brand/mozz_logo.svg in the app repo. */
export const BRAND = {
  red: '#c80028',
  redBright: '#d6002b',
  redBody: '#b00023',
  redDeep: '#860000',
  rim: '#3e0606',
  cream: '#ffd6dc',
  ink: '#1b1c1e',
} as const;

/** The servers a listener can point Mozz at. */
export const SERVERS = [
  { name: 'Plex', note: 'Sign in with your Plex account and pick a library.' },
  { name: 'Jellyfin', note: 'Quick Connect or a plain username and password.' },
  { name: 'Navidrome', note: 'Any Subsonic-compatible server works.' },
] as const;

/** Verified capabilities. Nothing here is aspirational. */
export const FEATURES = [
  {
    title: 'Your servers, one library',
    body: 'Plex, Jellyfin and Navidrome behind a single interface. Add more than one and browse them like they were always the same collection.',
  },
  {
    title: 'Built to work offline',
    body: 'Downloads are part of the design, not an afterthought bolted on later. Take a record on the subway and it behaves exactly like it does at home.',
  },
  {
    title: 'Search that keeps up',
    body: 'The whole catalog lives in an on-device database. A hundred thousand tracks return in about 16 milliseconds, so the list moves while you type.',
  },
  {
    title: 'Starts instantly',
    body: 'Seventy-five milliseconds from tapping a track to hearing it. Gapless queue, so an album that was mixed to run together still runs together.',
  },
  {
    title: 'Radio that understands taste',
    body: 'Stations are built from real listening similarity by way of MusicBrainz and ListenBrainz, so a mellow track never seeds an hour of hard rock just because both are tagged "rock".',
  },
  {
    title: 'Tuned to your ears',
    body: 'A proper equalizer, plus playback that respects the file you actually own instead of quietly re-encoding it.',
  },
] as const;

/** The ownership argument, which is the whole point of the app. */
export const OWNERSHIP = [
  {
    title: 'No account',
    body: 'There is no Mozz login, because there is no Mozz server. The app talks to your server and nobody else.',
  },
  {
    title: 'No tracking',
    body: 'No analytics, no telemetry, no ad networks. Nothing phones home.',
  },
  {
    title: 'No subscription',
    body: 'Free forever, and open source under GPL-3.0. Every feature is in the free app, because there is no other kind.',
  },
  {
    title: 'No lock-in',
    body: 'Your files stay yours, on hardware you control. Walk away whenever you like and the music is still there.',
  },
] as const;

/** Measured, from ARCHITECTURE.md §8. */
export const STATS = [
  { value: '16ms', label: 'search across 100,000 tracks' },
  { value: '75ms', label: 'from tap to first note' },
  { value: '3', label: 'server types, one library' },
  { value: '$0', label: 'forever, and open source' },
] as const;

export const FAQS = [
  {
    q: 'What do I need to run it?',
    a: 'A Plex, Jellyfin or Navidrome server with your music on it. Mozz is the player; your server is the library.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. Free forever, open source under GPL-3.0 with an App Store Exception. There is no paid tier holding a feature hostage.',
  },
  {
    q: 'Does it work without a connection?',
    a: 'Download anything and it plays offline. The catalog is stored on the device, so browsing and searching work with the server unreachable.',
  },
  {
    q: 'What does it send about me?',
    a: 'Nothing about you. For recommendations it asks MusicBrainz and ListenBrainz what sounds similar to a given artist and title. That request carries no name, no server address, no account, and you can switch it off in Settings.',
  },
  {
    q: 'Which platforms?',
    a: 'iPhone and iPad today, written in SwiftUI. An Apple TV app is planned and shares the same core.',
  },
] as const;

/**
 * The vibes. Each is a complete landing page under /v/<slug>, so they can be
 * compared side by side and one can be promoted to the homepage.
 */
export interface Variant {
  slug: string;
  name: string;
  vibe: string;
  blurb: string;
  /** Swatches for the picker chip, dominant colour first. */
  swatch: [string, string, string];
  mood: 'light' | 'dark';
}

export const VARIANTS: Variant[] = [
  {
    slug: 'homelab',
    name: 'Homelab',
    vibe: 'a cutaway house with your server humming in it',
    blurb:
      'One enormous isometric cross-section: the machine in the basement, the cables in the walls, the music in every room and out the door. Self-hosting drawn as the place it actually happens.',
    swatch: ['#f4ead9', '#2f7d6e', '#e8703a'],
    mood: 'light',
  },
  {
    slug: 'spiral',
    name: 'Spiral',
    vibe: 'the groove of a disc, drawn as country you travel',
    blurb:
      'A disc holds one continuous spiral from the centre out. Here it becomes an isometric landscape at dusk, and the page is a journey along it.',
    swatch: ['#1d2233', '#e8a13a', '#5fc9c0'],
    mood: 'dark',
  },
  {
    slug: 'boxset',
    name: 'Box Set',
    vibe: 'everything that came in the box',
    blurb:
      'Mozz drawn as a physical product it never was — the box, the manual, the cartridges, the cable. Nothing is sold separately, because there is no paid tier.',
    swatch: ['#f7ede0', '#c80028', '#2f3e4e'],
    mood: 'light',
  },
  {
    slug: 'silverface',
    name: 'Silverface',
    vibe: 'a 1974 receiver, leaned all the way in',
    blurb:
      'Brushed aluminium, walnut end caps, a real VU needle and knurled controls. The Hi-Fi idea taken past restraint into full hardware.',
    swatch: ['#cdc9c1', '#8a8579', '#c80028'],
    mood: 'light',
  },
  {
    slug: 'transport',
    name: 'Transport',
    vibe: 'the page is the CD player',
    blurb:
      'No scrolling brochure. A disc transport you actually operate — load the tray, press play, skip tracks — and the product explains itself as you use it.',
    swatch: ['#17181c', '#c9ccd1', '#c80028'],
    mood: 'dark',
  },
  {
    slug: 'deck',
    name: 'Deck',
    vibe: 'a 1988 CD deck at 2am',
    blurb:
      'Black anodised, green fluorescent readouts, digital typography. The era the disc in the logo actually comes from.',
    swatch: ['#0a0b0d', '#35e08f', '#c80028'],
    mood: 'dark',
  },
  {
    slug: 'firstlisten',
    name: 'First Listen',
    vibe: 'unfamiliar hardware you cannot stop touching',
    blurb:
      'The wildcard. Built for the feeling of being handed a device you have never seen before and working out what it does by pressing things.',
    swatch: ['#e8ff54', '#16161b', '#ff4d6d'],
    mood: 'dark',
  },
  {
    slug: 'parlour',
    name: 'Parlour',
    vibe: 'a warm editorial listening room',
    blurb:
      'Cream and burnt orange, enormous display type, generous photography. Confident and expensive-looking — the most conventionally beautiful of the set.',
    swatch: ['#f2e9d8', '#e2701f', '#241c14'],
    mood: 'light',
  },
  {
    slug: 'diorama',
    name: 'Diorama',
    vibe: 'a desk drawer of retro tech, drawn',
    blurb:
      'Isometric illustrated scenes — disc players, cases, cables, headphones — flat colour and clean line. Charming and entirely hand-drawn.',
    swatch: ['#f7ede0', '#e8703a', '#3b6ea5'],
    mood: 'light',
  },
  {
    slug: 'vinyl',
    name: 'Vinyl',
    vibe: 'the groove itself',
    blurb:
      'Black wax, concentric grooves, a tonearm tracking down the page and a centre label. Quiet and precise, with red used the way a label prints it.',
    swatch: ['#0b0b0c', '#c80028', '#e8e4dc'],
    mood: 'dark',
  },
  {
    slug: 'neon',
    name: 'Neon',
    vibe: 'after hours, lights down',
    blurb:
      'Deep plum bleeding into ember behind a very large, very plain headline. Closest to the reference you sent, without the stock photograph.',
    swatch: ['#150a1e', '#c80028', '#7a3bd6'],
    mood: 'dark',
  },
  {
    slug: 'hifi',
    name: 'Hi-Fi',
    vibe: 'the separates in your rack',
    blurb:
      'Brushed aluminium, machined knobs, real VU needles and a dot-matrix readout. The ownership argument built out of hardware you can almost touch.',
    swatch: ['#c9c5bd', '#c80028', '#2b2d31'],
    mood: 'light',
  },
  {
    slug: 'pixel',
    name: 'Pixel',
    vibe: 'the logo, all the way up',
    blurb:
      'Takes the 8-bit mark as the entire design language. Everything snaps to a grid, shadows are hard, and there is not one gradient on the page.',
    swatch: ['#101014', '#c80028', '#f4f4f5'],
    mood: 'dark',
  },
  {
    slug: 'crate',
    name: 'Crate',
    vibe: 'the racks at the back of a record shop',
    blurb:
      'Genre divider cards, rubber stamps, price stickers and typewriter tags. Built out of the ritual of digging through music you own.',
    swatch: ['#ded3bd', '#c80028', '#2f2a22'],
    mood: 'light',
  },
  {
    slug: 'aurora',
    name: 'Aurora',
    vibe: 'morning light through glass',
    blurb:
      'Soft mesh colour, frosted panels and a great deal of air. The gentlest option, and the one that reads most like a modern product page.',
    swatch: ['#f6f3ff', '#c80028', '#8fa6f0'],
    mood: 'light',
  },
];
