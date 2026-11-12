# Verification — 12 November 2026

## WordPress and HTTP checks

`npm run verify` passed on isolated WordPress 6.8.12 / PHP 8.3.36 instances. The test server binds to 127.0.0.1 and does not mount the private preview database. Full output: `artifacts/verification.txt`.

- PHP source parsing, block theme activation, editable service copy and eight editable page layouts.
- Private enquiry storage and administrator access; anonymous access rejected and enquiry records absent from REST.
- Invalid email, expired nonce, malformed fields, honeypot, duplicate detection and rate limits.
- Successful storage despite missing mail settings or failed mail transport; minimal HTTP success payload, native form-post validation and value restoration.
- Unverified results hidden and verified results rendered.
- Six native chapter blocks, escaped edited text/links, selected-project visibility and draft exclusion. Edited process headings drive the visible words; malformed service overrides fall back safely.
- Explicit migration, saved revisions, preservation of owner-written copy (including edits between partial migration attempts), repeat-run idempotence, explicit replacement and maintenance-port image URL repair.
- Generated version-2 homepage recognition and migration to version 3, plus rejected arrow/numbered navigation UI absent from rendered HTML responses.
- Correct HTTP content for all eight pages, a project detail, URL-based work filtering, scene asset responses and useful 404 behavior.
- Production demo publishing protection, private placeholder URLs, collapsed empty portfolio chapter, disabled unreviewed integrations, configured ad slots and campaign/homepage exclusions.

These checks inspect server output and data behavior. They do not establish rendered layouts, keyboard behavior or actual Gutenberg interactions.

## Asset and build checks

`npm run build`, `npm run verify:assets` and JavaScript syntax checks passed. `npm run package` generates and checks the installable theme/plugin packages and source archive, verifying required paths and excluding private data. Copies of the test reports are included in the source archive under `docs/evidence/`.

- Compressed GLB: **349,424 bytes** (about 341 KiB).
- Referenced studio model, fourteen WebP posters and camera definitions: **818,080 bytes** (about 0.78 MiB), excluding project media and JavaScript/decoder bundles.
- Initial motion module: **45,404 bytes gzip**; Three.js lives in a separate dynamic import for eligible homepage desktops.
- Asset hashes, poster dimensions and scene budgets pass.
- glTF validator reports zero errors. It does not understand the Meshopt/Basis extensions and reports KTX2-related format warnings. Meshopt is decoded separately using its reference decoder; KTX2 container presence and texture MIME types are checked. Browser GPU transcoding remains unverified.
- Named portfolio hinge, artwork planes and camera definitions survive compression. Font files and Gutenberg settings agree on Bespoke Stencil/Manrope.

Evidence: `artifacts/asset-verification.txt`; file hashes and dimensions: `wp-content/themes/konnect/assets/studio/manifest.json`.

## Lifecycle unit checks and original art review

`npm run verify:lifecycle` executes the actual scene module with renderer/network test doubles. It verifies immediate disposal during loading, aborted requests, idempotent cleanup, the initialisation timeout restoring static content, and late decoded geometry being released without changing a replacement scene. Evidence: `artifacts/lifecycle-verification.txt`. These are lifecycle unit checks, not WebGL rendering tests.

Blender completed the original geometry, packed scene, lighting bake, nine desktop renders and five mobile renders. The final desktop hero/work/social and mobile hero posters were visually inspected as offline image assets. The red lacquer monogram was built through Higgsfield 3D Jutsu and imported into the local Blender scene. The opening camera was raised to show the complete monogram. All fourteen final posters have been regenerated and compressed. This review does not establish the browser's lighting, camera framing or poster-to-canvas match.

## Pending browser and deployment acceptance

A saved browser permission blocked observation of `http://127.0.0.1:9400/`. No alternate browser, raw browser protocol or other workaround was used. Rendered desktop/tablet/mobile layout, scrolling in both directions, chapter jumps, keyboard/menu interaction, reduced motion, JavaScript failure, WebGL failure/context loss, Gutenberg interaction, contrast and long edited text remain pending browser review. The redesign must not be declared visually accepted until these checks are completed.

LCP, CLS, frame rate and field Core Web Vitals have **not** been measured. Email deliverability, actual analytics/pixel behavior, ad network acceptance, staging compatibility and production deployment require the real hosting/service accounts. Optional integrations remain disabled locally. Follow `docs/launch-checklist.md` before paid traffic or publisher ads.

The persistent local preview is running at **http://127.0.0.1:9400/**, restricted to loopback. Use `npm run dev` if it has been stopped. It retains its existing core installation; isolated test results describe the compatibility baseline above, not a browser audit of the persisted site.
