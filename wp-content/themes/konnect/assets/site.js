(() => {
  document.documentElement.classList.add('js');
  const config = window.kvmConfig || {};
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  const closeMenu = () => { if (!toggle || !menu) return; menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); menu.hidden = !open; document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('a')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (!menu || menu.hidden) return;
    if (event.key === 'Escape') { closeMenu(); toggle.focus(); }
    if (event.key === 'Tab') {
      const links = [...menu.querySelectorAll('a')];
      const targets = [toggle, ...links]; const index = targets.indexOf(document.activeElement);
      if (event.shiftKey && index === 0) { event.preventDefault(); links.at(-1).focus(); }
      else if (!event.shiftKey && index === targets.length - 1) { event.preventDefault(); toggle.focus(); }
    }
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  let consent = null;
  try { consent = JSON.parse(localStorage.getItem('kvm-consent-v1')); } catch {}
  if (!consent || consent.version !== 1 || Date.now() - consent.savedAt > 180 * 86400000) consent = null;
  const banner = document.querySelector('[data-cookie-banner]');
  let gtmLoaded = false, adsLoaded = false;
  const loadScript = (src, callback) => { const script = document.createElement('script'); script.async = true; script.src = src; if (callback) script.onload = callback; document.head.append(script); };
  const optionalIntegrations = () => {
    if (consent?.analytics && config.gtm && !gtmLoaded) {
      gtmLoaded = true; window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtm)}`);
    }
    if (consent?.advertising && config.adsClient && document.querySelector('[data-ad-slot]') && !adsLoaded) {
      adsLoaded = true;
      loadScript(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsClient)}`, () => {
        document.querySelectorAll('[data-ad-slot]').forEach(slot => { slot.dataset.loaded = 'true'; (window.adsbygoogle = window.adsbygoogle || []).push({}); });
      });
    }
  };
  function saveConsent(analytics, advertising) {
    const revoked = (consent?.analytics && !analytics) || (consent?.advertising && !advertising);
    consent = { version: 1, savedAt: Date.now(), analytics, advertising };
    try { localStorage.setItem('kvm-consent-v1', JSON.stringify(consent)); if (!analytics) sessionStorage.removeItem('kvm-attribution'); } catch {}
    if (banner) banner.hidden = true;
    if (revoked) { window.location.reload(); return; }
    optionalIntegrations(); captureAttribution();
  }
  if (banner) banner.hidden = !!consent;
  document.querySelector('[data-consent-reject]')?.addEventListener('click', () => saveConsent(false, false));
  document.querySelector('[data-consent-accept]')?.addEventListener('click', () => saveConsent(true, true));
  const preferences = document.querySelector('[data-consent-form]');
  if (preferences) {
    preferences.elements.analytics.checked = !!consent?.analytics;
    preferences.elements.advertising.checked = !!consent?.advertising;
    preferences.addEventListener('submit', event => { event.preventDefault(); saveConsent(preferences.elements.analytics.checked, preferences.elements.advertising.checked); preferences.querySelector('[data-consent-status]').textContent = 'Your preferences have been saved.'; });
  }
  function captureAttribution() {
    if (!consent?.analytics) return;
    const params = new URLSearchParams(location.search); const values = {};
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => { if (params.has(key)) values[key] = params.get(key).slice(0, 100); });
    try { if (Object.keys(values).length) sessionStorage.setItem('kvm-attribution', JSON.stringify(values)); } catch {}
  }
  optionalIntegrations(); captureAttribution();
  const interest = new URLSearchParams(location.search).get('interest');
  document.querySelectorAll('[data-enquiry]').forEach(form => {
    if (interest && [...form.elements.service.options].some(option => option.value === interest)) form.elements.service.value = interest;
    form.addEventListener('submit', async event => {
      if (!window.fetch || !config.endpoint) return;
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]'); const status = form.querySelector('.form-status');
      form.querySelectorAll('.field-error').forEach(node => node.textContent = '');
      form.querySelectorAll('[aria-invalid]').forEach(node => node.removeAttribute('aria-invalid'));
      form.querySelector('.form-errors')?.remove();
      button.disabled = true; form.setAttribute('aria-busy', 'true'); status.textContent = 'Sending your enquiry…';
      try {
        if (consent?.analytics) { try { form.elements.attribution.value = sessionStorage.getItem('kvm-attribution') || ''; } catch {} }
        else form.elements.attribution.value = '';
        const response = await fetch(config.endpoint, { method: 'POST', credentials: 'same-origin', headers: config.restNonce ? { 'X-WP-Nonce': config.restNonce } : {}, body: new FormData(form) });
        const result = await response.json();
        if (!response.ok || !result.success) {
          const fields = result.data?.fields || {};
          Object.entries(fields).forEach(([key, message]) => {
            const input = form.elements.namedItem(key); if (!input) return;
            input.setAttribute('aria-invalid', 'true');
            const error = input.closest('.form-field')?.querySelector('.field-error');
            if (error) { error.textContent = message; if (!error.id) error.id = `${input.id}-error`; input.setAttribute('aria-describedby', error.id); }
          });
          status.textContent = result.message || 'Unable to send. Please try again.';
          (form.querySelector('[aria-invalid]') || status).focus(); return;
        }
        status.textContent = result.message; form.reset(); status.focus();
        if (consent?.analytics && config.gtm) (window.dataLayer = window.dataLayer || []).push({ event: 'enquiry_success' });
      } catch { status.textContent = 'The connection was interrupted. Please try again. If the enquiry was received, we’ll let you know.'; status.focus(); }
      finally { button.disabled = false; form.removeAttribute('aria-busy'); }
    });
  });
})();
