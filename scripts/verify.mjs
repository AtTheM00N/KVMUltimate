import { runLocalCLI as runCLI, siteOptions } from './runtime.mjs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/verification.txt', 'Verification in progress; this is not a passing report.\n');
const server = await runCLI(await siteOptions(9401));
assert.equal(server.server.address().address, '127.0.0.1', 'Test server binds loopback');
try {
  const php = await server.playground.run({ code: await readFile('scripts/verify.php', 'utf8') });
  const output = typeof php.text === 'string' ? php.text : new TextDecoder().decode(php.bytes);
  console.log(output);
  assert.ok(output.includes('ALL PHP CHECKS PASSED'), 'PHP integration checks failed');
  const results = [];
  const expected = { '/': 'KONNECT', '/work/': 'Selected work', '/services/': 'What we do', '/about/': 'One connected studio', '/contact/': 'Make contact', '/campaign/': 'Give your next', '/privacy/': 'Handled with care.', '/cookie-preferences/': 'A clear view', '/project/the-social-canvas/': 'The social canvas' };
  for (const route of ['/', '/work/', '/work/?service=graphic-design', '/services/', '/about/', '/contact/', '/campaign/', '/privacy/', '/cookie-preferences/', '/project/the-social-canvas/']) {
    const response = await fetch(`http://127.0.0.1:9401${route}`);
    const body = await response.text();
    assert.equal(response.status, 200, `${route} status: ${body.slice(-1200)}`);
    assert.ok(!/Fatal error|Warning:|There has been a critical error/.test(body), `${route} PHP errors`);
    assert.ok(body.includes('<main'), `${route} main landmark`);
    assert.ok(!/[↗↓→↑←↘]/u.test(body), `${route} no arrow UI`);
    assert.ok(!body.includes('chapter-kicker') && !body.includes('chapter-nav'), `${route} no chapter numbering or progress rail`);
    if (expected[route]) assert.ok(body.includes(expected[route]), `${route} correct content`);
    if (route.includes('service=graphic-design')) { assert.ok(body.includes('Form &amp; feeling')); assert.ok(!body.includes('The social canvas')); }
    assert.ok(!body.includes('googletagmanager.com/gtm.js'), `${route} tracking disabled locally`);
    if (route === '/campaign/') assert.ok(!body.includes('publisher-ad'), 'Campaign has no publisher ads');
    if (route === '/') {
      assert.equal((body.match(/data-chapter="/g) || []).length, 6, 'Six semantic chapters');
      assert.equal((body.match(/<h1\b/g) || []).length, 1, 'One semantic page heading');
      assert.ok(body.includes('/assets/pocket/brand.css'), 'Konnect template styling loaded');
      assert.ok(body.includes('grail/index-qyEp212_.js'), 'Registered template bootstrap loaded');
      assert.ok(body.includes('window.konnectContent='), 'Editable chapter data supplied');
      assert.ok(body.includes('id="konnect-contact"') && body.includes('id="konnect-fallback"'), 'Native enquiry dialog and static content rendered');
      assert.ok(!body.includes('<iframe'), 'Template renders directly in WordPress');

    } else assert.ok(!body.includes('data-studio '), `${route} has no immersive canvas`);
    results.push(`PASS ${route}`);
  }
  for (const file of ['mark.svg', 'intro.webp', 'intro-mobile.webp', 'work.webp', 'social.webp', 'identity.webp', 'search.webp', 'lead.webp', 'process.webp', 'studio.webp', 'contact.webp']) {
    const response = await fetch(`http://127.0.0.1:9401/wp-content/themes/konnect/assets/studio/${file}`);
    assert.equal(response.status, 200, `Scene asset ${file} served`);
    assert.ok((await response.arrayBuffer()).byteLength > 100, `${file} nonempty`);
  }
  results.push('PASS Konnect artwork served; six static HTML chapters, native enquiry dialog and registered template bootstrap');
  assert.equal((await fetch('http://127.0.0.1:9401/page-that-does-not-exist/')).status, 404);
  const privateResponse = await fetch('http://127.0.0.1:9401/wp-json/wp/v2/kvm_enquiry');
  assert.equal(privateResponse.status, 404, 'Enquiries absent from REST');
  const contact = await (await fetch('http://127.0.0.1:9401/contact/')).text();
  const nonce = contact.match(/name="kvm_nonce" value="([^"]+)"/)[1];
  const submission = new FormData();
  Object.entries({ kvm_nonce: nonce, name: 'HTTP verification', email: 'http@example.test', service: 'SEO', brief: 'This is an isolated HTTP integration test enquiry.' }).forEach(([key, value]) => submission.set(key, value));
  const accepted = await fetch('http://127.0.0.1:9401/wp-json/konnect/v1/enquiries', { method: 'POST', body: submission });
  const payload = await accepted.json();
  assert.equal(accepted.status, 200); assert.equal(payload.success, true); assert.deepEqual(Object.keys(payload).sort(), ['message', 'success']);
  submission.set('email', 'invalid'); submission.set('action', 'kvm_enquiry'); submission.set('return_url', 'http://127.0.0.1:9401/contact/');
  const fallback = await fetch('http://127.0.0.1:9401/wp-admin/admin-post.php', { method: 'POST', body: submission, redirect: 'manual' });
  assert.equal(fallback.status, 302);
  assert.ok(fallback.headers.get('location').includes('enquiry_state='));
  const errorPage = await (await fetch(fallback.headers.get('location'))).text();
  assert.ok(errorPage.includes('Enter a valid email address.')); assert.ok(errorPage.includes('HTTP verification'));
  results.push('PASS HTTP enquiry success, minimal payload, and no-JavaScript validation fallback');
  await mkdir('artifacts', { recursive: true });
  await writeFile('artifacts/verification.txt', `${output}\n${results.join('\n')}\nPASS 404 and private enquiry API\n`);
  console.log(results.join('\n')); console.log('ALL HTTP CHECKS PASSED');
} catch (error) {
  if (error.response?.bytes) console.error(new TextDecoder().decode(Uint8Array.from(Object.values(error.response.bytes))));
  throw new Error(error.message);
} finally { await server[Symbol.asyncDispose](); }
const productionOptions = await siteOptions(9401);
productionOptions.blueprint.steps[0].consts.WP_ENVIRONMENT_TYPE = 'production';
const production = await runCLI(productionOptions);
try {
  const php = await production.playground.run({ code: await readFile('scripts/verify-production.php', 'utf8') });
  const output = typeof php.text === 'string' ? php.text : new TextDecoder().decode(php.bytes);
  console.log(output);
  assert.ok(output.includes('ALL PRODUCTION CHECKS PASSED'));
  const demo = await fetch('http://127.0.0.1:9401/project/the-social-canvas/');
  assert.equal(demo.status, 404, 'Production demo inaccessible');
  const { appendFile } = await import('node:fs/promises');
  await appendFile('artifacts/verification.txt', `\n${output}\nPASS production demo URL returns 404\n`);
} finally { await production[Symbol.asyncDispose](); }
