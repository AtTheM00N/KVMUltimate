import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('motion-ready');

const story = document.querySelector('[data-studio]');
const media = gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll('[data-reveal], .page-intro, .studio-still, .about-principles section').forEach(element => {
    gsap.from(element, { y: 22, opacity: .65, duration: .55, ease: 'power2.out', clearProps: 'all',
      scrollTrigger: { trigger: element, start: 'top 93%', once: true } });
  });
});
if (story) {
  let generation = 0;
  const eligible = matchMedia('(min-width:1024px) and (prefers-reduced-motion:no-preference)');
  let dispose = () => {};
  async function update() {
    const token = ++generation;
    dispose(); dispose = () => {};
    story.classList.remove('is-scroll');
    if (!eligible.matches || navigator.connection?.saveData) { story.classList.add('is-static'); return; }
    story.classList.remove('is-static');
    try {
      const { mountScroll } = await import('./scroll.js');
      if (token !== generation) return;
      dispose = mountScroll(story, gsap, ScrollTrigger);
    } catch (error) {
      if (token !== generation) return;
      story.classList.add('is-static');
      story.dataset.sceneState = 'fallback';
      console.warn('Konnect studio: static presentation is active.', error.message);
    }
  }
  eligible.addEventListener('change', update);
  update();
  window.addEventListener('pagehide', () => { generation++; dispose(); });
  window.addEventListener('pageshow', event => { if (event.persisted) update(); });
}
