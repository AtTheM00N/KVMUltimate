import { gsap } from 'gsap';

// One set of real links stays in the document, including during the handoff.
// Only positions and type size change; text is never scaled as a bitmap.
export function watchPhoneNavigation() {
  let dispose = () => {}, observer;
  const start = () => {
    if (window.konnectStatic) return;
    const nav = document.querySelector('.konnect-links');
    const slot = document.querySelector('.konnect-phone-menu-slot');
    if (!nav || !slot) return;
    observer?.disconnect();
    const links = [...nav.querySelectorAll('a')];
    const phone = slot.closest('.pq-phone');
    const motion = { mix: 0 };
    const measure = document.createElement('canvas').getContext('2d');
    let docked = false, frame = 0, tween, lastGeometry = '';
    nav.classList.add('is-managed');

    const render = () => {
      frame = 0;
      if (!slot.isConnected || document.documentElement.classList.contains('konnect-static')) return;
      const rect = slot.getBoundingClientRect();
      const mobile = innerWidth <= 900;
      const viewportHeight = window.visualViewport?.height || innerHeight;
      // Hysteresis prevents repeated handoffs at the viewport boundary.
      const margin = docked ? 16 : 72;
      const eligible = rect.top >= margin && rect.bottom <= viewportHeight - margin && rect.height >= 192;
      const exposed = eligible && [rect.top + 8, rect.bottom - 8].every(y => {
        const hit = document.elementsFromPoint(rect.left + rect.width / 2, y).find(element => !nav.contains(element));
        return hit && phone.contains(hit);
      });
      const next = exposed && !document.body.classList.contains('pq-is-loading');
      if (next !== docked) {
        docked = next;
        nav.dataset.placement = next ? 'phone' : 'floating';
        tween?.kill();
        tween = gsap.to(motion, {
          mix: next ? 1 : 0, duration: mobile ? .18 : .42,
          ease: 'power2.inOut', onUpdate: schedule,
        });
      }
      const mix = motion.mix;
      const geometry = [mix, rect.left, rect.top, rect.width, rect.height, innerWidth, viewportHeight].join(':');
      if (geometry === lastGeometry) return;
      lastGeometry = geometry;
      measure.font = '500 14px "Clash Grotesk"';
      const floatingWidth = Math.min(344, innerWidth - 32);
      const floating = { left: (innerWidth - floatingWidth) / 2, top: mobile ? viewportHeight - 72 : 20, width: floatingWidth, height: 52 };
      const blend = (a, b) => a + (b - a) * mix;
      Object.assign(nav.style, {
        left: `${blend(floating.left, rect.left)}px`, top: `${blend(floating.top, rect.top)}px`,
        width: `${blend(floating.width, rect.width)}px`, height: `${blend(floating.height, rect.height)}px`,
        borderColor: `rgba(255,255,255,${.2 * (1 - mix)})`,
        backgroundColor: `rgba(0,0,0,${.55 * (1 - mix)})`,
        // Mobile changes layout under a brief fade, without stretching labels.
        opacity: String(mobile ? Math.abs(2 * mix - 1) : 1),
      });
      nav.style.setProperty('--nav-tint', String(.55 * (1 - mix)));
      const layout = mobile ? (mix >= .5 ? 1 : 0) : mix;
      links.forEach((link, i) => {
        Object.assign(link.style, {
          left: `${(floatingWidth - 16) / 4 * i * (1 - layout) + 8 * (1 - layout)}px`,
          top: `${blend(0, rect.height / 4 * i)}px`,
          width: `${blend((floatingWidth - 16) / 4, rect.width)}px`,
          height: `${blend(50, rect.height / 4)}px`,
          fontSize: `${blend(14, mobile ? 28 : 32)}px`,
          paddingLeft: `${blend(((floatingWidth - 16) / 4 - measure.measureText(link.textContent).width) / 2, 16)}px`,
          borderBottomColor: i < 3 ? `rgba(255,255,255,${.18 * mix})` : 'transparent',
        });
      });
      nav.classList.toggle('is-docked', mix > .99);
    };
    function schedule() { if (!frame) frame = requestAnimationFrame(render); }
    const resize = new ResizeObserver(schedule);
    resize.observe(slot);
    // The preceding ThreeUI sheet can cover the phone while its rect is in view.
    // Track its animated exit as well as native scrolling before docking.
    const visibility = new IntersectionObserver(([entry]) => {
      gsap.ticker.remove(schedule);
      if (entry.isIntersecting) gsap.ticker.add(schedule);
      schedule();
    });
    visibility.observe(phone);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    document.fonts.ready.then(schedule);
    schedule();
    dispose = () => {
      tween?.kill(); cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); gsap.ticker.remove(schedule);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      nav.classList.remove('is-managed', 'is-docked');
      nav.removeAttribute('style'); delete nav.dataset.placement;
      links.forEach(link => link.removeAttribute('style'));
    };
  };
  function watch() {
    observer = new MutationObserver(start);
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
    start();
  }
  window.addEventListener('pagehide', () => { observer?.disconnect(); dispose(); });
  window.addEventListener('pageshow', event => { if (event.persisted) watch(); });
  watch();
}
