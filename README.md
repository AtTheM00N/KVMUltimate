# Konnect Vision Media

A custom WordPress block theme and companion plugin. The visual direction is recorded in `youtube-design-style-guide.md`.

## Local preview

Requires Node.js 20.18+ (Node 24 was used for development).

```powershell
npm install
npm run assets
npm run dev
```

Open **http://127.0.0.1:9400/**. WordPress Playground downloads WordPress and PHP on its first run. The local site persists in `.local/`, which contains private database data and must never be published or committed. The preview uses SQLite; production should use the database provided by the managed WordPress host. Bind the preview to loopback only and do not expose it to the internet.

The blueprint activates the theme/plugin and seeds eight editable pages and three illustrative demo projects once. It sets `WP_ENVIRONMENT_TYPE=local`. Local demo entries are labelled and excluded from production queries. Keep this environment setting out of production.

Open `/wp-admin/` and sign in with Playground's local development defaults: username `admin`, password `password`. These credentials must never be reused in production or exposed publicly.

## Verification and installable ZIPs

```powershell
npm run verify
npm run package
```

Verification runs an isolated WordPress instance on port 9401, tests enquiries and content behavior, then checks page responses. Test data is never written to the persistent preview. See `artifacts/verification.txt` for results from a completed run.

Install `artifacts/konnect-site-plugin.zip` under Plugins → Add Plugin → Upload, then `artifacts/konnect-theme.zip` under Appearance → Themes → Add Theme → Upload. Activate the plugin and theme. On a fresh installation, run `wp eval 'kvm_seed_site();'` once, or insert the Konnect layout patterns into newly created pages and configure a static home page. The seed command creates draft demo projects outside local/development environments. It deliberately leaves search indexing disabled until launch review.

Keep the site at the root of its domain: navigation and layout pattern links use root-relative URLs. Subdirectory installations require updating those links in the Site Editor and page content.

## Editing

- **Pages:** edit copy in Gutenberg. Native heading/paragraph/group blocks cover page introductions and editorial copy. Composed visual sections also use Custom HTML blocks; edit their text carefully while preserving markup. Konnect layouts are available in the pattern inserter.
- **Projects:** add title, excerpt, featured image and Services. The Project details sidebar provides brief, scope, approach, gallery selection, verified results and a local placeholder toggle. Order controls sorting. Results display only when both text and the verification switch are set. Use approved images with meaningful media-library alt text.
- **Work grid:** the block settings control the maximum number of projects and service filters. Filters use ordinary URLs and work without JavaScript.
- **Services:** select the Service sections block and use its sidebar panels to edit each service headline, description and deliverables. Blank fields use the defaults; page introductions are editable in Gutenberg.
- **Enquiries:** administrator-only records appear in the Enquiries menu. Review email notification status as well as the stored message. Delete records according to the business's approved retention policy.
- **Settings → Konnect:** set public email, notification recipient and optional integration identifiers. Configure authenticated mail delivery through your host or a maintained SMTP plugin. A transport accepting a message does not guarantee delivery; send and receive a real staging enquiry before launch.
- **Campaign page:** use the Campaign landing page template. It excludes publisher ads and uses a simplified header. Duplicate the page for new campaigns and edit its content.
- **Consent:** cookie preferences are stored on the visitor's device for 180 days. Optional integrations load only when configured, approved for launch and consented to. Disabling a previously enabled category reloads the page to stop its scripts. Deploy provider-specific cookie removal and retention rules alongside the final consent configuration if required.

The enquiry endpoint is `POST /wp-json/konnect/v1/enquiries`. It requires the form nonce, name, email, service and a 20–5,000 character brief. Phone and consented campaign attribution are optional. Successful responses contain only `success` and a message. Validation failures identify fields. The native POST fallback uses `admin-post.php` and returns errors through a short-lived, one-use server-side state token. Exclude form pages and form state URLs from all host/CDN caching.

## Deployment

Follow `docs/launch-checklist.md`. Production deployment requires the chosen host, domain and access; no external deployment is performed by the local build. Runtime dependencies in `node_modules` belong to local development and must not be uploaded. Upload only the two ZIPs and approved media. Fonts and GSAP are already vendored inside the theme; their licenses are in `assets/licenses/`.
