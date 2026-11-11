import { mkdir, copyFile } from 'node:fs/promises';
const root = 'wp-content/themes/konnect/assets';
await mkdir(`${root}/vendor`, { recursive: true });
await mkdir(`${root}/fonts`, { recursive: true });
await mkdir('design-source/fonts', { recursive: true });
for (const name of ['unbounded', 'manrope']) {
  await copyFile(`node_modules/@fontsource-variable/${name}/files/${name}-latin-wght-normal.woff2`, `${root}/fonts/${name}.woff2`);
  await copyFile(`node_modules/@fontsource-variable/${name}/LICENSE`, `${root}/licenses/${name}-OFL.txt`);
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  await copyFile(`${root}/fonts/${name}.woff2`, `design-source/fonts/${title}.woff2`);
  await copyFile(`node_modules/@fontsource-variable/${name}/LICENSE`, `design-source/fonts/${title}-OFL.txt`);
}
await mkdir(`${root}/vendor/basis`, { recursive: true });
for (const file of ['basis_transcoder.js', 'basis_transcoder.wasm']) await copyFile(`node_modules/three/examples/jsm/libs/basis/${file}`, `${root}/vendor/basis/${file}`);
await copyFile('node_modules/three/LICENSE', `${root}/licenses/Three-LICENSE.txt`);
await copyFile('node_modules/meshoptimizer/LICENSE.md', `${root}/licenses/Meshoptimizer-LICENSE.md`);
await copyFile('node_modules/three/examples/jsm/libs/basis/README.md', `${root}/licenses/Basis-README.md`);
console.log('Local font and motion assets prepared.');
