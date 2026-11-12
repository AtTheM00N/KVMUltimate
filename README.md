# Konnect Vision Media

A custom WordPress block theme, companion plugin and original 3D studio. The homepage is one **From brief to launch** scroll: six connected chapters coordinated on a single camera and type timeline. Its menu jumps to Work, Services, Studio and Contact within the same page. Bespoke Stencil + Manrope and a red/black/grey material palette carry through project, service and campaign details. See `docs/cinematic-studio.md` for the scene architecture and `docs/editor-guide.md` for editing. The earlier YouTube style guide is historical reference, superseded by this redesign.

## Local preview

Use Node.js 24. Production WordPress does not require Node or Blender.

```powershell
npm ci --ignore-scripts
npm run build
npm run dev
```

Open **http://127.0.0.1:9400/**. WordPress Playground downloads WordPress and PHP on its first run. The local site persists in `.local/`, which contains private database data and must never be published or committed. The preview uses SQLite; production should use the database provided by the managed WordPress host. Bind the preview to loopback only and do not expose it to the internet.

The blueprint activates the theme/plugin and seeds eight editable pages and three illustrative demo projects once. It sets `WP_ENVIRONMENT_TYPE=local`. Local demo entries are labelled and excluded from production queries. Keep this environment setting out of production. Existing installations are mounted without replacing their WordPress core files. The CLI listener is restricted to loopback.

For an existing earlier-version preview, stop the preview server and run `npm run migrate:studio` once, then restart `npm run dev`. The migration saves revisions and preserves customised content; it reports any pages it leaves alone. `npm run migrate:studio -- --replace` explicitly replaces customised page content after a backup. Alternatively, `npm run dev -- --migrate` explicitly applies that migration and keeps the preview running. Normal page requests never run migrations. Theme-owned image URLs are relative to the current origin, so the temporary maintenance port does not leak into saved content.

Open `/wp-admin/` and sign in with Playground's local development defaults: username `admin`, password `password`. These credentials must never be reused in production or exposed publicly.

## Verification and installable ZIPs

```powershell
npm run verify
npm run verify:assets
npm run verify:lifecycle
npm run package
```

Verification runs isolated WordPress instances on port 9401, tests enquiries, content, migration and production visibility, then checks HTTP responses. Test data is never written to the persistent preview. The asset check validates the GLB, decodes its Meshopt geometry, checks KTX2 textures and verifies hashes and budgets. Lifecycle unit checks exercise aborted loads, timeouts and stale decoded geometry using test doubles; they do not render WebGL. Results are in `artifacts/verification.txt`, `artifacts/asset-verification.txt` and `artifacts/lifecycle-verification.txt`. Browser acceptance checks and their current limitations are documented in `docs/verification.md`.

Install `artifacts/konnect-site-plugin.zip` under Plugins → Add Plugin → Upload, then `artifacts/konnect-theme.zip` under Appearance → Themes → Add Theme → Upload. Activate the plugin and theme. On a fresh installation, run `wp eval 'kvm_seed_site();'` once, or insert the Konnect layout patterns into newly created pages and configure a static home page. The seed command creates draft demo projects outside local/development environments. It deliberately leaves search indexing disabled until launch review.

The third package, `artifacts/konnect-studio-source.zip`, contains the complete project archive for Konnect plus the editable Blender scene and reproducible asset pipeline. It excludes private WordPress data, backups, local tools and dependencies. Keep the site at the root of its domain: navigation and layout pattern links use root-relative URLs. Subdirectory installations require updating those links in the Site Editor and page content.

## Rebuilding the original studio

Prebuilt models and posters are included; this is only needed to change the 3D art.

```powershell
npm run studio:setup
npm run assets
npm run studio:render
npm run studio:optimize
npm run build
```

The setup script downloads and checksum-verifies portable Blender 4.5.16 LTS from Blender's official release server into ignored `.tools/`. The current helper targets Windows x64. Other platforms can run the Blender Python script with a local Blender installation. Rendering writes the editable `.blend`, uncompressed GLB, lighting bake and camera definitions. Optimisation uses the packaged Basis Universal encoder directly (no native CPU-detection build needed), Meshopt geometry compression and WebP posters. Manrope and its notice are copied from the locked npm dependency. Bespoke Stencil Medium is an unchanged official Fontshare download; its provenance and usage notice are in assets/licenses/Bespoke-Stencil-NOTICE.md. External collaborators should obtain their own copy from Fontshare.

## Editing

- **Pages:** edit copy in Gutenberg. Native heading/paragraph/group blocks cover page introductions and editorial copy. Composed visual sections also use Custom HTML blocks; edit their text carefully while preserving markup. Konnect layouts are available in the pattern inserter.
- **Homepage:** use List View → Konnect studio journey → a Studio chapter. Sidebar controls edit headlines, descriptions, links, fallback posters and featured projects. The six chapter slots stay in their intended order; camera geometry is theme-owned. The editor displays still previews and does not run WebGL.
- **Projects:** add title, excerpt, featured image and Services. The Project details sidebar provides brief, scope, approach, gallery selection, verified results and a local placeholder toggle. Order controls sorting. Results display only when both text and the verification switch are set. Use approved images with meaningful media-library alt text.
- **Work grid:** the block settings control the maximum number of projects and service filters. Filters use ordinary URLs and work without JavaScript.
- **Services:** select the Service sections block and use its sidebar panels to edit each service headline, description and deliverables. Blank fields use the defaults; page introductions are editable in Gutenberg.
- **Enquiries:** administrator-only records appear in the Enquiries menu. Review email notification status as well as the stored message. Delete records according to the business's approved retention policy.
- **Settings → Konnect:** set public email, notification recipient and optional integration identifiers. Configure authenticated mail delivery through your host or a maintained SMTP plugin. A transport accepting a message does not guarantee delivery; send and receive a real staging enquiry before launch.
- **Campaign page:** use the Campaign landing page template. It excludes publisher ads and uses a simplified header. Duplicate the page for new campaigns and edit its content.
- **Consent:** cookie preferences are stored on the visitor's device for 180 days. Optional integrations load only when configured, approved for launch and consented to. Disabling a previously enabled category reloads the page to stop its scripts. Deploy provider-specific cookie removal and retention rules alongside the final consent configuration if required.

The enquiry endpoint is `POST /wp-json/konnect/v1/enquiries`. It requires the form nonce, name, email, service and a 20–5,000 character brief. Phone and consented campaign attribution are optional. Successful responses contain only `success` and a message. Validation failures identify fields. The native POST fallback uses `admin-post.php` and returns errors through a short-lived, one-use server-side state token. Exclude form pages and form state URLs from all host/CDN caching.

## Deployment

Follow `docs/launch-checklist.md`. Production deployment requires the chosen host, domain and access; no external deployment is performed by the local build. Runtime dependencies in `node_modules` belong to local development and must not be uploaded. Install only the theme/plugin ZIPs and approved media. Fonts, compiled animation modules, scene assets and texture decoders are self-hosted inside the theme; notices are in `assets/licenses/`.

For an existing production site, back up its database/uploads and install the packages on staging first. Run `wp eval 'kvm_normalize_studio_urls(); print_r(kvm_migrate_studio());'` there, inspect the report, and retain owner-written copy when a page is reported as preserved. Deploy only after visual and enquiry checks. The pre-redesign source baseline is tagged `before-sculptural-redesign-20261112` in the local repository; private full-site and source snapshots are in `.backups/`. Do not deploy or share these private backups as public website assets.
