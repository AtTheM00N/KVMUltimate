const SERVICES = [
  { label: 'Social', hero: 'knight', poster: 'GOOD COMPANY', heading: 'Find your voice.', copy: 'Social strategy and content with a point of view.' },
  { label: 'Design', hero: 'ranger', poster: 'Layered Konnect K', heading: 'Make a mark.', copy: 'Identities and visual worlds built around your brand.' },
  { label: 'Search', hero: 'mage', poster: 'BE FOUND.', heading: 'Be found.', copy: 'Help the right people find your brand.' },
  { label: 'Campaigns', hero: 'bard', poster: 'LET’S TALK.', heading: 'Start a conversation.', copy: 'Campaign messaging, creative and landing pages.' },
];

// Adapted from React Bits SpotlightCard (David Haz, MIT + Commons Clause).
// https://reactbits.dev/r/SpotlightCard-JS-CSS.json
// License: docs/react-bits-smoke.md. The existing homepage supplies the React runtime.
function moveServiceSpotlight(event) {
  if (event.pointerType !== 'mouse' || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
}

export function PocketMagic() {
  const chapter = window.konnectContent?.services;
  const serviceCopy = chapter?.serviceCopy || {};

  return hs('section', {
    id: 'pocket-magic',
    className: 'pq-magic konnect-services',
    'aria-labelledby': 'pq-magic-title',
    children: [
      h('h2', { id: 'pq-magic-title', children: chapter?.heading || 'What we do' }),
      h('div', {
        className: 'konnect-services-grid',
        children: SERVICES.map(({label, hero, poster, heading, copy}, index) =>
          hs('article', {
            className: 'konnect-service',
            onPointerMove: moveServiceSpotlight,
            children: [
              h('img', {
                className: 'konnect-service-poster',
                src: asset('/heroes/' + hero + '.webp'),
                alt: `Konnect poster study: ${poster}`,
                width: 1024,
                height: 1024,
                loading: 'lazy',
                decoding: 'async',
              }),
              hs('div', {
                className: 'konnect-service-copy',
                children: [
                  h('h3', { children: label }),
                  h('p', { className: 'konnect-service-heading', children: serviceCopy[index + '_heading'] || heading }),
                  h('p', { children: serviceCopy[index + '_copy'] || copy }),
                  h('button', {
                    className: 'konnect-service-enquiry',
                    type: 'button',
                    onClick: play,
                    children: `Enquire about ${label}`,
                  }),
                ],
              }),
            ],
          }, hero)),
      }),
    ],
  });
}
