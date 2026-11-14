(() => {
  document.documentElement.classList.add('js');
  const config = window.kvmConfig || {};
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-menu');
  const closeMenu = () => { if (menu?.open) menu.close(); };
  toggle?.addEventListener('click', () => {
    if (!menu) return;
    if (menu.open) { closeMenu(); return; }
    menu.showModal(); toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open');
    menu.querySelector('.menu-close')?.focus();
  });
  menu?.querySelector('.menu-close')?.addEventListener('click', closeMenu);
  menu?.addEventListener('close', () => {
    toggle?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); toggle?.focus();
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  if (toggle && typeof menu?.showModal === 'function') document.documentElement.classList.add('menu-ready');

  for (const serviceMenu of document.querySelectorAll('.services-menu')) {
    const list = serviceMenu.querySelector('.services-menu-list');
    const choices = [...list.querySelectorAll('.services-menu-choice')];
    const panels = choices.map(choice => serviceMenu.querySelector(choice.hash));
    if (!choices.length || panels.some(panel => !panel)) continue;

    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Choose a service');
    list.setAttribute('aria-orientation', 'vertical');

    function selectService(choice, updateAddress = false) {
      choices.forEach((option, index) => {
        const selected = option === choice;
        option.setAttribute('aria-selected', String(selected));
        option.tabIndex = selected ? 0 : -1;
        panels[index].hidden = !selected;
      });
      if (updateAddress && location.hash !== choice.hash) {
        history.replaceState(history.state, '', choice.hash);
      }
    }

    const choiceFromHash = () => choices.find(choice => choice.hash === location.hash);
    choices.forEach((choice, index) => {
      const panel = panels[index];
      choice.setAttribute('role', 'tab');
      choice.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', choice.id);
      panel.tabIndex = 0;

      choice.addEventListener('click', event => {
        if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        event.preventDefault();
        selectService(choice, true);
      });

      choice.addEventListener('keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        let next;
        switch (event.key) {
          case 'ArrowUp': next = choices[(index - 1 + choices.length) % choices.length]; break;
          case 'ArrowDown': next = choices[(index + 1) % choices.length]; break;
          case 'Home': next = choices[0]; break;
          case 'End': next = choices.at(-1); break;
          case ' ': next = choice; break;
          default: return;
        }
        event.preventDefault();
        selectService(next, true);
        next.focus();
      });
    });

    selectService(choiceFromHash() ?? choices[0]);
    serviceMenu.classList.add('is-interactive');
    window.addEventListener('hashchange', () => {
      const choice = choiceFromHash();
      if (choice || !location.hash) selectService(choice ?? choices[0]);
    });
  }

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
  if (banner) banner.hidden = !!consent || !(config.gtm || config.adsClient);
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
