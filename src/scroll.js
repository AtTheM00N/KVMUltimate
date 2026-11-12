/** One native-scroll composition timeline; reading never depends on its playhead. */
export function mountScroll(root, gsap, ScrollTrigger) {
  let disposed = false;
  let frame = 0;
  let trigger;
  let observer;
  const timeline = gsap.timeline({ paused: true });
  const originals = new Map();
  const images = [...root.querySelectorAll('img')];

  function restore() {
    for (const [element, style] of originals) {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    }
  }

  function measure() {
    if (disposed) return;
    const progress = timeline.progress();
    timeline.clear();
    restore();
    const rootTop = root.getBoundingClientRect().top + scrollY;
    const distance = Math.max(1, root.offsetHeight - innerHeight);
    root.querySelectorAll('.chapter-poster,.service-poster,.story-project-image,.work-art').forEach(element => {
      if (!element.getClientRects().length) return;
      const image = element.querySelector('img');
      if (!image) return;
      if (!originals.has(image)) originals.set(image, image.getAttribute('style'));
      const top = element.getBoundingClientRect().top + scrollY - rootTop;
      const start = Math.max(0, Math.min(.95, (top - innerHeight * .9) / distance));
      timeline.fromTo(image, { scale: 1.075, yPercent: 2 }, {
        scale: 1, yPercent: 0,
        duration: Math.min(1 - start, innerHeight * .8 / distance),
        ease: 'none', immediateRender: false
      }, start);
    });
    timeline.to({ value: 0 }, { value: 1, duration: 1, ease: 'none' }, 0);
    timeline.progress(progress, true);
  }

  function refresh() {
    if (disposed || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!disposed) ScrollTrigger.refresh();
    });
  }

  function cleanup() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer?.disconnect();
    images.forEach(image => image.removeEventListener('load', refresh));
    trigger?.kill();
    timeline.kill();
    restore();
    root.classList.remove('is-scroll');
    root.dataset.sceneState = 'static';
  }

  try {
    trigger = ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom',
      animation: timeline, scrub: .45, onRefreshInit: measure });
    observer = new ResizeObserver(refresh);
    observer.observe(root);
    images.forEach(image => image.addEventListener('load', refresh));
    document.fonts?.ready.then(refresh);
    root.classList.add('is-scroll');
    measure();
    ScrollTrigger.refresh();
    root.dataset.sceneState = 'ready';
  } catch (error) {
    cleanup();
    throw error;
  }
  return cleanup;
}
