# Launch checklist

## Staging

- Back up the existing files/database if replacing any site; create a restore point and verify the host's rollback procedure.
- Install the theme and companion plugin on staging with indexing disabled. Verify WordPress/PHP compatibility and permalinks.
- Replace all demo work with approved project assets and descriptions; leave unapproved entries as drafts. Remove preview-specific home/work/about/privacy copy using the editor. Verify no placeholders are public and results have supporting evidence.
- Supply the official logo, team profiles if wanted, public business email, legal identity and privacy contact. Approve the privacy notice, retention policy and actual provider list.
- Configure authenticated email and the enquiry recipient. Confirm a real enquiry is saved and its email arrives. Verify a mail failure is flagged without losing the enquiry.
- Review keyboard access, mobile navigation, touch behavior, contrast, form errors, no-JavaScript behavior, reduced motion, gallery alt text and page titles at 320, 768, 1024 and 1440px.
- Check valid/invalid/duplicate/spam/rate-limited submissions, REST privacy, campaign attribution and analytics events. Use host rate limiting for campaign-scale abuse protection.
- Exclude contact/campaign pages, admin-post and enquiry state URLs from page/CDN caching; form nonces must not be served stale. Review other pages if an enquiry block is inserted there.
- Configure GA4 and required campaign tags in GTM. Make tag behavior match the consent categories. Verify optional scripts stay absent before consent and that conversion payloads contain no personal details. Configure removal of provider cookies on withdrawal as required by the selected providers.
- For publisher ads, confirm network acceptance, policy-compliant placements, account/slot IDs and `ads.txt` requirements. The bundled adapter supports AdSense. Confirm no publisher ads appear on campaign pages or demo work.

## Release

- Back up the tested staging release and production before installation. Set `WP_ENVIRONMENT_TYPE=production`, disable debug display and ensure HTTPS.
- Keep local databases, development dependencies, test files and local credentials out of the deployment. Upload the two installable ZIPs and approved media only.
- Point the domain to the managed host, enable server caching/CDN and verify cache exclusions. Enable search indexing only after content review, set canonical domain, sitemap and social previews through the chosen SEO configuration.
- Verify all public URLs, 404s, contact delivery and consent behavior on the real domain. Activate the integration-ready setting only after privacy and account review.
- Confirm `enquiry_success` in the analytics debugger before enabling paid traffic. Monitor private enquiry storage, mail transport and campaign performance after launch.
- If release checks fail, restore the previous theme/plugin versions and database snapshot using the host's rollback procedure. Preserve new enquiries before any database rollback.

## Post-launch

Monitor field Core Web Vitals, errors, broken links and deliverability. Apply maintained WordPress/plugin updates through staging. Review and delete enquiries according to the approved retention policy. Revisit consent wording whenever providers or processing purposes change.
