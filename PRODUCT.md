# Mozz — product truth

Durable facts about the product. Visual decisions live in DESIGN.md; this file
is what every surface must not contradict.

## What it is

Mozz is a free, open source music app for people who keep their own music
library on their own server. It connects to Plex, Jellyfin and Navidrome and
plays what is already there.

**Mechanism, one sentence:** Mozz mirrors your server's whole catalog into an
on-device database, so browsing, searching and offline playback stay instant and
work whether or not the server is reachable.

**Tagline (the maintainer's own words):** "One app for your music, wherever it
lives. Free forever. Open source."

Streaming from your own server and offline playback of downloaded tracks are
**co-equal** priorities. Mozz is not "offline-first" and not "streaming-first" —
it is both, and copy must never brand it with a single "-first" slogan.

## Audience

People who self-host their music. They already made a deliberate choice to own
files rather than rent access. They run a server at home, they curate tags and
folder structures, and they are used to apps that either lock features behind a
Pro tier or treat their library as second-class. The scene is a phone in a
pocket, on a commute or in a kitchen, not a desk.

**What they must believe:** this one is actually theirs — no account, no upsell,
no telemetry, and it does not get slower as the library gets bigger.

## Platforms

- iPhone and iPad today. SwiftUI, iOS 17 deployment target.
- Apple TV is planned and shares the same core. Do not present it as shipping.

## Servers

Plex, Jellyfin, and Navidrome (any Subsonic-compatible server).

## Verified capabilities

Only these may be claimed. Sources are `thatcube/Mozz` on GitHub — always the
repository, never a local clone, which can be behind.

| Claim | Source |
|---|---|
| Free forever, open source, GPL-3.0 with an App Store Exception | `README.md`, `LICENSE` |
| Plex, Jellyfin, Navidrome | `Sources/MozzApp/Resources/Brands.xcassets` |
| No account, no analytics, no telemetry, no ad networks | `docs/PRIVACY.md` |
| FTS search p95 **15.7 ms** across **100,000 tracks** | `ARCHITECTURE.md` §8 |
| **75 ms** time-to-first-audio | `ARCHITECTURE.md` §8 |
| Offline downloads designed in from day one | `ARCHITECTURE.md` §1 |
| Gapless queue on `AVQueuePlayer` | `ARCHITECTURE.md` §1, §5 |
| Equalizer | `Sources/MozzCore/EqualizerSettings.swift` |
| Recommendations via MusicBrainz + ListenBrainz | `docs/PRIVACY.md` |
| On-device, offline **Mozz Weekly** mixes | `Sources/MozzRecommend/RecommendationService.swift`, `Sources/MozzApp/Library/HomeView.swift` |

**The one honest caveat.** Recommendations send artist name, track title and/or
MusicBrainz IDs to MetaBrainz. No name, no server address, no account, and it is
switchable in Settings. Say this plainly — hiding it would undercut the entire
ownership argument.

## Uninventable

No prices, no user counts, no download counts, no star counts, no testimonials,
no press quotes, no App Store rating, no release date. None of these exist yet.

## Status

Not on TestFlight and not on the App Store. The primary call to action is a
**placeholder "Download on the App Store" button**, wired to a single constant
(`APP_STORE_URL` in `src/data/site.ts`) so the real link drops in one place.
Until it is set the badge renders as visibly pending, never as a dead link that
pretends to work.

## Assets

- The mark is a 32×32 pixel-art face: "ZZ" for closed eyes over a wide smile, in
  brand red. It is owned by the app repo at `docs/brand/mozz_logo.svg` and is
  pulled in by `npm run brand`. Never redraw it, never hand-copy it, and never
  scale it with smoothing — it is pixel art and the edges stay hard.
- Brand red: `#c80028` bright, `#b00023` body, `#3e0606` rim.

## Assumptions

Recorded because they came from the brief rather than from the repo, and should
be corrected if wrong:

- The site's job is to explain the app and collect the eventual App Store click.
- `mozzmusic.com` is the production domain, on Cloudflare.
- The maintainer will supply generated hero artwork later, so every surface must
  already look finished without it.
