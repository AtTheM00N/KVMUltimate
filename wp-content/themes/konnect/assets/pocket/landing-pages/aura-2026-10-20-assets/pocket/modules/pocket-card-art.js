// Shared square symbols for the WebGL deck and static mobile cards.
const content=window.konnectContent||{};
export const GAME_CARDS=[
 {id:1,hero:'knight',role:'Social',title:['Social',''],body:'Social strategy and content with a point of view.'},
 {id:2,hero:'mage',role:'Search',title:['Search',''],body:'Help the right people find your brand.'},
 {id:3,hero:'ranger',role:'Design',title:['Design',''],body:'Identities and visual worlds built around your brand.'},
 {id:4,hero:'bard',role:'Campaigns',title:['Campaigns',''],body:'Campaigns that invite a conversation.'},
 {id:5,hero:'paladin',role:'Process',title:['Process',''],body:content.process?.heading||'Understand. Create. Connect.'},
 {id:6,hero:'rogue',role:'Studio',title:['Studio',''],body:content.studio?.copy||'Different skills. One studio.'}
].map(d=>({...d,ink:'#000000',accent:'#f7f7f2',crop:[0,0,1024,1024]}));
let images;
export function loadGameHeroes(progress){
 images ||= Promise.all(GAME_CARDS.map(d=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=window.__grailAsset('/heroes/'+d.hero+'.webp')})));
 return images.then(list=>{list.forEach(()=>progress?.());return list});
}
function setup(canvas,color){canvas.width=690;canvas.height=980;const c=canvas.getContext('2d');c.scale(2,2);c.clearRect(0,0,345,490);c.fillStyle=color;c.beginPath();c.roundRect(0,0,345,490,14);c.fill();c.strokeStyle='#666370';c.lineWidth=1;c.beginPath();c.roundRect(12,12,321,466,8);c.stroke();return c}
export function drawGameCardFront(canvas,q,heroes){const d=GAME_CARDS[((q.id||1)-1)%6],c=setup(canvas,'#000000');c.drawImage(heroes[d.id-1],22,94,301,301)}
export function drawGameCardBack(canvas,q){const c=setup(canvas,'#8f0000');c.strokeStyle='#f7f7f2';c.lineWidth=8;c.beginPath();c.moveTo(83,155);c.lineTo(262,335);c.moveTo(262,155);c.lineTo(83,335);c.moveTo(83,245);c.lineTo(262,245);c.stroke();c.fillStyle='#8f0000';c.beginPath();c.arc(172.5,245,12,0,Math.PI*2);c.fill()}
