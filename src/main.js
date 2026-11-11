import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('motion-ready');

const story = document.querySelector('[data-studio]');
const media = gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll('[data-reveal], .page-intro, .studio-still, .about-principles section').forEach(element => {
    gsap.from(element, { y: 22, opacity: 0, duration: .55, ease: 'power2.out', clearProps: 'all',
      scrollTrigger: { trigger: element, start: 'top 93%', once: true } });
  });
  document.querySelectorAll('.story-chapter:not(.chapter-intro) .chapter-title').forEach(element => {
    gsap.from(element, { y: 18, opacity: 0, clipPath: 'inset(100% 0 0 0)', duration: .6, ease: 'power2.out', clearProps: 'all',
      scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
  });
});
if (story) {
  let generation = 0;
  const eligible = matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  let dispose = () => {};
  async function update() {
    const token = ++generation;
    dispose(); dispose = () => {};
    story.classList.remove('is-immersive', 'is-painted', 'is-in-view');
    if (!eligible.matches || navigator.connection?.saveData) { story.classList.add('is-static'); return; }
    story.classList.remove('is-static');
    try {
      const { mountStudio } = await import('./studio.js');
      if (token !== generation) return;
      // Mount returns its disposer immediately, including while assets are loading.
      dispose = mountStudio(story, gsap, ScrollTrigger, () => token === generation && eligible.matches);
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
