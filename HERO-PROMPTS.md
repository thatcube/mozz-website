# Hero artwork — prompts for Nano Banana Pro

Every variant already looks finished without a photograph: the hero art is drawn
in CSS and SVG. These images are an **upgrade path**, not a dependency. Drop one
in and the page layers it behind its own artwork; leave it out and nothing
breaks.

## How to use them

1. Generate at **3840 × 2160** (16:9). Nano Banana Pro will go to 4K — take it.
2. Export as JPEG, quality ~82, and save to the exact path listed under each
   prompt: `public/hero/<slug>.jpg`.
3. Rebuild. That is the whole integration — each variant already declares a
   `--hero-plate` custom property pointing at its own file.

## Rules that apply to every prompt

Paste these with any of the prompts below; they are what keep seven images
feeling like one brand.

- **No text, no lettering, no logos, no watermarks, no UI.** The page supplies
  every word. Any text the model invents will be wrong and will clash with the
  real headline sitting on top.
- **No people's faces.** Hands, silhouettes and backs of heads are fine. Faces
  date an image fast and drag in a stock-photo feeling the whole site avoids.
- **Leave the left 45% quiet.** On every variant the headline, lede and store
  button sit on the left. The image needs a calm, low-detail region there or the
  type becomes unreadable.
- **Brand red is `#C80028`.** Where red appears it must be this red — a deep,
  slightly cool crimson. Not orange-red, not scarlet, not maroon.
- **Photographic, not illustrated**, unless a prompt says otherwise. The CSS art
  already covers illustration; these images earn their place by adding a texture
  no vector can fake.

---

## Sunburst → `public/hero/sunburst.jpg`

> A sun-bleached 1970s record sleeve photographed flat on a warm cream paper
> surface, shot from directly above in soft raking afternoon light. Concentric
> printed rays in burnt orange, deep crimson `#C80028` and mustard gold radiate
> from a point just right of centre, with visible offset-print misregistration,
> paper grain and a soft crease across one corner. Shallow depth of field
> falling off toward the edges. The left third of the frame is almost empty warm
> cream paper. Warm, optimistic, analogue, slightly faded.

**Avoid:** neon, digital gradients, glossy plastic, anything that looks freshly
printed. This should look like it has been in a crate since 1974.

---

## Vinyl → `public/hero/vinyl.jpg`

> Extreme macro photograph of a black vinyl record's grooves, lit by a single
> hard raking light from the upper right so the grooves catch a thin specular
> highlight and fall into near-black between them. The record's crimson `#C80028`
> centre label enters at the far right edge of the frame, out of focus. Fine
> dust and a few hairline surface scratches are visible. Deep blacks, one warm
> highlight, no other colour. The left half is almost entirely dark, textured
> black.

**Avoid:** rainbow diffraction, purple or blue light, a full record centred in
frame, anything that reads as a stock "music" photo.

---

## Neon → `public/hero/neon.jpg`

> A dark room at 1am photographed with a long exposure: deep plum and violet
> shadow filling most of the frame, with a single warm crimson `#C80028` light
> source spilling from the right and falling off steeply into the dark. Visible
> atmospheric haze catches the beam. Out-of-focus specular highlights bloom in
> the background. A suggestion of hi-fi equipment silhouetted against the light,
> unrecognisable and heavily defocused. Rich film grain, deep true blacks, no
> lifted shadows. The left 45% is near-black with only faint plum tone.

**Avoid:** cyan, teal, magenta, laser beams, nightclub crowds, DJ decks, and the
purple-to-pink gradient that every AI music image defaults to.

---

## Hi-Fi → `public/hero/hifi.jpg`

> Macro photograph of a vintage 1970s integrated amplifier's brushed aluminium
> front panel, shot at a shallow angle with a broad softbox raking across it so
> the horizontal brush grain reads clearly. A machined aluminium volume knob with
> knurled edges occupies the right third, tack sharp, with a single crimson
> `#C80028` indicator lamp glowing beside it. Warm neutral greys, one warm
> highlight, honest metal — slightly worn, faintly fingerprinted, not showroom
> new. The left of the frame is smooth, even, out-of-focus panel.

**Avoid:** chrome, glossy black plastic, RGB lighting, modern minimalist gear,
rendered-CGI perfection.

---

## Pixel → `public/hero/pixel.jpg`

*The one exception to the photographic rule — this variant's world is screens.*

> A macro photograph of a CRT monitor's phosphor mask in near darkness, so
> individual red, and dimmed white phosphor dots are visible as a regular grid
> with soft bloom between them. A crimson `#C80028` glow dominates the right side
> and falls away to black on the left. Slight barrel distortion and a faint
> horizontal scanline roll. Deep black background, heavy grain, no other colour.

**Avoid:** any recognisable image or text on the screen, green terminal phosphor,
a full monitor visible in frame, "retro gaming" clichés.

---

## Crate → `public/hero/crate.jpg`

> Overhead photograph of a wooden record crate packed tight with worn album
> sleeves, seen from directly above, lit by soft window light from the left. The
> sleeve tops show only edge wear, price stickers and aged card — no artwork, no
> text. Aged manila and kraft tones dominate, with one crimson `#C80028` divider
> card standing slightly proud of the rest, a third of the way in from the right.
> Visible dust, soft shadows between the sleeves, natural wood grain on the crate
> lip. The left of the frame is empty, softly-lit wooden surface.

**Avoid:** legible album covers, real artists, band names, modern shrink-wrapped
records, a tidy shop display.

---

## Aurora → `public/hero/aurora.jpg`

> Morning sunlight refracting through a thick, softly-bevelled glass object onto
> a smooth near-white plaster surface, photographed close and slightly from
> above. The refraction throws soft caustic light in cool periwinkle and pale
> lilac, with one warm crimson `#C80028` bloom where the light concentrates on
> the right. Very soft gradients, gentle shadow falloff, a great deal of empty
> pale surface. Serene, bright, expensive, quiet. The left half is almost pure
> soft white with the faintest cool tint.

**Avoid:** rainbow prism clichés, hard colourful gradients, glass spheres,
crystal balls, anything that reads as a stock "wellness" image.

---

## If you want one image instead of seven

Generate the **Vinyl** or **Neon** prompt first. Those two are the most reusable
— both are dark, both carry brand red as the only colour, and both crop well to
an OG card at 1200 × 630.
