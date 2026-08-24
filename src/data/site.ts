/**
 * Everything the variants say about Mozz, in one place.
 *
 * Each landing page below is a different *art direction*, not a different set
 * of claims — so the facts live here and every variant reads from them. If a
 * number or a feature changes in the app, it changes once, here.
 *
 * Sources (all verified against thatcube/Mozz on GitHub, never a local clone):
 *   README.md            — tagline, server support, streaming/offline parity, privacy, platforms
 *   docs/PRIVACY.md      — no Mozz account, analytics, or telemetry; optional enrichment services
 *   ARCHITECTURE.md §8   — FTS p95 15.7 ms @ 100k tracks, 75 ms time-to-first-audio
 *   Sources/MozzApp/Resources/Brands.xcassets — Plex, Jellyfin, Navidrome
 *   Sources/MozzRecommend/RecommendationService.swift — offline Mozz Weekly mixes
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
  { name: 'Navidrome', note: 'The tested OpenSubsonic server; other compatible servers are best-effort.' },
] as const;

/** Verified capabilities. Nothing here is aspirational. */
export const FEATURES = [
  {
    title: 'Your library, mirrored on-device',
    body: 'Connect Plex, Jellyfin, or a Subsonic/OpenSubsonic server such as Navidrome. Mozz syncs its catalog into a local database, so browsing and search stay fast when the server is unreachable.',
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
    title: 'Radio and discovery on your terms',
    body: 'MusicBrainz and ListenBrainz can sharpen radio, mixes, and shuffle when enrichment is enabled. Turn it off and local genre-based recommendations still work.',
  },
  {
    title: 'A new mix every week',
    body: 'Mozz Weekly builds a fresh set from music already in your library. It runs on your device and stays available offline, so discovery never depends on a subscription service.',
  },
  {
    title: 'Tuned to your ears',
    body: 'A proper equalizer, plus playback that respects the file you actually own instead of quietly re-encoding it.',
  },
  {
    title: 'Ask for it out loud',
    body: 'Siri plays a song, album, artist, playlist, genre, liked songs or a mix straight from your own library — including from a HomePod, which has no apps of its own and hands the request to your iPhone to play and AirPlay back.',
  },
] as const;

/**
 * Where Mozz runs.
 *
 * Six platforms, in the order a listener is most likely to meet them. The
 * `note` is for layouts that can afford a word of detail; `short` is for
 * dense strips where only the name fits.
 *
 * PLATFORM_LINE is the one-sentence version, so a hero that has room for a
 * sentence and a hero that has room for a list are still saying the same
 * thing. Never write a different summary inline — change it here.
 */
export const PLATFORMS = [
  { name: 'iPhone', short: 'iPhone', family: 'mobile' },
  { name: 'iPad', short: 'iPad', family: 'mobile' },
  { name: 'Android', short: 'Android', family: 'mobile' },
  { name: 'macOS', short: 'Mac', family: 'desktop' },
  { name: 'Windows', short: 'Windows', family: 'desktop' },
  { name: 'Linux', short: 'Linux', family: 'desktop' },
] as const;

export const PLATFORM_LINE =
  'On iPhone, iPad, Android, Mac, Windows and Linux.';

/** What actually carries between a listener's devices.
 *
 * Deliberately narrow. The README supports two things: iCloud Keychain moves
 * the sign-in, and Handoff advertises the destination you are on. It does NOT
 * say downloads or the play queue sync — downloads are saved per device — so
 * neither is claimed here.
 *
 * Both mechanisms are Apple's, and Mozz now runs on six platforms, so the
 * sentence names Apple devices out loud. Unscoped, "your other devices" would
 * read as a cross-platform sync service — which is precisely the thing this
 * app does not have.
 */
export const CONTINUITY = {
  title: 'Pick up on the other one',
  body: 'On your Apple devices, sign in once and iCloud Keychain carries your server across. Handoff passes the album, artist or playlist you are on straight to the one in your hand, so it is already waiting.',
} as const;

