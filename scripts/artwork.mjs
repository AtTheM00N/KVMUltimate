import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import opentype from 'opentype.js';
import sharp from 'sharp';

// Original flat typographic artwork. Outlined type renders consistently without
// installing a system font. These are Konnect studies, never client evidence.
const fontBytes = await readFile('design-source/fonts/BespokeStencil.ttf');
const font = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength));
const source = 'design-source/artwork';
const output = 'wp-content/themes/konnect/assets/studio';
await mkdir(source, { recursive: true });
const ink = '#0b0b0d', red = '#e9101b', grey = '#d6d6d8', graphite = '#242429';
const rect = (x,y,w,h,fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
function word(value, x, baseline, width, fill, rotation = 0) {
  const size = width / font.getAdvanceWidth(value, 1);
  const path = font.getPath(value, x, baseline, size).toPathData(2);
  return `<path d="${path}" fill="${fill}"${rotation ? ` transform="rotate(${rotation} ${x} ${baseline})"` : ''}/>`;
}
const compositions = {
  intro: rect(0,0,1920,1200,ink) + word('K',620,1450,1250,graphite) + rect(-80,840,2200,210,red),
  work: rect(0,0,1920,1200,red) + word('MAKE',90,530,1640,ink) + word('A MARK',90,1070,1750,grey),
  social: rect(0,0,1920,1200,grey) + rect(1070,0,850,1200,red) + word('GOOD',80,510,1730,ink) + word('COMPANY',80,1010,1730,ink),
  identity: rect(0,0,1920,1200,ink) + word('K',170,1450,1360,red) + word('K',690,1010,760,grey),
  search: rect(0,0,1920,1200,graphite) + word('BE',90,520,740,grey) + word('FOUND.',80,1080,1780,red),
  lead: rect(0,0,1920,1200,red) + word('LET’S',95,530,1650,grey) + word('TALK.',90,1090,1660,ink),
  process: rect(0,0,1920,1200,grey) + word('KONNECT',-220,750,2360,ink,-12) + rect(0,1000,1920,200,red),
  studio: rect(0,0,1920,1200,ink) + word('ONE',90,540,1300,red) + word('STUDIO.',90,1100,1740,grey),
  contact: rect(0,0,1920,1200,red) + word('HELLO.',-160,850,2280,ink),
};
const wrap = (content, portrait = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${portrait ? 960 : 1920}" height="1200" viewBox="${portrait ? '480 0 960 1200' : '0 0 1920 1200'}">${content}</svg>`;
const files=[];
async function record(file, bytes) {
  await writeFile(`${output}/${file}`,bytes);
  files.push({file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
for (const [name, content] of Object.entries(compositions)) {
  for (const portrait of [false,...(['intro','work','process','studio','contact'].includes(name) ? [true] : [])]) {
    const filename=name+(portrait ? '-mobile' : '');
    const svg=wrap(content,portrait);
    await writeFile(`${source}/${filename}.svg`,svg);
    await record(`${filename}.webp`,await sharp(Buffer.from(svg)).webp({quality:90,effort:5}).toBuffer());
  }
}
const glyph=font.getPath('K',0,1000,1400).getBoundingBox();
const mark=`<svg xmlns="http://www.w3.org/2000/svg" fill="#242429" viewBox="${glyph.x1} ${glyph.y1} ${glyph.x2-glyph.x1} ${glyph.y2-glyph.y1}">${font.getPath('K',0,1000,1400).toSVG(2).replace('fill="black"','fill="#242429"')}</svg>`;
await record('mark.svg',Buffer.from(mark));
await writeFile(`${source}/mark.svg`,mark);
await writeFile(`${output}/manifest.json`,JSON.stringify({version:4,kind:'2d-artwork',totalBytes:files.reduce((sum,f)=>sum+f.bytes,0),files},null,2));
console.log(`Created ${files.length} flat artwork assets (${files.reduce((sum,f)=>sum+f.bytes,0)} bytes).`);
