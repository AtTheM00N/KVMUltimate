import { mkdir, access, copyFile, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
await mkdir('artifacts', { recursive: true });
await mkdir('docs/evidence', { recursive: true });
for (const [report, marker] of [
  ['verification.txt', 'PASS production demo URL returns 404'],
  ['asset-verification.txt', 'PASS Supporting Vite bundle'],
  ['lifecycle-verification.txt', 'PASS 2D cleanup restores author styles'],
]) {
  assert.ok((await readFile(`artifacts/${report}`, 'utf8')).includes(marker), `Run verification before packaging: ${report}`);
  await copyFile(`artifacts/${report}`, `docs/evidence/${report}`);
}
await access('wp-content/themes/konnect/assets/dist/.vite/manifest.json');
await access('wp-content/themes/konnect/assets/studio/manifest.json');
for (const [source, output] of [
  ['wp-content/themes/konnect', 'artifacts/konnect-theme.zip'],
  ['wp-content/plugins/konnect-site', 'artifacts/konnect-site-plugin.zip']
]) {
  const split = source.lastIndexOf('/');
  execFileSync('tar', ['-a', '-c', '--exclude=*.glb', '--exclude=shots.json', '--exclude=desk-light.png', '--exclude=vendor', '--exclude=experience.css', '-f', output, '-C', source.slice(0, split), source.slice(split + 1)], { stdio: 'inherit', windowsHide: true });
}
execFileSync('tar', ['-a', '-c', '-f', 'artifacts/konnect-studio-source.zip', '--exclude=design-source/renders', '--exclude=*.blend1', 'design-source', 'src', 'wp-content', 'vite.config.js', 'scripts', 'docs', 'README.md', '.gitignore', '.gitattributes', 'package.json', 'package-lock.json'], { stdio: 'inherit', windowsHide: true });
console.log('Theme, plugin and editable studio source ZIPs created in artifacts/.');
const packages = [];
for (const [file, required] of [
  ['konnect-theme.zip', ['konnect/style.css', 'konnect/theme.json', 'konnect/assets/studio/manifest.json', 'konnect/assets/dist/.vite/manifest.json']],
  ['konnect-site-plugin.zip', ['konnect-site/konnect-site.php', 'konnect-site/includes/studio.php', 'konnect-site/studio-editor.js']],
  ['konnect-studio-source.zip', ['design-source/konnect-studio.blend', 'design-source/build_studio.py', 'design-source/detail_studio.py', 'src/studio.js', 'scripts/verify-lifecycle.mjs', 'docs/evidence/verification.txt', 'package-lock.json']]
]) {
  const entries = execFileSync('tar', ['-tf', `artifacts/${file}`], { encoding: 'utf8', windowsHide: true }).trim().split(/\r?\n/).map(entry => entry.replaceAll('\\', '/'));
  for (const entry of required) assert.ok(entries.includes(entry), `${file} missing ${entry}`);
  if (file === 'konnect-theme.zip') assert.ok(!entries.some(entry => /\.glb$|\/shots\.json$|\/vendor\//.test(entry)), 'Installable theme contains legacy 3D assets');
  assert.ok(!entries.some(entry => /(^|\/)(\.local|\.backups|\.tools|node_modules|\.git)(\/|$)|\.blend1$|^design-source\/renders\//.test(entry)), `${file} contains private or build-only files`);
  const bytes = await readFile(`artifacts/${file}`);
  packages.push({ file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), entries: entries.length });
  console.log(`PASS ${file}: required files present, private data excluded (${bytes.length} bytes)`);
}
await writeFile('artifacts/package-manifest.json', JSON.stringify({ packages }, null, 2) + '\n');
