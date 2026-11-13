import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountSmoke } from './pocket-smoke.js';

gsap.registerPlugin(ScrollTrigger);
let cleanup = () => {};
let observer;
let generation = 0;
let stopSmoke = mountSmoke();

function watch() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.konnectStatic) return;
  const mount = async () => {
    const section = document.getElementById('konnect-slideshow');
    if (!section) return;
    observer.disconnect();
    const run = ++generation;
    const stage = section.querySelector('.konnect-flex-stage');
    const cards = [...section.querySelectorAll('.konnect-slide')];
    if (!stage || cards.length < 2) return;
    const images = cards.map(card => card.querySelector('img'));
    let carousel;
    try {
      const [{ createFlexCarousel }] = await Promise.all([
        import('./flex-carousel.js'),
        Promise.all(images.map(image => image.decode())),
      ]);
      if (run !== generation || !section.isConnected || window.konnectStatic) return;
      carousel = createFlexCarousel(stage, images);
    } catch (error) {
      console.warn('Flex Carousel could not start:', error);
      return; // The original articles stay in the page if WebGL or an image fails.
    }

    const state = { position: 0 };
    let active = 0;
    const compose = () => {
      carousel.seek(state.position);
      const next = Math.round(state.position);
      if (next === active) return;
      cards[active].classList.remove('is-current');
      cards[next].classList.add('is-current');
      active = next;
    };
    section.classList.add('is-scroll-driven');
    const context = gsap.context(() => {
      gsap.to(state, {
        position: cards.length - 1,
        ease: 'none',
        onUpdate: compose,
        scrollTrigger: {
          id: 'konnect-horizontal',
          trigger: section,
          start: 'top top',
          end: () => '+=' + Math.round(innerHeight * (cards.length - 1) * .8),
          pin: true,
          scrub: .45,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefresh: compose,
        },
      });
    }, section);

    const onContextLost = () => cleanup();
    const refresh = () => { if (run === generation) ScrollTrigger.refresh(); };
    cleanup = () => {
      ++generation;
      carousel.canvas.removeEventListener('webglcontextlost', onContextLost);
      context.revert();
      carousel.dispose();
      section.classList.remove('is-scroll-driven');
      cards[active].classList.remove('is-current');
      cards[0].classList.add('is-current');
      cleanup = () => {};
    };
    carousel.canvas.addEventListener('webglcontextlost', onContextLost, { once: true });
    compose();
    refresh();
    document.fonts.ready.then(refresh);
  };
  observer = new MutationObserver(mount);
  observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  mount();
}

window.addEventListener('pagehide', () => {
  stopSmoke();
  ++generation;
  observer?.disconnect();
  cleanup();
});
window.addEventListener('pageshow', event => { if (event.persisted) { stopSmoke = mountSmoke(); watch(); } });
watch();
