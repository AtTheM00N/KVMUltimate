# Cinematic studio architecture — 12 November 2026

> Historical architecture: the active runtime is now the editorial 2D experience documented in [editorial-2d.md](editorial-2d.md). This document describes the retained Blender/Three.js source.

## Art and narrative

The approved direction is an original creative studio, a red hinged Konnect portfolio, six chapters and roughly twelve desktop viewport heights. The palette is near-black/graphite, scarlet/action red and light/secondary grey. Bespoke Stencil headings and Manrope body text replace Montserrat/Inter. The homepage is one native scroll journey from studio entry through selected work, the four service beats, process, studio introduction and a working enquiry form. Main navigation jumps to those chapters; it does not take visitors into a row of separate marketing pages. Project detail, service detail, privacy and campaign URLs remain available when a visitor follows a deep link.

There are no numbered chapter labels, progress rails, arrow controls or repeated subtitle treatments. Bespoke Stencil carries short headlines; Manrope handles the minimal supporting copy and forms.

The reference is ORYZO's continuity and camera storytelling, as described by Lusion:
- https://blog.lusion.co/oryzo-bts-part-2-7-3d-design-and-motion-graphics
- https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations

No ORYZO assets or product claims are included. The studio is an illustration, not a representation of a verified physical office. Exact numerical animation fidelity has not been measured.

## Asset pipeline

`design-source/build_studio.py` and `detail_studio.py` build the original studio in Blender. The detailed props include a milled laptop enclosure, separate keycaps and legends, speaker perforations, hinges and ports; a layered tablet with camera, glass and controls; a curled paper brief with fibre texture, a wire clip and a machined pen. The room includes a graphite desk and legs, mineral-plaster wall, smoked-oak acoustic slats, shelves, books, archive boxes and a frosted window. These are original models, with no third-party model licensing dependency.

`konnect-studio.blend` is editable and includes packed material images and lighting data. Meshes are batched by material within prop groups for web performance; the Python construction files retain individual-part definitions. The scene uses original geometry and font outlines, with separate Fontshare FFL and Manrope OFL notices. The source GLB is retained outside the production theme.

The original red lacquer monogram was constructed with the Higgsfield 3D Jutsu plugin, then imported into the local scene. Its editable source is `design-source/higgsfield-monogram.blend` and its reproducible construction is `higgsfield-monogram.py`. Project: https://higgsfield.ai/3d-jutsu/22f351e7-ec84-4f09-b52c-f8db534da314 (revision 1). It is a source asset; the deployed website does not contact Higgsfield or require a Higgsfield account.

Static desk illumination and contact shading are baked in Cycles at 2048 pixels; other objects use physically based materials. Original 1024-pixel surface textures add restrained aluminium, paper, plaster and timber variation. This implementation uses a baked diffuse-light texture rather than a separate ambient-occlusion texture. Cycles produces nine 1920×1200 desktop views and five 960×1200 portrait views from the same scene at 40 samples with denoising. Camera coordinates are converted from Blender Z-up to glTF Y-up in `shots.json`.

`scripts/optimize-studio.mjs` converts material textures and the light map to mipmapped KTX2/Basis, preserves the 2048-pixel desk bake, applies Meshopt compression while retaining named nodes, and creates WebP posters. `assets/studio/manifest.json` records file sizes and SHA-256 hashes. The packaged Basis encoder is invoked directly; the optional native CPU-feature detector is not used.

## Runtime and failure boundaries

WordPress renders all text, project links and CTAs. The decorative canvas is never the only carrier of content. Native block rendering limits portfolio data to eligible published records and adds placeholder protection explicitly for production queries.

Vite builds a small base motion entry and a separate Three.js chunk. Only a homepage studio on a fine-pointer desktop at least 1024px wide, without reduced motion or Save-Data, imports the renderer. The poster and readable HTML are available before it loads. One normalized GSAP timeline and one ScrollTrigger scrub the entire camera, opening portfolio, chapter typography, project tiles and service beats across the homepage's single native scroll range. There are no independently restarting chapter animations, wheel/touch interception or snap scrolling.

Camera waypoints are measured against chapter and service elements, so edited content affects travel distance. The portfolio hinge reverses with scroll. A Hermite curve maintains continuous camera velocity between poses; pointer movement is capped. Tall edited copy is allowed to flow rather than remaining sticky. Rendering is demand-driven, pauses offscreen/in background tabs, and caps DPR at 1.5 with a sustained-slow-frame reduction to 1.

Static furniture uses one cached 2048-pixel directional shadow map. The moving portfolio cover is excluded from that cached caster pass to prevent stale cover shadows. The desk retains its baked contact shading. Material textures use up to 4× anisotropy where supported. Live lighting and cached-shadow quality still require browser GPU review.

The canvas replaces posters only after a successful render. Failed assets, a 15-second initialisation timeout or lost WebGL context restore the static presentation. Media-query changes dispose geometry, textures, workers, observers and triggers immediately, even during loading. Stale asynchronous loads release their own resources without altering a newer scene instance. Supporting pages use editorial layouts and short reveals, without the 3D bundle. The long desktop layout is enabled only once the motion module executes; missing JavaScript leaves naturally stacked chapters. Ordinary navigation links remain available until the dialog listeners are installed.

## WordPress and migration

The site plugin owns `konnect/studio-story` and `konnect/story-chapter`; chapter slots are fixed while text, links, posters and project choices remain editable. Scene geometry stays in the theme. Existing project, enquiry and integration interfaces are unchanged. No new public API is introduced.

Version 3 recognises the exact generated version-2 page variants in `studio-defaults-v2.json`. The explicit migration also removes the rejected arrow glyphs from page content, saving a revision while retaining other copy.

`kvm_migrate_studio()` is invoked explicitly through the maintenance command or WP-CLI. It saves revisions, replaces recognised seed content and reports customised pages it preserves. `kvm_normalize_studio_urls()` separately repairs only theme-owned studio image URLs. Neither runs on normal page requests. Preview data remains in ignored `.local/`; private backups are in ignored `.backups/`.

The CLI wrapper binds its HTTP listener to 127.0.0.1. Playground currently supplies no host argument, so the wrapper temporarily supplies the loopback host at HTTP-server startup and immediately restores Node's original method. Persistent boot uses the existing-site installation mode to avoid trying to unzip core files over an existing WordPress installation.

## Release boundary

The theme retains some inactive first-version vendor/font files; they are not enqueued. Deployment needs only the two installable ZIPs and approved media. The source ZIP is an editable project archive, not a WordPress upload. Final visual/browser acceptance and deployed field performance remain separate checks; successful PHP and asset validation do not establish them.
