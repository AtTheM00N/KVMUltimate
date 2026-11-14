// Shared poster art for the WebGL deck and static mobile cards.
import palette from 'grail/konnect-palette.js';

const content=window.konnectContent||{};
export const GAME_CARDS=[
 {id:1,hero:'knight',role:'Social',title:['Social',''],body:'Social strategy and content with a point of view.'},
 {id:2,hero:'mage',role:'Search',title:['Search',''],body:'Help the right people find your brand.'},
 {id:3,hero:'ranger',role:'Design',title:['Design',''],body:'Identities and visual worlds built around your brand.'},
 {id:4,hero:'bard',role:'Campaigns',title:['Campaigns',''],body:'Campaigns that invite a conversation.'},
 {id:5,hero:'paladin',role:'Process',title:['Process',''],body:content.process?.heading||'Understand. Create. Connect.'},
 {id:6,hero:'rogue',role:'Studio',title:['Studio',''],body:content.studio?.copy||'Different skills. One studio.'}
].map(d=>({...d,ink:palette.black,accent:palette.white,crop:[0,0,1024,1024]}));
let images;
export function loadGameHeroes(progress){
 images ||= Promise.all(GAME_CARDS.map(d=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=window.__grailAsset('/heroes/'+d.hero+'.webp')})));
 return images.then(list=>{list.forEach(()=>progress?.());return list});
}
function setup(canvas, color, border = palette.graphite) {
  canvas.width = 690;
  canvas.height = 980;
  const context = canvas.getContext('2d');
  context.scale(2, 2);
  context.fillStyle = color;
  context.beginPath();
  context.roundRect(0, 0, 345, 490, 14);
  context.fill();
  context.strokeStyle = border;
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(12, 12, 321, 466, 8);
  context.stroke();
  return context;
}

export function drawGameCardFront(canvas, card, heroes) {
  const study = GAME_CARDS[((card.id || 1) - 1) % GAME_CARDS.length];
  const context = setup(canvas, palette.black);
  context.drawImage(heroes[study.id - 1], 22, 94, 301, 301);
}

export function drawGameCardBack(canvas) {
  const context = setup(canvas, palette.deepRed, palette.scarlet);
  context.save();
  context.translate(88, 135);
  context.scale(.225, .225);
  context.translate(-130.2, -20);
  context.fillStyle = palette.white;
  context.fill(new Path2D('M309.40 20L309.40 1000L130.20 1000L130.20 20ZM676.20 20L873.60 20L365.40 692L365.40 423.20ZM883.40 1000L662.20 1000L434 689.20L544.60 533.80Z'));
  context.restore();
}
