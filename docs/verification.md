# Verification — 2026-11-11

## Completed

`npm run verify` passed on WordPress 6.8.12 / PHP 8.3.36 using isolated Playground instances. Its full output is in `artifacts/verification.txt`.

- PHP source parsing, block theme activation, native block content and editable service copy.
- Private enquiry storage and administrator access; anonymous access rejected and enquiry REST records unavailable.
- Invalid email, expired nonce, malformed fields, honeypot, duplicate detection and rate limits.
- Successful storage despite missing mail settings or a failed mail transport.
- Unverified results hidden and approved results rendered.
- HTTP responses and expected content for all eight pages, a project detail and a filtered work listing.
- Actual HTTP enquiry submission with a minimal success payload, plus no-JavaScript validation and value restoration.
- Useful 404 response, disabled local integrations, production placeholder publishing prevention, production slot configuration and campaign ad exclusion.
- Default WordPress starter blog content removed during setup.

JavaScript syntax checks passed for the editor, site interactions and motion scripts. Theme JSON and bundled font references were checked. `npm install` reported zero vulnerabilities after applying patched development dependency overrides. Installable ZIPs were generated and their directory structure inspected.

## Not verified

The browser origin approval gate declined access to the local preview. No browser workaround was used. Rendered desktop/mobile layout, hover and scroll behavior, keyboard interaction, screen-reader behavior and Gutenberg editor interaction therefore still need browser review. Syntax checks and successful page responses do not establish these visual or interaction properties.

Email deliverability, real analytics/pixel behavior, ad network acceptance, staging compatibility, production deployment and field Core Web Vitals require the actual hosting and service accounts. Optional integrations remain disabled in the local build. See the launch checklist before enabling paid traffic or publisher ads.

The local preview server was stopped after checks. Run `npm run dev` to restart the persisted site.
