/**
 * Hero studies — round four.
 *
 * Two sets, ten each, answering the same brief in opposite ways:
 *
 *   kind: 'app'  the hero shows Mozz itself — real interface, real cover art,
 *                colour taken from the record that happens to be playing.
 *   kind: 'art'  the hero shows an illustration instead, so the page never has
 *                to be redrawn when the app's interface moves on.
 *
 * Earlier rounds failed the same way twice: pale line drawings that diagrammed
 * the product rather than sounding like it. Both sets below carry colour.
 */

export interface HeroStudy {
  slug: string;
  name: string;
  kind: 'app' | 'art';
  idea: string;
  swatch: [string, string, string];
}

export const HEROES: HeroStudy[] = [
  {
    slug: 'bloom',
    name: 'Bloom',
    kind: 'app',
    idea: 'The now playing screen, with the record\u2019s own colour spreading out behind it.',
    swatch: ['#2a1338', '#e0543c', '#f4c95d'],
  },
  {
    slug: 'wall',
    name: 'Wall',
    kind: 'app',
    idea: 'A full wall of covers, with the player resting on top of it.',
    swatch: ['#141317', '#c80028', '#efe7d8'],
  },
  {
    slug: 'fan',
    name: 'Fan',
    kind: 'app',
    idea: 'Three screens fanned out: library, now playing, downloads.',
    swatch: ['#0f2b34', '#f06a3f', '#dff0ea'],
  },
  {
    slug: 'crop',
    name: 'Crop',
    kind: 'app',
    idea: 'One extreme close-up of the artwork and the play button, filling the page.',
    swatch: ['#3d1020', '#ff5a5f', '#ffd9c0'],
  },
  {
    slug: 'marquee',
    name: 'Marquee',
    kind: 'app',
    idea: 'Rows of covers drifting sideways behind a single phone.',
    swatch: ['#16151b', '#7c5cff', '#f2ede3'],
  },
  {
    slug: 'pair',
    name: 'Pair',
    kind: 'app',
    idea: 'iPhone and iPad showing the same library at the same moment.',
    swatch: ['#f3efe6', '#c80028', '#2f4858'],
  },
  {
    slug: 'split',
    name: 'Split',
    kind: 'app',
    idea: 'Flat colour and the sentence on one side, a full-height screen on the other.',
    swatch: ['#134e4a', '#f5b700', '#f6f4ee'],
  },
  {
    slug: 'flow',
    name: 'Flow',
    kind: 'app',
    idea: 'Covers turning through perspective, the one that is playing held in front.',
    swatch: ['#1b1a2e', '#ff8a3d', '#c3d9ff'],
  },
  {
    slug: 'midnight',
    name: 'Midnight',
    kind: 'app',
    idea: 'A dark room where the screen is the only thing giving off light.',
    swatch: ['#080a12', '#5eead4', '#e8e6f0'],
  },
  {
    slug: 'tall',
    name: 'Tall',
    kind: 'app',
    idea: 'One oversized phone rising past the bottom edge, the sentence above it.',
    swatch: ['#eae4d9', '#c80028', '#1f2124'],
  },
  {
    slug: 'vinyl',
    name: 'Vinyl',
    kind: 'art',
    idea: 'A record mid-turn, drawn large and warm.',
    swatch: ['#f0e2c8', '#c80028', '#26221f'],
  },
  {
    slug: 'cassette',
    name: 'Cassette',
    kind: 'art',
    idea: 'An oversized tape in flat, saturated colour.',
    swatch: ['#ffe8d1', '#e2482d', '#2b6a8f'],
  },
  {
    slug: 'speaker',
    name: 'Speaker',
    kind: 'art',
    idea: 'A bookshelf speaker with the room warming up around it.',
    swatch: ['#f7ead6', '#b5462f', '#3f6b5c'],
  },
  {
    slug: 'waveform',
    name: 'Waveform',
    kind: 'art',
    idea: 'A waveform wide enough to read as a horizon.',
    swatch: ['#101a2c', '#ff6b4a', '#ffd166'],
  },
  {
    slug: 'headphones',
    name: 'Headphones',
    kind: 'art',
    idea: 'Headphones drawn big, in blocks of flat colour.',
    swatch: ['#e8dff5', '#5a2ea6', '#ff9f68'],
  },
  {
    slug: 'walkman',
    name: 'Walkman',
    kind: 'art',
    idea: 'A pocket player and a looping cable \u2014 music you carry, offline.',
    swatch: ['#f2f0e6', '#d94f30', '#2f5d8c'],
  },
  {
    slug: 'crates',
    name: 'Crates',
    kind: 'art',
    idea: 'Record crates seen from above, mid-flip, spines in full colour.',
    swatch: ['#f4e9d8', '#bf3a2b', '#4b7f6d'],
  },
  {
    slug: 'poster',
    name: 'Poster',
    kind: 'art',
    idea: 'A gig poster: enormous type, two inks, one bold shape.',
    swatch: ['#f5efe2', '#e03e2d', '#1c3f94'],
  },
  {
    slug: 'night',
    name: 'Night',
    kind: 'art',
    idea: 'Someone listening late, lamp on, phone in hand.',
    swatch: ['#1a1b33', '#ffb43a', '#7a6bd6'],
  },
  {
    slug: 'home',
    name: 'Home',
    kind: 'art',
    idea: 'Music leaving a lit house and arriving on a phone somewhere else.',
    swatch: ['#132a3a', '#ffc857', '#4ea699'],
  },
];

export const APP_HEROES = HEROES.filter((hero) => hero.kind === 'app');
export const ART_HEROES = HEROES.filter((hero) => hero.kind === 'art');