/** The ownership argument, which is the whole point of the app. */
export const OWNERSHIP = [
  {
    title: 'No account',
    body: 'There is no Mozz account and no Mozz server. Sign in only to the media server you already run.',
  },
  {
    title: 'No tracking',
    body: 'No analytics, telemetry, or ad networks. Optional lyrics and recommendation enrichment contact only the named open services when enabled.',
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
  { value: '3', label: 'compatible server families' },
  { value: '$0', label: 'forever, and open source' },
] as const;

export const FAQS = [
  {
    q: 'What do I need to run it?',
    a: 'A Plex, Jellyfin, or Subsonic/OpenSubsonic server with your music on it. Navidrome is the tested OpenSubsonic target; other compatible servers are best-effort.',
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
    a: 'Mozz has no backend, analytics, or telemetry. Plex sign-in uses Plex services; lyrics and recommendation enrichment can contact LRCLIB, MusicBrainz, and ListenBrainz when enabled. Enrichment can be switched off.',
  },
  {
    q: 'Which platforms?',
    a: 'iPhone, iPad, Android, Mac, Windows and Linux \u2014 the same library and the same player on all six.',
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
  {
    slug: 'prism',
    name: 'Prism',
    vibe: 'one beam in, your whole library out',
    blurb:
      'A full-screen hero built as a single shaft of light crossing the frame, striking glass and opening into a spectrum that carries your library off the edge. Immersive from the first pixel.',
    swatch: ['#f3f1fb', '#c80028', '#7d8ff0'],
    mood: 'light',
  },
  {
    slug: 'signal',
    name: 'Signal',
    vibe: 'your house, broadcasting to everything you own',
    blurb:
      'Enormous concentric rings pour out of one small rooftop aerial and run off all four edges of the screen. Your devices ride the rings. The page is the broadcast.',
    swatch: ['#eef4f4', '#c80028', '#2f7d6e'],
    mood: 'light',
  },
  {
    slug: 'strata',
    name: 'Strata',
    vibe: 'a sky of light over one lit window',
    blurb:
      'Full-bleed curtains of colour stacked to the horizon, with a single house below holding the only warm light on the page. The quiet, cinematic one.',
    swatch: ['#101a2c', '#c80028', '#5ee0b8'],
    mood: 'dark',
  },
  {
    slug: 'constellation',
    name: 'Constellation',
    vibe: 'your library projected across a listening planetarium',
    blurb:
      'Album stars fill an architectural dome while server projectors, a radio azimuth, weekly constellations and download meteors turn the whole room into the player.',
    swatch: ['#050822', '#728cff', '#6df5ca'],
    mood: 'dark',
  },
  {
    slug: 'archive',
    name: 'Archive',
    vibe: 'an endless aisle through every record you own',
    blurb:
      'A monumental one-point-perspective music archive with three collection wings, an offline checkout desk and glowing routes for radio and weekly mixes.',
    swatch: ['#0c0c08', '#c49a5c', '#57d2bd'],
    mood: 'dark',
  },
  {
    slug: 'subway',
    name: 'Subway',
    vibe: 'the signal ends, but the record keeps playing',
    blurb:
      'A night train enters the tunnel while downloaded albums stay lit inside. Playback, weekly mixes and source lines become the carriage architecture.',
    swatch: ['#03060d', '#f24b77', '#ffb21c'],
    mood: 'dark',
  },
  {
    slug: 'radioland',
    name: 'Radio Land',
    vibe: 'a whole listening landscape drawn as one map',
    blurb:
      'Server hill, radio towers, familiar weekly routes and an offline train make the product discoverable by exploring a single illustrated country.',
    swatch: ['#eef0bd', '#87a95e', '#173f37'],
    mood: 'light',
  },
  {
    slug: 'portal',
    name: 'Portal',
    vibe: 'the app opens into the library you already own',
    blurb:
      'A room-sized phone doorway reveals album halls, a listening stage and glowing mix paths while records and download crates spill into the foreground.',
    swatch: ['#09050e', '#8f467b', '#f2a94a'],
    mood: 'dark',
  },
  {
    slug: 'tideline',
    name: 'Tideline',
    vibe: 'a sea of music, charted from the surface down',
    blurb:
      'A lighthouse broadcasts above album strata while weekly currents cross the library and downloaded favorites glow safely in a sheltered reef.',
    swatch: ['#071a24', '#49bea9', '#e0a55c'],
    mood: 'dark',
  },

  /* ------------------------------------------------------------------ *
   * Round five — ten full sites built out of the red / white / black
   * oversized-type language the hero studies landed on. Same ink, ten
   * different systems: print, machine, room, signal.
   * ------------------------------------------------------------------ */
  {
    slug: 'ledger',
    name: 'Ledger',
    vibe: 'your library, set as a printed index',
    blurb:
      'The whole catalogue as one enormous ruled index — tabular numerals, hairline rules, a red reading line that tracks down the page. Editorial, dense and completely calm.',
    swatch: ['#f2efe6', '#c80028', '#131313'],
    mood: 'light',
  },
  {
    slug: 'broadside',
    name: 'Broadside',
    vibe: 'a newspaper printed the day you took your music back',
    blurb:
      'Broadsheet columns, a condensed masthead running the full measure, halftone dots and red overprint sitting a hair out of register. Loud, fast and unmistakably printed.',
    swatch: ['#efe9dc', '#c80028', '#111010'],
    mood: 'light',
  },
  {
    slug: 'gatefold',
    name: 'Gatefold',
    vibe: 'the sleeve opens and the liner notes are the site',
    blurb:
      'A double sleeve unfolding down the page: spine, hinge, inner spread, credits set like liner notes. Every section is another panel of the same record.',
    swatch: ['#100d0c', '#c80028', '#e8dfd0'],
    mood: 'dark',
  },
  {
    slug: 'tapepath',
    name: 'Tape Path',
    vibe: 'one length of tape threaded through the whole page',
    blurb:
      'A single red ribbon leaves the supply reel in the hero, threads every head and guide on the way down and winds up at the take-up reel in the footer. One continuous gesture.',
    swatch: ['#0c0c0e', '#c80028', '#dedae0'],
    mood: 'dark',
  },
  {
    slug: 'patchbay',
    name: 'Patchbay',
    vibe: 'you own the routing',
    blurb:
      'A studio patchbay where every section is a module and red cables carry the signal between them. Self-hosting drawn as the thing it is: your own signal path, nobody in the middle.',
    swatch: ['#17181b', '#c80028', '#e4e2dd'],
    mood: 'dark',
  },
  {
    slug: 'nightdrive',
    name: 'Night Drive',
    vibe: 'no bars, and the album keeps playing',
    blurb:
      'Black road, white line, one red tail-light. Built entirely around the moment the signal drops and the downloaded record does not. The most cinematic and the most empty.',
    swatch: ['#070708', '#c80028', '#f3f1ec'],
    mood: 'dark',
  },
  {
    slug: 'tuner',
    name: 'Tuner',
    vibe: 'the page is a dial and your servers are the stations',
    blurb:
      'A full-width tuning scale with a red needle that tracks the scroll. Every section is a station you land on — servers, offline, radio, the licence.',
    swatch: ['#f4f2ec', '#c80028', '#191817'],
    mood: 'light',
  },
  {
    slug: 'amplitude',
    name: 'Amplitude',
    vibe: 'one waveform, top to bottom',
    blurb:
      'A single colossal red waveform runs the entire document, and each section is a moment inside it — the loud part, the drop-out, the run-out. Nothing else on the page competes.',
    swatch: ['#faf9f7', '#c80028', '#0d0d0f'],
    mood: 'light',
  },
  {
    slug: 'longplay',
    name: 'Long Play',
    vibe: 'side a, side b, and a run-out groove',
    blurb:
      'Paced like an album. Sections are tracks with timings in the margin, the page turns over halfway down, and the last thing you reach is the run-out.',
    swatch: ['#0a0a0b', '#c80028', '#f0ece3'],
    mood: 'dark',
  },
  {
    slug: 'blackout',
    name: 'Blackout',
    vibe: 'the network stops here and the music does not',
    blurb:
      'One hard line across the page. Above it the connection, below it nothing at all — except the album still playing. The trust argument as the entire composition.',
    swatch: ['#0b0b0d', '#c80028', '#f5f4f1'],
    mood: 'dark',
  },

  /* ------------------------------------------------------------------ *
   * Round six — the sleeve system.
   *
   * Four sites built entirely out of one album-artwork language: Swiss /
   * International modernist record-sleeve design in the Blue Note, ECM and
   * Vignelli lineage. Flat geometric abstraction, bone and near-black and one
   * signal red, no gradient or shadow anywhere. The marks — concentric rings,
   * a crossing-ellipse lens, stacked hairlines, a cut ring, a red square
   * holding a bone circle — are shared through src/data/sleeve-art.ts and
   * src/components/sleeve/, so all four speak the same vocabulary while
   * arguing it from four different structures.
   * ------------------------------------------------------------------ */
  {
    slug: 'sleeve',
    name: 'Sleeve',
    vibe: 'the record cover as the whole design system',
    blurb:
      'Bone paper, a hard 12-column grid and one enormous square plate per idea. Two crossing ellipses do the arguing: streaming in one, downloads in the other, and your library where they overlap.',
    swatch: ['#f2efe6', '#c80028', '#131313'],
    mood: 'light',
  },
  {
    slug: 'rota',
    name: 'Rota',
    vibe: 'everything on the page turns',
    blurb:
      'Near-black, centred on a single spine, every section a circular plate. Concentric rings radiate from the server you own and a red playhead travels the ring, so rotation is the structure and not a decoration.',
    swatch: ['#0d0d0e', '#c80028', '#f2efe6'],
    mood: 'dark',
  },
  {
    slug: 'emblem',
    name: 'Emblem',
    vibe: 'a museum catalogue of identification plates',
    blurb:
      'A ruled left rail and a plate for every claim, each stamped with the red square holding a bone circle. Stacked hairlines do the explaining: the on-device catalogue narrowing as you type.',
    swatch: ['#eeeae2', '#c80028', '#1b1c1e'],
    mood: 'light',
  },
  {
    slug: 'pressing',
    name: 'Pressing',
    vibe: 'your own copy, coming off the line',
    blurb:
      'Full-bleed bands of ink, red and bone, read as stations in a pressing plant. The ring with a notch cut out of it and graduated equalizer bars carry the argument that the copy in your hand is finished.',
    swatch: ['#0b0b0c', '#d8002d', '#f2efe6'],
    mood: 'dark',
  },

  /* ------------------------------------------------------------------ *
   * Round seven — the next generation of the four favourite hero studies.
   *
   * Not extensions of umbra / cover / poster / eclipse: siblings. Each
   * carries the family DNA — a wordmark at poster scale, a solid object
   * that interrupts the type, red / cream / black and nothing else, one
   * gesture per page — but opens on a composition the originals never
   * made. Appended in one block at the end of the array on purpose, so
   * three sessions can add variants at once without colliding.
   * ------------------------------------------------------------------ */
  {
    slug: 'syzygy',
    name: 'Syzygy',
    vibe: 'three bodies in a line, and everything behind them goes dark',
    blurb:
      'A colossal MOZZ runs the width of the frame while a black disc crosses in front of a cream one, and the shadow it throws falls the whole height of the page with the phone standing at the end of it.',
    swatch: ['#08070a', '#c80028', '#efe9df'],
    mood: 'dark',
  },
  {
    slug: 'imprint',
    name: 'Imprint',
    vibe: 'a block of ink laid over the wordmark, and everything under it reverses',
    blurb:
      'One enormous MOZZ set in black on paper, with a solid red block pressed across it. Inside the block the letters knock out to cream and the phone reverses with them — one object, two states, a single hard edge.',
    swatch: ['#f3ede2', '#c80028', '#121011'],
    mood: 'light',
  },
  {
    slug: 'masthead',
    name: 'Masthead',
    vibe: 'the wordmark flies as a flag and the app comes up through it',
    blurb:
      'A full-measure MOZZ locked to the top of the page like a broadsheet flag, pierced from below by the phone so the letters behind it simply stop. Hairline rules, one red mark per band, nothing else.',
    swatch: ['#f5f2ea', '#c80028', '#141312'],
    mood: 'light',
  },
  {
    slug: 'halftone',
    name: 'Halftone',
    vibe: 'the word only resolves where the app is',
    blurb:
      'MOZZ drawn as a field of dots on black. The dots open up at the edges of the frame and close to solid red where the phone crosses, so the wordmark focuses around the thing that plays it.',
    swatch: ['#0a0a0c', '#c80028', '#ece6da'],
    mood: 'dark',
  },

  /* ------------------------------------------------------------------ *
   * SYNTHESIS SET — four finished sites, appended as one block.
   *
   * Each of these combines all four of the hero studies Brandon picked —
   * umbra's graded light, eclipse's crossed colossal wordmark, cover's
   * occlusion and poster's full-measure type — into a single shippable
   * page, and each pays off marquee, split, pair and wall further down.
   * They differ in which of the four leads: poster, eclipse, cover, umbra
   * respectively. Red, white and black only.
   * ------------------------------------------------------------------ */
  {
    slug: 'anthology',
    name: 'Anthology',
    vibe: 'the whole argument, set as one printed sheet',
    blurb:
      'Poster logic leads: a full-measure MOZZ carries the page and every section is another plate on the same press. Umbra grading does the transitions, the eclipse crossing lands mid-page, and the offline chapter is the wordmark half-hidden behind the phone.',
    swatch: ['#eeeae2', '#d8002d', '#14101a'],
    mood: 'light',
  },
  {
    slug: 'union',
    name: 'Union',
    vibe: 'the eclipse, held for a whole page',
    blurb:
      'Eclipse exactly as it stands — colossal type cropped by both edges, the app crossing it, everything it passes over turning red — then repeated as the structure of the site. One black umbra chapter for offline, and a printed poster closes it.',
    swatch: ['#fdfcfa', '#d8002d', '#14101a'],
    mood: 'light',
  },
  {
    slug: 'chorus',
    name: 'Chorus',
    vibe: 'night lifting to morning, one word at a time',
    blurb:
      'Cover leads: the wordmark half-hidden behind the thing that plays it, with minimal drawn marks around it. Umbra grading runs the full document, so the page starts at ground black and finishes in cream.',
    swatch: ['#0a070d', '#d8002d', '#eeeae2'],
    mood: 'dark',
  },
  {
    slug: 'finale',
    name: 'Finale',
    vibe: 'the last word, lit from one side',
    blurb:
      'Umbra at full size: MOZZ off both edges, cream at the frame, falling to red, going to ground behind a phone that eats a hole in the light. Cover supplies the tilt, eclipse the scale, and poster prints the closing sheet.',
    swatch: ['#0a070d', '#d8002d', '#fdf6ec'],
    mood: 'dark',
  },

  /* ------------------------------------------------------------------ *
   * Round nine — four complete sites, each one a direct extension of a
   * hero study under /h rather than a new idea. The hero composition is
   * preserved at the top of the page and the rest of the document is
   * built in that same hero's visual language, red / white / black.
   *
   * Every one of them pays off four other studies further down: a
   * drifting marquee recoloured into its own palette, a full-height
   * split against something that is not a phone, iPhone and iPad
   * arriving together on scroll, and a wall of sleeves demoted to
   * decoration.
   *
   * Appended as a block, at the very end, on purpose.
   * ------------------------------------------------------------------ */
  {
    slug: 'umbra-site',
    name: 'Umbra Site',
    vibe: 'the whole site stands in the shadow the app casts',
    blurb:
      'Extends the Umbra hero. One colossal MOZZ falls from cream to red to nothing as the app crosses it, and every section below is another reading of the same light: lit, penumbra, umbra.',
    swatch: ['#0a070d', '#d8002d', '#eeeae2'],
    mood: 'dark',
  },
  {
    slug: 'eclipse-site',
    name: 'Eclipse Site',
    vibe: 'a transit that turns everything it crosses red',
    blurb:
      'Extends the Eclipse hero. Ink on paper, the wordmark cropped by the page, and a red band that follows the app down the document — every section is lit differently because of what is passing in front of it.',
    swatch: ['#eeeae2', '#d8002d', '#14101a'],
    mood: 'light',
  },
  {
    slug: 'cover-site',
    name: 'Cover Site',
    vibe: 'a record sleeve the size of the window',
    blurb:
      'Extends the Cover hero. The tilted phone stays in front of a wordmark printed at 37vw, and the page keeps going as sleeves, catalogue numbers, halo rings and hard red on black.',
    swatch: ['#0a070d', '#d8002d', '#fdf6ec'],
    mood: 'dark',
  },
  {
    slug: 'poster-site',
    name: 'Poster Site',
    vibe: 'a two-colour screenprint that keeps unrolling',
    blurb:
      'Extends the Poster hero. Two plates, red and black, overprinting on cream stock — the bill of fare, the halftone cone and the grain carry all the way down to the colophon.',
    swatch: ['#f5efe2', '#e03e2d', '#141110'],
    mood: 'light',
  },
  {
    slug: 'emblem-mark',
    name: 'Emblem Mark',
    vibe: 'Emblem, stamped with the logo instead of an abstract seal',
    blurb:
      'The logo-led counterpart to Emblem. Same catalogue, same rail, same plates — but the stamp is the real Mozz mark at plate scale, pixel disc and zz eyes and all, repeated down the page. Compare it against Emblem to see which seal the concept wants.',
    swatch: ['#eeeae2', '#c80028', '#1b1c1e'],
    mood: 'light',
  },
  {
    slug: 'emblem-round',
    name: 'Emblem Round',
    vibe: 'Emblem, with the pixel face printed on a true circle',
    blurb:
      'The third seal in the comparison. The face is the real mark, pixels intact, but the outline is the smooth circle those steps were always approximating \u2014 so the plate stays quiet and the pixels stay the only texture on it.',
    swatch: ['#eeeae2', '#c80028', '#1b1c1e'],
    mood: 'light',
  },

];
