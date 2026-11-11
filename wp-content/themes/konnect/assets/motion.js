(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.hero h1', { y: 24, opacity: 0, duration: .85, clearProps: 'all' });
    gsap.from('.hero-sculpture', { y: 30, opacity: 0, duration: 1.1, delay: .15, clearProps: 'all' });
    document.querySelectorAll('[data-reveal]').forEach(el => gsap.from(el, { y: 24, opacity: 0, duration: .65, clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));
  });
  gsap.matchMedia().add('(min-width: 1001px) and (prefers-reduced-motion: no-preference)', () => {
    const feature = document.querySelector('.featured-work');
    if (feature) gsap.to(feature.querySelectorAll('.project-card:nth-child(even)'), { y: -65, ease: 'none', scrollTrigger: { trigger: feature, start: 'top 85%', end: 'bottom 30%', scrub: .8 } });
    gsap.to('.sculpture-disc', { y: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  });
})();
