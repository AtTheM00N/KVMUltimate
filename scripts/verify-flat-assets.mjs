import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import sharp from 'sharp';
const base='wp-content/themes/konnect/assets';
const report=[];
const pass=message=>{report.push(`PASS ${message}`);console.log(report.at(-1));};
const manifest=JSON.parse(await readFile(`${base}/studio/manifest.json`,'utf8'));
assert.equal(manifest.kind,'2d-artwork'); assert.equal(manifest.files.length,15);
for(const file of manifest.files){
  const bytes=await readFile(`${base}/studio/${file.file}`);
  assert.equal(bytes.length,file.bytes); assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);
  if(file.file.endsWith('.webp')){const meta=await sharp(bytes).metadata();assert.ok(meta.width>=960 && meta.height>=1200);}
  if(file.file.endsWith('.svg'))assert.ok(!/<script|onload=|https?:\/\//.test(bytes.toString().replace('http://www.w3.org/2000/svg','')));
}
assert.ok(manifest.totalBytes<500000);
pass(`2D artwork hashes, dimensions and budget (${manifest.totalBytes} bytes)`);
const theme=JSON.parse(await readFile('wp-content/themes/konnect/theme.json','utf8'));
assert.deepEqual(theme.settings.typography.fontFamilies.map(font=>font.name),['Bespoke Stencil','Manrope']);
for(const name of ['bespoke-stencil','manrope'])assert.ok((await readFile(`${base}/fonts/${name}.woff2`)).length>10000);
pass('Self-hosted fonts and Gutenberg typography agree');
const build=JSON.parse(await readFile(`${base}/dist/.vite/manifest.json`,'utf8'));
assert.ok(build['src/main.js'].dynamicImports.includes('src/scroll.js'));
assert.equal(Object.keys(build).length,2);
let total=0;
for(const entry of Object.values(build)){
 const bytes=await readFile(`${base}/dist/${entry.file}`); total+=gzipSync(bytes).length;
 assert.ok(!/WebGLRenderer|GLTFLoader|KTX2Loader|three\/addons|studio\.glb|\.wasm/.test(bytes.toString()));
}
assert.ok(total<55000);
assert.ok(!(await readdir(`${base}/studio`)).some(name=>/\.glb$|\.ktx2$|shots\.json/.test(name)));
pass(`2D-only build: no WebGL, model or decoder; ${total} bytes combined gzip`);
await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/asset-verification.txt',report.join('\n')+'\n');
