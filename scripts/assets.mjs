import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import palette from '../design-source/palette.json' with { type: 'json' };
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
for (const name of ['page-transitions.css', 'page-transitions.js']) await copyFile(`src/${name}`, `${root}/${name}`);

for (const name of ['clash-grotesk','general-sans']) await copyFile(`design-source/fonts/${name}.woff2`,`${root}/fonts/${name}.woff2`);

await copyFile('src/brutalist-pointer.js',`${root}/brutalist-pointer.js`);
await copyFile('src/brutalist-pointer.css',`${root}/brutalist-pointer.css`);
await writeFile(`${root}/palette.css`, `:root {
  --kvm-black: ${palette.black};
  --kvm-white: ${palette.white};
  --kvm-soft-grey: ${palette.softGrey};
  --kvm-graphite: ${palette.graphite};
  --kvm-dark-graphite: ${palette.darkGraphite};
  --kvm-scarlet: ${palette.scarlet};
  --kvm-action-red: ${palette.actionRed};
  --kvm-deep-red: ${palette.deepRed};
}
`);
