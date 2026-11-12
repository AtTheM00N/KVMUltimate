# Pocket Quest integration

The homepage now runs the authored Pocket Quest document directly through WordPress (`pocket.php`). It uses the registered source from https://threeui.com/source-code/pocket-quest-landing-page.json, revision `ee4c4ff715d6d78675ab93e88d90024ab6daf21a2e7ebf51bfb4eaee65bfcb17`.

`design-source/threeui/source.json` and its `public/` directory retain the supplied source and binary assets. `scripts/pocket.mjs` verifies all 30 source hashes and 41 binary hashes before generating the adaptation under the theme's `assets/pocket/`. Run `npm run pocket:build` or `npm run build` after edits. Brand integration CSS and event handling live in `src/pocket-brand.css` and `src/pocket-brand.js`.

The ThreeUI React wrapper itself renders an iframe. This integration uses its canonical authored document directly, keeping its bundled React runtime, WebGL cards, scroll transitions, mobile layouts and selectors. No additional React application dependency is required. The legacy GSAP editorial entry remains available for supporting pages and historical source; it is not enqueued on the homepage.

Konnect's existing fonts, red/ink/grey identity and original poster studies replace the game branding and character illustrations. Service labels describe disciplines rather than numerical performance claims. Game launch events open a native WordPress enquiry dialog, with the existing private submission endpoint and native POST fallback. Original game and waitlist modules are retained in the verified source but not activated by the adapted homepage bootstrap.

The existing six Gutenberg chapter blocks remain stored and editable. Intro heading/copy, process heading, work heading, studio copy, contact heading and service overrides feed the adapted presentation. Full block content, project selections, links and poster overrides remain available in the static presentation. Other template headings and compositions are owned by the adaptation script; their editing controls have not been expanded.

No JavaScript, reduced motion, Save-Data, and detected startup failures expose the static WordPress chapter presentation. The loader automatically exits after six seconds if resources are slow. Supporting pages retain their Konnect editorial layouts and existing WordPress controls, linked from the template navigation.

Source attribution supplied by ThreeUI: creator Aksonvady Phomhome; source https://pocket-quest.aura.build/. The canonical document also credits Grail / Denormalized for its original visual design and character artwork. Retain the supplied notices with redistributed source.

## Symbol and typography refresh — 13 November 2026

Six original connection marks replace the generated posters. Every mark uses a 512-unit square viewBox, 24-unit strokes, a common 80–432-unit working area, graphite lines and scarlet junctions. SVG sources remain in `design-source/artwork`; the build exports SVG and lossless 1024-square WebP textures. Legacy artwork filenames remain stable so existing theme-owned page images and flagged demo studies receive the new art without content migration. Owner-uploaded attachments are untouched.

Clash Grotesk serves headings and General Sans serves body text and controls. The existing Bespoke Stencil font and hero sizing remain reserved for KONNECT. Fonts came from the official Fontshare download API; original FFL notices ship in the theme. The card renderer in `src/pocket-card-art.js` draws symbols without words, numbers or game statistics. Readable HTML carries labels. Project selections now populate live links in the work section; desktop/mobile chapter image overrides feed the interactive asset map as well as the static view.

Navigation moves to the bottom below 900px, and a persistent project enquiry action remains available. Service cards become one column below 600px. Current asset checks validate six symbols and the updated editor font presets; the rest of the WordPress enquiry and production privacy checks continue to apply.

## Dark palette and scroll slideshow — 13 November 2026

`design-source/palette.json` is the palette authority: blood red #8F0000, dim grey #666370, black #000000, porcelain #F7F7F2 and platinum #EFF2F1. Large surfaces use black and blood red; the two light colors carry text and symbols. The source adaptation normalizes template colors, darkens the reveal shader, and ships a clean original phone frame with no game UI. Theme-owned artwork has light paths, blood-red junctions and alternate black junctions for red panels.

The old click-driven full-screen service selector is replaced by `src/pocket-slides.js`: one symbol, one heading and one sentence per slide. `src/pocket-motion.js` uses GSAP ScrollTrigger to pin six slides, translate their track through native vertical scrolling, and release into the following vertical section. No wheel or touch event is intercepted. If this motion entry fails, the six slides remain vertically readable; reduced-motion/Save-Data visitors continue to receive the static WordPress chapters. The authored totem wrapper's transform and will-change are disabled so fixed pinning uses the viewport.

The decorative timer is replaced with two square junctions joined by a simple repeating line animation. The mobile phone overlay's inherited game copy is hidden and replaced by the process mark; the underlying phone frame has no text, timer or game menu. A crisp square pointer with a red center is enabled only for fine pointers; text inputs retain the native text cursor, and keyboard focus outlines remain available.

The pre-change snapshot was pushed to GitHub master as `192d37b` before this update. Browser review covers pinned track movement, release back to vertical content, mobile fitting, phone cleanup and palette dominance. PHP/HTTP/production privacy and enquiry checks passed.
