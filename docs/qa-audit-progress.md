# QA audit — in progress

Baseline: b1bd892. Initial audit only; no website fixes applied.

## Owner preferences

- Prioritize exploring the visual experience.
- Preserve the current immersive animation pace.
- Contact-channel preference pending.

## Browser gate

Live inspection of https://kvm-ultimate.vercel.app was rejected by the browser's saved permission policy. No alternate browser, HTTP access, proxy, or local reproduction was used to circumvent it. Live screenshots, interaction tests, and responsive checks remain pending. Historical checks from development turns do not count as completion of this audit.

## Architecture and route inventory

WordPress block theme and custom konnect-site plugin provide content and PHP enquiry handling. The homepage adapts the registered ThreeUI React source, uses GSAP ScrollTrigger, and loads an OGL Flex Carousel renderer. Supporting pages use WordPress templates and shared site CSS/JS. Vercel receives a static export from an isolated WordPress Playground instance; it does not host the PHP enquiry backend.

| Route | Purpose | Browser status |
|---|---|---|
| / | Animated homepage and enquiry dialog | Blocked |
| /work/ | Work index | Pending |
| /services/ | Four services and service anchors | Pending |
| /about/ | Studio information | Pending |
| /contact/ | Contact journey | Pending |
| /campaign/ | Campaign landing page | Pending |
| /privacy/ | Privacy text | Pending |
| /cookie-preferences/ | Consent controls | Pending |
| /missing-page/ | 404 behavior | Pending |
| /project/{slug}/ | WordPress project details; absent from static export route list | Discover published links before testing |

## Source findings requiring browser verification

| ID | Severity | Route/component | Source evidence | Expected vs actual in source | Suggested action |
|---|---|---|---|---|---|
| S01 | Critical | /, /contact/, /campaign/ enquiries | scripts/export-vercel.mjs:16–21 | Enquiry journey should provide a contact method; exporter replaces every data-enquiry form with an unavailable message | Establish owner's contact preference and implement a supported endpoint or direct contact channel |
| S02 | High | / — phone “Explore our work” | Generated pocket-content.js:7,10,23; src/pocket-brand.js:6–7 | Work button should reach work; generic Button dispatches pocket-play, which opens contact dialog | Give work action its own route or section target |
| S03 | Medium | Generated template CSS | scripts/pocket-dark.mjs:46 | Color normalization should change color values only; global word replacement also matches white in white-space and pre-wrap-style keyword contexts | Restrict replacement to parsed CSS color values; inspect regenerated CSS and affected layout |
| S04 | High, conditional | Search indexing | vercel.json:10; scripts/export-vercel.mjs:58 | Public launch may require indexing; all routes use noindex/nofollow and robots disallow | Ask whether site is still a private review build before changing |
| S05 | High, conditional | /project/{slug}/ | scripts/export-vercel.mjs:33; includes/content.php project registration | Published project links require detail documents; exporter lists only eight fixed pages plus 404 | Discover visible project links; export any published project routes |

These are code-level findings. Viewport, live reproduction, screenshot evidence, observed severity and regression results remain unfilled until browser access is granted. Conditional entries must not be presented as observed failures.

## Required next checks

Visit every available route; inspect each homepage section; exercise primary nav and back/forward, phone tiles, work links, carousel forward/backward and mid-scroll refresh, contact dialog focus/Escape, cookie saving and reload, and 404 recovery. Inspect no-JavaScript, reduced-motion and WebGL-failure presentations separately.

Viewport matrix (all pending): 1920×1080, 1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 375×812, 360×800. Check 768/769 and 900/901 breakpoint transitions.

Record exact route, viewport, reproduction, expectation, result, screenshot/log evidence, proposed fix and retest status for each browser finding. Complete the initial register before remediation.
