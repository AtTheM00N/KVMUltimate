// Shared artwork for the floating WebGL deck and the mobile fallback.
export const GAME_CARDS = [
  {id:1,hero:'knight',role:'THE KNIGHT',title:["KNIGHT’S",'GAMBIT'],body:'Remember your heroes. Find all six pairs.',ink:'#254c47',accent:'#a9cbb7',crop:[0,0,1024,1536]},
  {id:2,hero:'mage',role:'THE MAGE',title:['ARCANE','RECALL'],body:'A quick look. A little magic. Trust your memory.',ink:'#50436b',accent:'#c7b2df',crop:[0,0,1024,1536]},
  {id:3,hero:'ranger',role:'THE RANGER',title:['SHADOW','MATCH'],body:'Two cards. One perfect match. Keep your eyes sharp.',ink:'#724433',accent:'#e3ac8e',crop:[0,0,1024,1536]},
  {id:4,hero:'bard',role:'THE BARD',title:["BARD’S",'ENCORE'],body:'Every pair sets the rhythm. Keep the combo going.',ink:'#73572f',accent:'#e0c577',crop:[0,0,1024,1536]},
  {id:5,hero:'paladin',role:'THE PALADIN',title:['ROYAL','RECALL'],body:'Keep your focus. Turn a good round into a great one.',ink:'#314d6b',accent:'#adc7df',crop:[0,0,1024,1536]},
  {id:6,hero:'rogue',role:'THE ROGUE',title:['PERFECT','HEIST'],body:'Take a peek. Remember the board. Steal a new best.',ink:'#683e50',accent:'#d6acba',crop:[0,0,1024,1536]}
];
const W=345,H=490,SCALE=2;
const sans='Switzer, Arial, sans-serif';
const cardFor=q=>GAME_CARDS[((q.id||1)-1)%GAME_CARDS.length];
let heroPromise;
export function loadGameHeroes(progress){
  if(!heroPromise)heroPromise=Promise.all(GAME_CARDS.map(c=>new Promise((resolve,reject)=>{
    const im=Object.assign(new Image(),{crossOrigin:"anonymous"});im.onload=()=>resolve(im);im.onerror=reject;
    im.src=window.__grailAsset('/heroes/'+c.hero+'.webp');
  })));
  return heroPromise.then(images=>{images.forEach(()=>progress?.());return images;});
}
function rounded(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
function star(c,x,y,r,color){c.save();c.translate(x,y);c.beginPath();c.moveTo(0,-r);c.lineTo(r*.24,-r*.24);c.lineTo(r,0);c.lineTo(r*.24,r*.24);c.lineTo(0,r);c.lineTo(-r*.24,r*.24);c.lineTo(-r,0);c.lineTo(-r*.24,-r*.24);c.closePath();c.fillStyle=color;c.fill();c.restore();}
function type(c,text,x,y,size,weight,color,align='left'){c.font=weight+' '+size+'px '+sans;c.textAlign=align;c.fillStyle=color;c.fillText(text,x,y);}
function wrap(c,text,x,y,width,lineHeight){let line='';for(const word of text.split(' ')){const next=line?line+' '+word:word;if(c.measureText(next).width>width&&line){c.fillText(line,x,y);line=word;y+=lineHeight;}else line=next;}if(line)c.fillText(line,x,y);}
function setup(canvas,fill){canvas.width=W*SCALE;canvas.height=H*SCALE;const c=canvas.getContext('2d');c.scale(SCALE,SCALE);c.clearRect(0,0,W,H);c.save();rounded(c,0,0,W,H,19);c.clip();c.fillStyle=fill;c.fillRect(0,0,W,H);return c;}
function frame(c,color){c.lineWidth=1;rounded(c,9,9,W-18,H-18,12,null,color);}
export function drawGameCardFront(canvas,q,heroes){
  const d=cardFor(q),c=setup(canvas,'#f3eee4');
  frame(c,d.ink+'55');
  star(c,26,28,8,d.ink);type(c,'POCKET QUEST',42,32,10,650,d.ink);
  type(c,String(d.id).padStart(2,'0')+' / 06',W-24,32,10,550,d.ink,'right');
  c.save();c.beginPath();c.rect(16,45,W-32,258);c.clip();
  // A printed arch, orbital lines and a soft grounding shadow frame the hero.
  c.fillStyle=d.accent;c.beginPath();c.roundRect(61,115,223,191,[111,111,0,0]);c.fill();
  c.lineWidth=.65;c.strokeStyle=d.ink+'40';
  for(const radius of [73,88,103]){c.beginPath();c.arc(W/2,212,radius,Math.PI,Math.PI*2);c.stroke();}
  c.save();c.translate(W/2,287);c.scale(1,.17);const shadow=c.createRadialGradient(0,0,0,0,0,84);shadow.addColorStop(0,d.ink+'66');shadow.addColorStop(1,d.ink+'00');c.fillStyle=shadow;c.beginPath();c.arc(0,0,84,0,Math.PI*2);c.fill();c.restore();
  const im=heroes[(d.id-1)%heroes.length],box=d.crop,scale=Math.min(225/box[2],(d.id===5?184:201)/box[3]),iw=box[2]*scale,ih=box[3]*scale;
  c.drawImage(im,...box,(W-iw)/2,298-ih,iw,ih);
  star(c,38,181,8,d.ink);star(c,309,251,6,d.ink);star(c,295,158,4,d.ink);
  c.restore();
  type(c,d.title[0],24,72,31,750,d.ink);type(c,d.title[1],24,103,31,750,d.ink);
  rounded(c,23,278,84,22,11,'#f3eee4',d.ink+'33');type(c,d.role,65,293,8,650,d.ink,'center');
  type(c,'01 / RELIC RUSH',24,325,9,650,d.ink);
  c.font='450 13px '+sans;c.fillStyle='#534f48';c.textAlign='left';wrap(c,d.body,24,347,W-48,17);
  c.strokeStyle=d.ink+'33';c.beginPath();c.moveTo(24,381);c.lineTo(W-24,381);c.stroke();
  const stats=[['TIME','30s'],['PAIRS','06'],['COMBO','×3']];
  stats.forEach(([label,value],i)=>{const x=24+i*104;type(c,label,x,400,9,550,d.ink);type(c,value,x,427,25,650,d.ink);if(i<2){c.strokeStyle=d.ink+'22';c.beginPath();c.moveTo(x+84,394);c.lineTo(x+84,430);c.stroke();}});
  c.fillStyle=d.ink;c.fillRect(0,447,W,43);type(c,'A LITTLE MATCH. A LITTLE MAGIC.',24,473,10,550,'#f3eee4');star(c,W-26,468,8,d.accent);
  c.restore();
}
export function drawGameCardBack(canvas,q){
  const d=cardFor(q),c=setup(canvas,['#497568','#7d6598','#ab7357','#ad8c47','#577ea0','#aa748b'][d.id-1]);
  frame(c,d.accent+'bb');rounded(c,18,18,W-36,H-36,8,null,d.accent+'55');
  c.save();c.translate(W/2,H/2);c.strokeStyle=d.accent+'50';c.lineWidth=1;
  for(const r of [75,92,109,130]){c.beginPath();c.ellipse(0,0,r,r*1.35,0,0,Math.PI*2);c.stroke();}
  c.beginPath();c.moveTo(0,-203);c.lineTo(143,0);c.lineTo(0,203);c.lineTo(-143,0);c.closePath();c.stroke();
  c.fillStyle=['#497568','#7d6598','#ab7357','#ad8c47','#577ea0','#aa748b'][d.id-1];c.fillRect(-108,-46,216,92);star(c,0,-76,30,d.accent);
  type(c,'POCKET',0,-5,29,650,'#f3eee4','center');type(c,'QUEST',0,27,29,650,'#f3eee4','center');
  star(c,0,81,9,d.accent);c.restore();
  [[33,35],[312,35],[33,455],[312,455]].forEach(([x,y])=>star(c,x,y,7,d.accent));
  type(c,'FLIP. MATCH. REPEAT.',W/2,438,9,550,d.accent,'center');c.restore();
}
