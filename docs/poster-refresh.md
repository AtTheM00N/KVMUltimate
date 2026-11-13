# Poster and navigation refresh

Restores the original Konnect Bespoke Stencil compositions from revision ae59a78, retaining the current palette and fitting every theme-owned poster onto an equal 1024×1024 square. The original landscape composition remains intact inside the square. Owner uploads are not modified.

The immersive homepage work outro now contains only its editable heading, Big connections (white italic emphasis), and a divider. It no longer renders the selected-project cards. Project records and their individual pages are retained.

The fixed navigation has a transparent rectangular surface with a subtle outline and backdrop blur. The desktop phone-scene heading begins at 92px, below the navigation's 70px lower edge. The phone is sized to fit the remaining space.

React Bits FlexCarousel-JS-CSS was retrieved through the shadcn MCP on 2026-11-13. All four current card/lens shader passes are used in src/flex-carousel-shaders.js. The existing OGL adapter and GSAP scroll input retain the finite six-card journey, using the liquid preset with reduced bend and no chromatic dispersion to preserve the poster lettering and palette. Source: https://reactbits.dev/r/FlexCarousel-JS-CSS.json. Copyright David Haz; full MIT + Commons Clause terms are in react-bits-smoke.md.

Local browser checks: transparent navigation, 22px heading clearance, no selected-study cards, white connections text, six loaded 1024×1024 posters, active Flex renderer. Screenshots are in artifacts/poster-refresh.
