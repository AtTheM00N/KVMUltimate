# Konnect Vision Media

## Current design

The homepage now uses the [Pocket Quest source adaptation](docs/pocket-integration.md), with Konnect branding and the existing WordPress enquiry flow. `npm run build` verifies and regenerates it from the registered source bundle.

## Previous editorial foundation

A custom WordPress block theme and companion plugin. The homepage connects six editable chapters through an editorial 2D layout: an original campaign poster, selected work, four service compositions, process, studio, and enquiries. Bespoke Stencil, Manrope, scarlet, ink and grey provide the identity. The K is a signature within artwork; there is no travelling watermark, canvas or WebGL dependency in the active build.

The desktop GSAP timeline gently reframes artwork as the visitor scrolls. Text, links and forms remain visible, with normal document flow at every width. Phone layouts and reduced-motion preferences receive complete static artwork. See [the current design notes](docs/editorial-2d.md), [editor guide](docs/editor-guide.md) and [verification](docs/verification.md).

## Local preview

Use Node.js 24. Production WordPress does not need Node or Blender.

```powershell
npm ci --ignore-scripts
npm run build
npm run dev
```

Open http://127.0.0.1:9400/. WordPress Playground downloads WordPress/PHP on first boot and stores private development data in ignored `.local/`. The server binds to loopback. The local defaults are `admin` / `password`; never use those credentials publicly. The preview seeds eight editable pages and three clearly labelled original design studies. They are excluded from production listings and publishing.

Start preview and isolated verification sequentially on a fresh machine so their first downloads do not compete for the same Playground cache archive.

## Build and packages

```powershell
npm run build
npm run verify
npm run verify:assets
npm run verify:lifecycle
npm run package
```

Build copies the self-hosted Manrope font, regenerates original editorial SVG/WebP artwork and its hash manifest, then builds the main motion module and deferred scroll module. All fonts and notices are local. Bespoke Stencil is used unchanged under its accompanying Fontshare notice; outside collaborators should obtain their own licensed copy.

Verification uses isolated WordPress instances on port 9401 and never mounts the persistent preview. Asset checks inspect the active 2D build. Lifecycle checks exercise the current scroll module with DOM/GSAP test doubles; they are not a substitute for browser inspection. Results go to ignored `artifacts/`; packaging copies reports to `docs/evidence/`.

Install `artifacts/konnect-site-plugin.zip` and `artifacts/konnect-theme.zip` in WordPress and activate both. On a fresh site, run `wp eval 'kvm_seed_site();'` once, or insert the Konnect layout patterns and configure a static home page. The source archive includes original editable artwork and legacy Blender source; it is not a WordPress upload. Installable packages exclude the legacy model, decoder and 3D-only stylesheet.

## Editing and compatibility

The six Gutenberg chapter slots, copy, links, desktop/mobile posters, service overrides and project selections keep their existing interfaces. Pages retain normal WordPress content. No migration is needed for this presentation update. Owner-written content and image selections are preserved.

Projects use Featured image, Services, Order and the Project details sidebar. Results appear only when both supporting text and approval are set. Original studies are visibly identified as non-client work; never invent clients, testimonials or results.

For an installation predating the six chapter blocks, stop preview and use `npm run migrate:studio`, or review `kvm_migrate_studio()` on staging. Explicit migration saves revisions and preserves customised pages. `--replace` deliberately replaces customised content; back up and review before using it. Normal requests do not migrate content.

## Enquiries and release

The existing REST endpoint and native POST fallback store enquiries privately, independently of email delivery. Configure Settings → Konnect and authenticated email delivery on the chosen host. Confirm an actual staging enquiry arrives. Forms and state-token URLs must bypass host/CDN caching. Optional analytics and ads stay off locally and require reviewed configuration and visitor consent in production.

Follow [the launch checklist](docs/launch-checklist.md). Keep the site at the root of its domain because navigation uses root-relative links. Keep `.local/`, `.backups/`, `.tools/`, credentials and dependencies out of deployments. No external deployment is performed by the build.

The earlier [cinematic studio document](docs/cinematic-studio.md) describes the retained historical 3D source, not the current runtime. The YouTube guide is also historical reference.

## ThreeUI homepage adaptation

The homepage now uses the Pocket Quest source adaptation described in [Pocket Quest integration](docs/pocket-integration.md). This supersedes the earlier description of the active homepage timeline above. Supporting pages retain the editorial Konnect styling. The source build verifies the original text and binary hashes before applying Konnect branding.
