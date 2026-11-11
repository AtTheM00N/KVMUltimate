# Video Design Style Guide — Konnect Vision Media

## Source

- Video: [Konnect Vision Media: Elevate Your Brand with Expert Social Media Marketing | SMMA Services](https://www.youtube.com/watch?v=tQAqEfwiKB8)
- Channel: KUNAL KONNECT
- Duration: 1:38
- Reviewed: 2026-11-11
- Scope: visual direction for a future website inspired by the promo. The clip is a short service montage, not a full walkthrough of a live website.

## Style summary

An energetic, high-contrast digital-agency look: deep burgundy and black grounds, vivid red fields, large white service headings, and glossy 2.5D/isometric illustrations. The layout pairs a short headline with a large service image and a bright CTA. Neon cyan, purple, magenta, and warm yellow details add depth and a technology feel.

## Visual observations

- **Backgrounds:** mostly dark burgundy/near-black with strong scarlet and red-orange gradients. Some scenes have fine horizontal lines, subtle particles, or a soft glow.
- **Composition:** asymmetric split layouts. A large service heading occupies one side while a detailed illustration fills the other. Small uppercase navigation appears along the top in the website-like scene.
- **Illustration:** dimensional, glossy vector artwork with perspective and layered objects. Examples include a creative workstation for “Graphic Design,” a computer and magnifier for “SEO Optimization,” and a magnet with people and small objects for “Lead Generation.”
- **Controls and accents:** rounded red CTA pills with white uppercase labels; some have a cyan/white luminous ring. Small magenta, cyan, and yellow objects punctuate the red field.
- **Brand mark:** a compact silver/white monogram watermark sits near an edge of the frame.

## Typography

- **Primary headings:** bold geometric/grotesque sans serif, mostly uppercase, white, and very large. Examples visible in the video include “GRAPHIC DESIGN,” “SEO,” and “LEAD GENERATION.”
- **Secondary line:** smaller and lighter sans serif, as in “Optimization” below “SEO.” Preserve a strong weight and size contrast between the main service and its descriptor.
- **Navigation and CTA labels:** small uppercase sans serif; use modest letter spacing so they remain readable at small sizes.
- **Exact font:** the video does not identify a font family clearly enough to verify one. For a production approximation, use **Montserrat** for headings and **Inter** for supporting UI/body text, or use a single geometric sans family with a wide weight range.
- **Suggested web scale:** hero/service heading `clamp(2.5rem, 6vw, 5.5rem)`; descriptor `clamp(1.15rem, 2.2vw, 1.8rem)`; navigation/button text `0.75–0.9rem`. These are implementation suggestions, not measurements from the video.

## Approximate color tokens

Visual estimates from the video; they are not sampled brand values.

| Token | Approximate value | Use |
|---|---|---|
| `ink` | `#10090C` | Near-black base, text contrast |
| `wine` | `#3B070D` | Dark burgundy panels and shadows |
| `scarlet` | `#E9101B` | Main brand field and CTA |
| `hot-red` | `#FF3B22` | Red-orange glow and gradient highlights |
| `paper` | `#F7F3F3` | Headlines and button text |
| `electric-cyan` | `#10D5E8` | Illustration edges and luminous accents |
| `violet` | `#A62BFF` | Small technology/creative accents |
| `warm-yellow` | `#FFC247` | Illustration highlights |

Use red as the dominant color, white for hierarchy, and cyan/purple/yellow sparingly. Keep text on dark or otherwise high-contrast surfaces.

## Motion and transitions

### Seen in the clip

- Service scenes change with energetic, short transitions; some frames show motion blur or a brief doubled/ghosted heading during the change.
- Illustrations have a dimensional, floating quality, with small decorative pieces around the main object.
- CTA treatments use bright outlines and glow, giving the button a pulsing or energized feel.
- Background lighting and particles add movement without competing with the service headline.

The clip does not provide clean enough timing to measure exact durations or easing curves.

### Suggested reconstruction for a website

These values are starting points for implementation, not extracted measurements:

- Enter each service heading with a short fade and 12–20 px upward movement (`500–700 ms`, ease-out).
- Reveal the illustration with a slight scale-up (`0.96` to `1`) and opacity fade (`700–1000 ms`); stagger separate foreground pieces by `60–100 ms`.
- Use a restrained illustration float (about `6–10 px` over `4–6 s`) and subtle parallax between near and far layers.
- Animate a CTA ring or glow with a soft pulse (`2–3 s` loop); avoid a large, constant glow behind text.
- Transition between service panels with a brief crossfade and small scale shift (`450–700 ms`). Keep any blur/ghosting transient and limited to the transition.
- Respect `prefers-reduced-motion`: remove looping float and pulsing effects, and use simple opacity transitions or static artwork.

## Production notes

- Build each service section around one clear headline, one dimensional illustration, and one primary CTA.
- Preserve generous separation between heading and artwork; use the illustration as the counterweight rather than adding extra cards or decorative UI.
- Keep the page background dark and let selected sections or glows carry the saturated red.
- Use custom or carefully selected 2.5D illustrations. Flat generic icons will not reproduce the visual weight of the reference.
- Treat the font, exact colors, and motion values above as approximations. The video is compressed and does not expose source assets or design specifications.

## Confidence

- **High:** dominant red/black palette, white uppercase headings, split composition, dimensional service illustrations.
- **Medium:** motion character and transition style; observations are based on a short, compressed promo.
- **Low / unverified:** exact font family, brand hex values, easing, and precise animation timings.
