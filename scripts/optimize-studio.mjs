import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRTextureBasisu } from '@gltf-transform/extensions';
import { dedup, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import { readFile, writeFile, readdir, mkdir, stat, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

const root = 'wp-content/themes/konnect/assets/studio';
const scratch = '.tools/texture-work';
await mkdir(scratch, { recursive: true });
const platform = `${process.platform}-${process.arch}`;
const binary = path.resolve(`node_modules/@gpu-tex-enc/basis/bin/${platform}/basisu${process.platform === 'win32' ? '.exe' : ''}`);
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const document = await io.read('design-source/studio-source.glb');
let index = 0;
for (const texture of document.getRoot().listTextures()) {
  const input = path.resolve(scratch, `texture-${index}.png`);
  const output = path.resolve(scratch, `texture-${index}.ktx2`);
  await sharp(Buffer.from(texture.getImage())).resize({ width: 1024, height: 1024, fit: 'inside' }).png().toFile(input);
  execFileSync(binary, ['-file', input, '-output_file', output, '-ktx2', '-mipmap', '-q', '200', '-comp_level', '2'], { windowsHide: true, stdio: 'pipe' });
  texture.setImage(new Uint8Array(await readFile(output))).setMimeType('image/ktx2').setURI(`desk-${index}.ktx2`);
  index++;
}
if (index) document.createExtension(KHRTextureBasisu).setRequired(true);
await document.transform(dedup(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(`${root}/studio.glb`, document);
for (const file of await readdir('design-source/renders')) {
  if (!file.endsWith('.png')) continue;
  await sharp(`design-source/renders/${file}`).webp({ quality: 82, effort: 5 }).toFile(`${root}/${file.replace('.png', '.webp')}`);
}
const files = [];
for (const file of await readdir(root)) {
  if (!/\.(webp|json|glb)$/.test(file) || file === 'manifest.json' || file === 'studio-source.glb') continue;
  const bytes = await readFile(`${root}/${file}`);
  files.push({ file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
const sceneBytes = (await stat(`${root}/studio.glb`)).size;
if (sceneBytes > 4 * 1024 * 1024) throw new Error('Scene exceeds 4MB budget');
const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
if (totalBytes > 10 * 1024 * 1024) throw new Error('Studio assets exceed 10MB budget');
await writeFile(`${root}/manifest.json`, JSON.stringify({ version: 2, sceneBytes, totalBytes, files }, null, 2));
console.log(`Studio ready: ${(sceneBytes / 1024).toFixed(0)} KB GLB; ${(totalBytes / 1024 / 1024).toFixed(2)} MB with posters.`);
