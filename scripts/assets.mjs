import { mkdir, copyFile } from 'node:fs/promises';
const root = 'wp-content/themes/konnect/assets';
await mkdir(`${root}/vendor`, { recursive: true });
await mkdir(`${root}/fonts`, { recursive: true });
await mkdir('design-source/fonts', { recursive: true });
for (const name of ['manrope']) {
  await copyFile(`node_modules/@fontsource-variable/${name}/files/${name}-latin-wght-normal.woff2`, `${root}/fonts/${name}.woff2`);
  await copyFile(`node_modules/@fontsource-variable/${name}/LICENSE`, `${root}/licenses/${name}-OFL.txt`);
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  await copyFile(`${root}/fonts/${name}.woff2`, `design-source/fonts/${title}.woff2`);
  await copyFile(`node_modules/@fontsource-variable/${name}/LICENSE`, `design-source/fonts/${title}-OFL.txt`);
}
console.log('Local font and motion assets prepared.');

for (const name of ['clash-grotesk','general-sans']) await copyFile(`design-source/fonts/${name}.woff2`,`${root}/fonts/${name}.woff2`);
