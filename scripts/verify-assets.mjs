import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import validator from 'gltf-validator';
import sharp from 'sharp';
const base = 'wp-content/themes/konnect/assets';
const report = [];
const pass = message => { report.push(`PASS ${message}`); console.log(report.at(-1)); };
const manifest = JSON.parse(await readFile(`${base}/studio/manifest.json`, 'utf8'));
for (const file of manifest.files) {
  const bytes = await readFile(`${base}/studio/${file.file}`);
  assert.equal(bytes.length, file.bytes); assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
  if (file.file.endsWith('.webp')) { const meta = await sharp(bytes).metadata(); assert.ok(meta.width >= 800 && meta.height >= 800); }
}
assert.ok(manifest.sceneBytes <= 4 * 1024 ** 2 && manifest.totalBytes <= 10 * 1024 ** 2);
pass(`Asset integrity, poster dimensions and size budgets (${manifest.sceneBytes} byte scene)`);
const glb = new Uint8Array(await readFile(`${base}/studio/studio.glb`));
const validation = await validator.validateBytes(glb, { maxIssues: 100 });
// The validator cannot decode EXT_meshopt; separately decode below using the reference decoder.
assert.equal(validation.issues.numErrors, 0, JSON.stringify(validation.issues.messages));
pass('glTF container validates without errors');
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const scene = await io.read(`${base}/studio/studio.glb`);
const nodes = scene.getRoot().listNodes();
for (const name of ['CoverHinge','Portfolio','ProjectSurface1','ProjectSurface2','ProjectInk1','ProjectInk2','StudioDesk']) assert.ok(nodes.some(node => node.getName() === name), `Named scene part ${name}`);
assert.ok(scene.getRoot().listTextures().length > 0 && scene.getRoot().listTextures().every(texture => texture.getMimeType() === 'image/ktx2'));
pass('Meshopt geometry decodes, named interaction parts survive, textures use KTX2');
const shots = JSON.parse(await readFile(`${base}/studio/shots.json`, 'utf8'));
assert.equal(shots.length, 9);
for (const shot of shots) assert.ok([...shot.position, ...shot.target, shot.cover].every(Number.isFinite));
assert.equal(shots[0].cover, 0); assert.equal(shots.find(s => s.id === 'work').cover, -110);
pass('Camera positions and reversible portfolio hinge poses');
const theme = JSON.parse(await readFile('wp-content/themes/konnect/theme.json', 'utf8'));
assert.deepEqual(theme.settings.typography.fontFamilies.map(f => f.name), ['Unbounded','Manrope']);
for (const name of ['unbounded', 'manrope']) assert.ok((await readFile(`${base}/fonts/${name}.woff2`)).length > 10000);
pass('Self-hosted font files and Gutenberg typography agree');
const build = JSON.parse(await readFile(`${base}/dist/.vite/manifest.json`, 'utf8'));
const main = build['src/main.js'];
assert.ok(main.dynamicImports.includes('src/studio.js'));
const bytes = await readFile(`${base}/dist/${main.file}`);
assert.ok(gzipSync(bytes).length < 70000, 'Base motion script budget');
pass(`3D bundle is a dynamic import; base motion ${gzipSync(bytes).length} bytes gzip`);
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/asset-verification.txt', report.join('\n') + '\n' + JSON.stringify({ validator: validation.issues }, null, 2));
