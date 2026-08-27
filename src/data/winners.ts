/**
 * The shortlist, and why each thing is on it.
 *
 * Fifty concepts is too many to hold in your head at once, so this is the set
 * Brandon actually picked out, quoted in his own words. The quotes are here on
 * purpose: a favourite is only useful later if you can still remember what was
 * good about it, and "I liked it" decays into nothing within a week.
 *
 * `decision` marked the one set that was still open. It is now settled: Emblem
 * Round won and is the live site at /.
 */

export interface Winner {
  slug: string;
  name: string;
  /** '/v/' for a complete site, '/h/' for a hero study. */
  base: '/v/' | '/h/';
  /** Where the thumbnail lives; the two galleries shoot into different folders. */
  thumbs: 'thumbs' | 'hero-thumbs';
  /** Brandon's own words. Not paraphrased. */
  quote: string;
  /** What was done about it, if anything. */
  note?: string;
  decision?: boolean;
  /** The direction that won and is now the homepage. */
  chosen?: boolean;
}

export interface WinnerGroup {
  id: string;
  title: string;
  intro: string;
  items: Winner[];
}

export const WINNER_GROUPS: WinnerGroup[] = [
  {
    id: 'sites',
    title: 'The finished sites you picked',
    intro:
      'Three complete websites, out of fifty. Each one had a specific criticism attached, and each of those has been acted on.',
    items: [
      {
        slug: 'emblem',
        name: 'Emblem',
        base: '/v/',
        thumbs: 'thumbs',
        quote: 'this one seems overall the best',
        note: 'Untouched. The abstract stamp is the version you saw.',
      },
      {
        slug: 'emblem-mark',
        name: 'Emblem, with the mark',
        base: '/v/',
        thumbs: 'thumbs',
        quote: 'it\u2019s not using the logo\u2026 maybe the emblem is part of why i like it?',
        note: 'Identical to Emblem in every respect except the stamp, which is the real pixel mark at the same size and mass. Built so the question could be answered by looking rather than guessing.',
      },
      {
        slug: 'emblem-round',
        name: 'Emblem, round',
        base: '/v/',
        thumbs: 'thumbs',
        quote: 'try another with the new pixelated zz smile, but with a perfectly round outside',
        note: 'Chosen. The pixel face on a true circle, now the live site at /.',
        chosen: true,
      },
      {
        slug: 'poster-site',
        name: 'Poster',
        base: '/v/',
        thumbs: 'thumbs',
        quote: 'i think i like this site? but the hero feels a bit too busy, text is on top of stuff and hard to read',
        note: 'Spiral moved clear of the type; the ZZ now carries a printer\u2019s trap so it stays crisp where it does cross the rings.',
      },
      {
        slug: 'masthead',
        name: 'Masthead',
        base: '/v/',
        thumbs: 'thumbs',
        quote: 'a bit cleaner overall\u2026 maybe the app needs more priority, like just scale it up a lot',
        note: 'Phone went 210px to 311px and is now sized off the viewport, so it holds the right-hand side at any width.',
      },
    ],
  },
  {
    id: 'heroes',
    title: 'The four heroes everything grew from',
    intro:
      'These are the ones you chose to build on. Every site in the round above descends from them, either directly, as a sibling, or as a combination.',
    items: [
      {
        slug: 'umbra',
        name: 'Umbra',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote: 'i do like the large word covered by phone',
        note: 'The phone eats a hole in the light rather than sitting on top of it.',
      },
      {
        slug: 'eclipse',
        name: 'Eclipse',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote: 'eclipse is pretty sick but it\u2019s cut off on the left and right which i dont love',
        note: 'Its red/white/black became the palette for the whole round.',
      },
      {
        slug: 'cover',
        name: 'Cover',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote: 'the color scheme of eclipse with the design of cover',
      },
      {
        slug: 'poster',
        name: 'Poster',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote: 'i like /h/poster',
        note: 'The first one that landed, back in round four.',
      },
    ],
  },
  {
    id: 'parts',
    title: 'Ideas you liked, but not as heroes',
    intro:
      'You were specific that these were good ideas in the wrong place. Each one now appears further down the page instead, in a new execution rather than a copy.',
    items: [
      {
        slug: 'marquee',
        name: 'Marquee',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote:
          'really cool, perhaps we could simplify the colors\u2026 use that further down the page as like a featured section',
        note: 'Now a drifting featured strip, recoloured per site.',
      },
      {
        slug: 'split',
        name: 'Split',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote: 'maybe it could be a split further down on the page and not split with the player, but with something else',
        note: 'Now splits against a server rack, a record, headphones \u2014 never a phone.',
      },
      {
        slug: 'pair',
        name: 'Pair',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote: 'not for the hero, but maybe they animate as you scroll down',
        note: 'Now a scroll-driven section, and reframed around continuity rather than platform coverage.',
      },
      {
        slug: 'wall',
        name: 'Wall',
        base: '/h/',
        thumbs: 'hero-thumbs',
        quote: 'maybe we could use them elsewhere again as sort of decoration',
        note: 'Now sits behind the trust and FAQ bands at low opacity.',
      },
    ],
  },
  {
    id: 'sleeve',
    title: 'The album-artwork style',
    intro:
      'From the record sleeves drawn inside one of the iPad mockups: \u201cbuild a whole ass website surrounding this kinda style\u2026 obviously this is overly repetitive but we can use it in subtle ways to explain features\u201d. Four sites share one drawing system, used to explain rather than decorate. Emblem is one of these.',
    items: [
      {
        slug: 'sleeve',
        name: 'Sleeve',
        base: '/v/',
        thumbs: 'thumbs',
        quote: '',
        note: 'Two crossing ellipses: streaming, downloads, and your library where they overlap.',
      },
      {
        slug: 'rota',
        name: 'Rota',
        base: '/v/',
        thumbs: 'thumbs',
        quote: '',
        note: 'Everything on the page turns; a red playhead travels the ring.',
      },
      {
        slug: 'pressing',
        name: 'Pressing',
        base: '/v/',
        thumbs: 'thumbs',
        quote: '',
        note: 'A ring with a notch cut out of it: the record still plays.',
      },
    ],
  },
];
