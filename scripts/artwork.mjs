import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const output='wp-content/themes/konnect/assets/studio',source='design-source/artwork';
await mkdir(source,{recursive:true});
const ink='#242429',red='#e9101b';
const line=d=>`<path d="${d}"/>`,dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="16" fill="${red}" stroke="none"/>`;
const marks={
 social:line('M80 80H256C344 80 344 432 432 432M80 432H256C168 432 168 80 432 80')+dot(80,80)+dot(432,432),
 identity:line('M80 80H288V288H80ZM224 224H432V432H224Z')+dot(256,256),
 search:line('M80 80L176 176V256H256M432 80L336 176V256H256M80 432L176 336V256M432 432L336 336V256')+dot(256,256),
 lead:line('M80 256H224V80H432M224 256H432M224 256V432H432')+dot(432,80)+dot(432,256)+dot(432,432),
 process:line('M80 432V80H256V432H432V80')+dot(80,432)+dot(256,80)+dot(432,432),
 studio:line('M80 80L256 256L432 80M80 256H432M80 432L256 256L432 432')+dot(256,256)
};
const svg=name=>`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 512 512"><g fill="none" stroke="${ink}" stroke-width="24" stroke-linecap="square" stroke-linejoin="miter">${marks[name]}</g></svg>`;
const aliases={intro:'studio',work:'identity',social:'social',identity:'identity',search:'search',lead:'lead',process:'process',studio:'studio',contact:'studio'};
const files=[];
async function record(file,data){await writeFile(`${output}/${file}`,data);files.push({file,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}
for(const [name,symbol] of Object.entries(aliases)){
 const data=svg(symbol);await writeFile(`${source}/${name}.svg`,data);
 const webp=await sharp(Buffer.from(data)).webp({lossless:true}).toBuffer();await record(name+'.webp',webp);
 if(['intro','work','process','studio','contact'].includes(name)){await writeFile(`${source}/${name}-mobile.svg`,data);await record(name+'-mobile.webp',webp)}
}
for(const name of Object.keys(marks))await record(name+'.svg',Buffer.from(svg(name)));
await record('mark.svg',await readFile(`${source}/mark.svg`));
await writeFile(`${output}/manifest.json`,JSON.stringify({version:6,kind:'2d-artwork',symbolCount:6,totalBytes:files.reduce((n,f)=>n+f.bytes,0),files},null,2));
console.log('Six original connection symbols generated on a shared 512-unit grid.');
