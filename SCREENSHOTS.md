# Screenshots

How the real app screenshots on this site are produced, compressed and served —
and how to make capturing them a one-command job.

## The pipeline that exists today

```
screenshots-src/*.png   →   npm run images   →   public/screenshots/*.{avif,webp}
                                              →   src/data/screenshots.json
```

Drop a pristine capture into `screenshots-src/`, name it `mozz-<something>.png`,
add it to the `USAGE` map in `tools/build-images.mjs`, and run `npm run images`.
Everything downstream follows from the manifest.

### What it emits

Each master becomes a ladder of widths in two formats:

```
mozz-nowplaying-900.1545423c.avif    97 KB   ← what almost everyone gets
mozz-nowplaying-900.7f7b1545.webp   129 KB   ← browsers without AVIF
```

AVIF q85 `-s 2 --yuv 444` measured both smaller *and* sharper than
`cwebp -q 95 -sharp_yuv` in the DSSIM sweep this pipeline was ported from.
`--yuv 444` is not optional: these frames are full of small UI text, which is
exactly what chroma subsampling smears.

Widths come from `LADDERS`, which are measured from the painted CSS box and then
multiplied for retina — not read off the stylesheet. A phone in a hero paints
about 300 CSS px, so the ladder tops out where 3× lands and no higher. Shipping a
2000px rung for a 220px tile is dead weight no browser will ever request.

### Why the filenames have a hash in them

The hash covers the master's bytes, the width, and the exact encoder settings.
That is what lets `public/_headers` serve `/screenshots/*` as `immutable` for a
year honestly: re-shooting a master or changing a quality setting produces a
*new* filename rather than new bytes at an old URL, so nobody is ever stuck with
a stale copy they cached in good faith.

The build also prunes: rungs that fall out of a ladder are deleted, so a
narrowed ladder cannot leave orphans behind that still deploy and still get
cached for a year.

## Using them in a page

```astro
import Phone from '../../components/Phone.astro';
import Shot from '../../components/Shot.astro';

<!-- A screenshot in an iPhone frame. Exactly one per page gets `priority`. -->
<Phone name="mozz-nowplaying" width={320} priority class="hero-phone" />

<!-- A bare screenshot, for grids and strips. `sizes` must mirror the CSS box. -->
<Shot name="mozz-album-red" sizes="(max-width: 720px) 40vw, 220px" class="tile" />
```

`<Phone>`'s geometry is solved and should not be overridden. Its *surface* is
meant to be re-dressed per design variant:

```css
.hero-phone {
  --phone-bezel: linear-gradient(#3a3a3c, #1c1c1e);
  --phone-bezel-w: 0.038;
  --phone-rim: rgba(255, 255, 255, 0.16);
  --phone-shadow: 0 32px 70px -28px rgba(0, 0, 0, 0.62);
}
```

Alt text lives in `src/data/shots.ts` rather than at each call site, so seven
variants cannot drift into describing the same screen seven different ways.

## The licensing problem — read before launch

The screenshots currently in `screenshots-src/` were shot against a real
personal library. Every one contains third-party album artwork, and one contains
a band photograph.

That is fine for an internal review deployment. It is not fine on a launched
marketing site, and Apple has rejected App Store screenshots for exactly this.

Because of that, `screenshots-src/` and `public/screenshots/` are **gitignored**
— this repository is public, and copyrighted artwork in a public git history is
not something a later commit can undo. `src/data/screenshots.json` is committed,
because it holds only filenames and dimensions.

## Automating capture end to end

The compression half is already automated. The capture half is not, and the fix
for the licensing problem above is the same work as the fix for determinism.

**Build a press-kit library.** Seed a throwaway Navidrome or Jellyfin instance
with music whose recordings *and* cover art are Creative Commons or public
domain — Free Music Archive, Jamendo, and the Internet Archive's netlabel
collections all qualify. This is the piece that has to exist first. It buys two
things at once: artwork the site can legally publish, and a library that returns
the same albums in the same order on every run.

**Then drive the app.** All of the following live in the `Mozz` repo, not here:

| Step | Tool |
|---|---|
| Freeze the status bar at 9:41, full bars, full battery | `xcrun simctl status_bar <udid> override` |
| Navigate to each screen and capture | XCUITest → `XCUIScreen.main.screenshot()` |
| Run it across all three themes and every device size | `fastlane snapshot` |

Mozz already uses fastlane, so `snapshot` is the natural home. Pass the theme in
through the launch environment so one test plan covers dark, light and black
rather than three near-identical plans.

The output is a directory of PNGs at native retina resolution. Copy them into
`screenshots-src/`, run `npm run images`, and the rest of this document takes
over.

### Worth preserving when you re-shoot

Mozz recolours its entire interface from the artwork of whatever is playing.
That adaptive tint is the most striking thing in these captures — six shots of
one app read as six different apps — and it is what the "your music, your
library" argument looks like when it is working. Whatever library replaces the
current one, shoot it against covers with genuinely different palettes so that
range survives.
