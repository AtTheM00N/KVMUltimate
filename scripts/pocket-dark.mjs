import {readFileSync} from 'node:fs';
// Source adaptation is applied after the registered source has been verified.
export function darkModule(code,file){
 if(file.endsWith('/device-DfrJF2Wj.js')){
  const boundary='function t(){return typeof location';
  if(!code.includes(boundary))throw Error('Responsive device source boundary changed');
  code=code.replace(boundary,'function t(){if(typeof window<`u`&&window.innerWidth<=768)return!0;return typeof location');
 }
 if(/HomePage-|totems-|pocket-content|pocket-loader/.test(file))code=code.replace(/#[0-9a-fA-F]{3,8}\b/g,mapColor);
 if(file.endsWith('/totems-6Ag_iF3F.js')){code=code.replace('vec3(0.006, 0.006, 0.008)','vec3(0.0, 0.0, 0.0)').replace('vec3(0.085, 0.062, 0.028)','vec3(0.12, 0.0, 0.0)').replace('vec3(0.015, 0.020, 0.040)','vec3(0.0, 0.0, 0.0)').replace('vec3(0.20, 0.135, 0.06)','vec3(0.3, 0.0, 0.0)');}
 if(file.endsWith('/HomePage-SelUD7Yz.js')){
  code=code.replace(/it=T\(`#[a-f0-9]+`\),at=T\(`#[a-f0-9]+`\),ot=T\(`#[a-f0-9]+`\)/,'it=T(`#000000`),at=T(`#8f0000`),ot=T(`#8f0000`)');
  code="import {KonnectSlideshow,KonnectConnection} from 'grail/konnect-slides.js';\n"+code;
  // The reveal settles into blood red; collapse reverses it before the deck.
  code=code.replace('let t=lt(.5,.96,e);n.draw','let t=0;n.draw');
  if(!code.includes('(0,W.jsx)(Tt,{embedded:!0})'))throw Error('Slideshow source boundary changed');
  code=code.replace('(0,W.jsx)(Tt,{embedded:!0})','(0,W.jsx)(KonnectSlideshow,{})');
  // Retain the authored reveal variable, replace the timer digits with a connection graphic.
  const a=code.indexOf('(0,W.jsx)(`div`,{className:Q.clock,');
  const b=code.indexOf('(0,W.jsx)(`img`,{className:Q.phone',a);
  if(a<0||b<0)throw Error('Connection source boundary changed');
  code=code.slice(0,a)+'(0,W.jsx)(`div`,{className:Q.clock,style:{visibility:V?`visible`:`hidden`},children:(0,W.jsx)(KonnectConnection,{})}),'+code.slice(b);
 }
 if(file.endsWith('/pocket-content.js')){
  code="import {KonnectAtmosphere} from 'grail/konnect-slides.js';\n"+code;
  const feature="className:'_voice_bknov_3 pq-feature',children:[";
  if(!code.includes(feature))throw Error('ThreeUI feature boundary changed');
  code=code.replace(feature,feature+"h(KonnectAtmosphere,{}),");
  code=code.replace("className:'pq-preview-grid','aria-hidden':true","className:'pq-preview-grid','aria-label':'Interactive Konnect studies'");
  code=code.replace("h('div',{className:'pq-preview-card '","h('button',{type:'button','aria-label':'Turn Konnect study '+(i+1),'aria-pressed':false,onClick:e=>{const b=e.currentTarget;b.classList.toggle('is-turned');b.setAttribute('aria-pressed',String(b.classList.contains('is-turned')))},className:'pq-preview-card '");
 }
 return code;
}
const brand=JSON.parse(readFileSync('design-source/palette.json','utf8'));
const palette=[brand.bloodRed,brand.dimGrey,brand.black,brand.porcelain,brand.platinum].map(c=>c.toLowerCase());
export function mapColor(hex){
 if(palette.includes(hex.toLowerCase()))return hex;
 const raw=hex.slice(1);if(![3,4,6,8].includes(raw.length))return hex;
 const h=raw.length<5?raw.split('').map(c=>c+c).join(''):raw;
 const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));
 const light=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
 if(rgb[0]>rgb[1]*1.35&&rgb[0]>rgb[2]*1.2)return palette[0]+h.slice(6);
 return (light>220?palette[3]:light>150?palette[4]:light>65?palette[1]:palette[2])+h.slice(6);
}
export function darkPack(pack){
 pack.css=pack.css.replace(/#[0-9a-fA-F]{3,8}\b/g,mapColor).replace(/\bwhite\b/g,'#f7f7f2').replace(/\bblack\b/g,'#000000');
 pack.assets['/accept-phone.webp']='/wp-content/themes/konnect/assets/pocket/konnect-phone.svg';
 pack.assets['/grail-mark.svg']='/wp-content/themes/konnect/assets/studio/mark.svg';
 pack.modules['grail/konnect-slides.js']='/wp-content/themes/konnect/assets/pocket/konnect-slides.js';
 return pack;
}
