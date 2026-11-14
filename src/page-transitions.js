(() => {
  const warmed = new Set();
  const routes = new Set(['/work/', '/services/', '/about/', '/contact/']);
  function warm(event) {
    const connection = navigator.connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !routes.has(url.pathname) || url.search || url.hash || warmed.has(url.href)) return;
    const hint = document.createElement('link');
    if (!hint.relList.supports('prefetch')) return;
    warmed.add(url.href);
    hint.rel = 'prefetch'; hint.as = 'document'; hint.href = url.href;
    document.head.append(hint);
  }
  // A browser hint respects normal HTTP caching, including Contact's no-store.
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);
})();
