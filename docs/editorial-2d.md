# Editorial 2D experience — 13 November 2026

## Art direction

Konnect uses an ink/scarlet/grey editorial identity with Bespoke Stencil display type and Manrope supporting text. Original poster compositions have measured margins, typographic hierarchy and different structures for social, identity, search and campaign disciplines. The K appears as a small signature or identity specimen within original artwork, never as a travelling page background.

The six semantic chapters keep their Gutenberg attributes and ordering. The hero pairs editable copy with a portrait campaign poster. Work uses a light gallery with offset projects; Services alternates copy and individual artwork; Process is a quiet typographic statement; Studio pairs artwork and copy on red; Contact settles into a normal two-column form. Supporting pages share typography, framing, buttons and spacing. Mobile stacks the same content in reading order. Artwork is decorative beside the equivalent HTML content; design study status is visible in portfolio captions.

## Runtime and editing

`src/main.js` imports `src/scroll.js` only for eligible desktops without reduced motion or Save-Data. One normalized GSAP timeline makes small reversible changes to artwork scale/position. It does not hide copy, intercept scroll or impose extra viewport-height chapters. Geometry is measured after images, fonts and content resizing; cleanup restores original inline styles and removes observers/triggers. Static content is the default. No content schema, REST API or database migration was introduced.

Poster attachment controls, service copy, project eligibility and owner-written page content retain their prior behaviour. The original files in `design-source/artwork/` and `scripts/artwork.mjs` reproduce the built-in compositions. Original fonts are not modified. The theme's remaining 3D source files are historical and excluded from installable ZIPs.

## Acceptance status

See `verification.md` for the exact completed checks and limitations. Visual polish must be judged on the rendered desktop and mobile pages as well as the offline artwork; byte budgets alone do not establish visual acceptance or field performance.
