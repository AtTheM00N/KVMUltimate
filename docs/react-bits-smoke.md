# Konnect smoke atmosphere

Adapted from React Bits `DarkVeil-JS-CSS`, retrieved through its shadcn MCP registry on 2026-11-13. Source: https://reactbits.dev/r/DarkVeil-JS-CSS.json

The original CPPN field is retained in `src/smoke-field.js`. Konnect replaces the purple composite with dim-grey smoke, reduces speed and resolution, and shares one OGL renderer across visible chapter backgrounds. GSAP ScrollTrigger fades the existing red feature atmosphere into black before the Flex Carousel. Existing ThreeUI geometry and content remain in place.

Reduced motion and data saving use the existing static presentation. WebGL failures retain the original black backgrounds. Animation stops when hidden; page teardown releases resources.

## Verification

- Vite build and JavaScript syntax checks passed.
- Local Edge browser checks at 320, 390, 768, 1024 and 1440 pixels; no horizontal overflow at the measured mobile/tablet widths.
- Reduced motion: zero smoke canvases mounted.
- No JavaScript exceptions in the desktop/mobile browser run. Four existing remote template SVG paths return 404; these are outside this background change.
- `node scripts/verify.mjs`: PHP, HTTP and production checks passed.
- Local visual evidence: `artifacts/smoke/` (not deployment assets).

## Upstream license

MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
