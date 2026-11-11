import { mkdir, copyFile } from 'node:fs/promises';
const root = 'wp-content/themes/konnect/assets';
await mkdir(`${root}/vendor`, { recursive: true });
await mkdir(`${root}/fonts`, { recursive: true });
for (const file of ['gsap.min.js', 'ScrollTrigger.min.js']) await copyFile(`node_modules/gsap/dist/${file}`, `${root}/vendor/${file}`);
for (const name of ['inter', 'montserrat']) await copyFile(`node_modules/@fontsource-variable/${name}/files/${name}-latin-wght-normal.woff2`, `${root}/fonts/${name}.woff2`);
console.log('Local font and motion assets prepared.');
