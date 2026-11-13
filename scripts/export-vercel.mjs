import assert from 'node:assert/strict';
import { cp, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { runLocalCLI, siteOptions } from './runtime.mjs';

const output = path.resolve('dist');
const options = await siteOptions(9402);
Object.assign(options.blueprint.steps[0].consts, {
  WP_ENVIRONMENT_TYPE: 'production',
  WP_DEBUG: false,
  WP_DEBUG_LOG: false,
});
const server = await runLocalCLI(options);
const origin = `http://127.0.0.1:${server.server.address().port}`;

const unavailable = '<p>Online enquiries are currently unavailable on this site.</p>';
function prepareHtml(html) {
  return html.replaceAll(origin, '')
    .replaceAll(origin.replaceAll('/', '\\/'), '')
    .replace(/<link\b[^>]*\brel=["']dns-prefetch["'][^>]*href=["']\/\/127\.0\.0\.1["'][^>]*>/gi, '')
    .replace(/<form\b[^>]*\bdata-enquiry\b[^>]*>[\s\S]*?<\/form>/gi, unavailable)
    .replace(/<link\b[^>]*\brel=["'](?:https:\/\/api\.w\.org\/|alternate|EditURI|wlwmanifest|shortlink)["'][^>]*>/gi, '');
}

async function save(file, contents) {
  const destination = path.join(output, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, contents);
}

try {
  const coreAssets = new Set();
  const pages = ['/', '/work/', '/services/', '/about/', '/contact/', '/campaign/', '/privacy/', '/cookie-preferences/', '/missing-page/'];
  for (const route of pages) {
    const response = await fetch(origin + route);
    const missing = route === '/missing-page/';
    assert.equal(response.status, missing ? 404 : 200, `Export ${route}`);
    const html = prepareHtml(await response.text());
    assert.ok(html.includes('<main'), `${route} rendered without its main content`);
    assert.ok(!html.includes('127.0.0.1'), `${route} contains a local URL`);
    if (route === '/') assert.match(html, /grail\/index-qyEp212_\.js/, 'Export uses the current homepage');
    for (const match of html.replaceAll('\\/', '/').matchAll(/\/wp-includes\/[\w./-]+\.(?:js|css|png|svg|gif|woff2)\b/g)) {
      coreAssets.add(match[0]);
    }
    await save(missing ? '404.html' : `${route.slice(1)}index.html`, html);
  }

  for (const asset of coreAssets) {
    const response = await fetch(origin + asset);
    if (!response.ok) continue; // WordPress also names inline styles in source comments.
    await save(asset.slice(1), Buffer.from(await response.arrayBuffer()));
  }
  const theme = 'wp-content/themes/konnect/assets';
  await cp(theme, path.join(output, theme), {
    recursive: true,
    filter: source => !/[\\/](?:vendor|\.vite)(?:[\\/]|$)|\.glb$/i.test(source),
  });
  await save('robots.txt', 'User-agent: *\nDisallow: /\n');
  console.log(`Exported ${pages.length - 1} pages, a 404 page and their assets to dist/`);
} finally {
  await server[Symbol.asyncDispose]();
}
