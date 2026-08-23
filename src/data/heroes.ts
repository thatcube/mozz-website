export interface HeroStudy {
  slug: string;
  name: string;
  idea: string;
  swatch: [string, string, string];
}

export const HEROES: HeroStudy[] = [
  {
    slug: 'thread',
    name: 'Thread',
    idea: 'One continuous playback line runs from your server, through Mozz, to your headphones.',
    swatch: ['#f7f4ee', '#c80028', '#202124'],
  },
  {
    slug: 'pocket',
    name: 'Pocket',
    idea: 'Your self-hosted library slips neatly into your pocket for online or offline listening.',
    swatch: ['#f5f0e7', '#c80028', '#6f8f84'],
  },
  {
    slug: 'balance',
    name: 'Balance',
    idea: 'A record and the Mozz player hang in a quiet balance, with downloads close at hand.',
    swatch: ['#f8f7f3', '#c80028', '#31566b'],
  },
  {
    slug: 'shelf',
    name: 'Shelf',
    idea: 'A single library shelf with Mozz ready to play any record on it.',
    swatch: ['#f4f0e8', '#c80028', '#d7a84a'],
  },
  {
    slug: 'orbit',
    name: 'Orbit',
    idea: 'Your library, phone and offline album share one calm playback orbit.',
    swatch: ['#f7f8f5', '#c80028', '#627caa'],
  },
  {
    slug: 'journey',
    name: 'Journey',
    idea: 'One track keeps playing from home, through the train, to the park.',
    swatch: ['#f4f7f3', '#c80028', '#4e836a'],
  },
  {
    slug: 'window',
    name: 'Window',
    idea: 'Open the app and the music waiting at home comes through.',
    swatch: ['#f7f3eb', '#c80028', '#73a9bc'],
  },
  {
    slug: 'garden',
    name: 'Garden',
    idea: 'A library rooted at home grows radio and a fresh weekly mix.',
    swatch: ['#f5f4e9', '#c80028', '#66895e'],
  },
  {
    slug: 'fold',
    name: 'Fold',
    idea: 'One sheet folds from server to record to phone without a seam.',
    swatch: ['#f7f6f2', '#c80028', '#7389b4'],
  },
  {
    slug: 'dial',
    name: 'Dial',
    idea: 'One simple dial keeps your self-hosted library, offline listening and mixes in tune.',
    swatch: ['#f3f1eb', '#c80028', '#2c4d53'],
  },
];
