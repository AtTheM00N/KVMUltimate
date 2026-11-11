# Architecture decision — 2026-11-11

## WordPress owns the full page response

Use a Gutenberg block theme with shared `theme.json` settings and a small companion plugin. The plugin owns portfolio records, service taxonomy, private enquiries, dynamic blocks and integrations. The theme owns templates, type, layout and motion. This keeps project records portable when the visual theme changes and avoids a paid field-plugin dependency.

Native blocks and layout patterns provide the content structure; dynamic blocks render project listings, case-study metadata and forms. The cinematic redesign adds native studio-story and story-chapter blocks for six editable homepage slots. Native WordPress media attachments supply responsive image variants. Some supporting editorial sections retain Custom HTML, with the editing trade-off documented in README. See [cinematic-studio.md](cinematic-studio.md) for the 12 November scene, motion, build, editing and migration decisions that supersede the first visual treatment.

## Runtime

Use WordPress Playground/PHP 8.3 with a persistent local SQLite database because system PHP, Docker and WP-CLI were absent. WordPress 6.8 is the compatibility baseline; test the host's maintained WordPress/PHP releases again on staging. Production runs on normal managed WordPress hosting. SQLite and the Playground runtime are development dependencies only.

## Enquiries and integrations

Store enquiries as a private, administrator-only post type with no REST exposure. Validate data before storage; use nonce verification, honeypot, per-IP rate limits and short-lived duplicate fingerprints. Do not store raw IP addresses. Preserve submissions independently of email delivery status. Rate limits are designed for ordinary enquiry traffic; use the host/WAF for stronger abuse controls if campaigns attract substantial bot traffic.

GTM and the AdSense adapter are inert until a production administrator enters valid account identifiers and marks the privacy setup reviewed. Analytics and publisher advertising are separate visitor choices. Attribution captures only UTM source, medium and campaign after analytics consent. The conversion dataLayer event carries no form fields. Avoid including personal information in campaign names or URLs.

Publisher support initially targets AdSense because the final network was unspecified. Slots are optional, consent-aware, outside conversion surfaces, and exclude demo projects. Changing networks requires replacing the adapter. GA4 and any campaign pixels are configured in the owner's GTM container, respecting the chosen consent categories; advertising pixels requiring additional marketing consent need that category added before deployment.

## Release boundary

No client assets, case-study results, team identities or contact details are fabricated. Illustrative projects publish only in local/development. Final business content, consent/legal configuration, SMTP, hosting, tracking and ad accounts are launch dependencies. Actual field Core Web Vitals, ad network approval and email deliverability can be established only in the deployment environment.
