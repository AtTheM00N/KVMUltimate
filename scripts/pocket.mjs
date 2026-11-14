import {darkModule,darkPack} from './pocket-dark.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import palette from '../design-source/palette.json' with { type: 'json' };
const bundle=JSON.parse(await fs.readFile('design-source/threeui/source.json','utf8'));
const out='wp-content/themes/konnect/assets/pocket';
await fs.mkdir(out,{recursive:true});
const root='/wp-content/themes/konnect/assets/pocket';
const phoneMenuSource=await fs.readFile('src/pocket-phone-adapted.js','utf8');
const local=s=>s.replaceAll('/landing-pages/',root+'/landing-pages/');
const replacements={
 'Small game. Big adventure.':'Creative direction. Digital presence.',
 'Pocket Quest':'Konnect','POCKET QUEST':'KONNECT','POCKET COMPANION':'KONNECT STUDY',
 'POCKET QUEST · COMING TO iOS\nA little adventure for your iPhone 17.':'KONNECT VISION MEDIA\nCreative direction. Digital presence.',
 'Play the demo':'Start a project','Play the free demo':'Start a project','Try a 30-second round':'Explore our work',
 'A little break.':'A clear idea.','A quick match.':'A bold identity.','A tiny adventure':'A new connection','in your pocket.':'for your brand.',
 'A better little break':'Creative connections','The 30-second challenge':'From idea to identity',
 'Challenge accepted.':'Creative direction.','Thirty seconds.':'Made to connect.',
 'Thirty seconds. Twelve cards. Six perfect pairs. How many can you remember?':'Social, design, search and campaigns. Different skills, one connected studio.',
 'Take a quick look at the board, then trust your memory. Match the heroes to build a combo. Clear every pair before the clock runs out for a time bonus. Miss a match? Shake it off. Your next great round is only one tap away.':'We bring strategy and creative together around your brand. From the first conversation to the final detail, we build a clear direction for your digital presence.',
 'Your coffee is brewing. Your train is two minutes away. There is a little room for adventure. Flip the cards, find the pairs, and keep your streak alive. Pocket Quest turns those spare moments into a small win. Easy to pick up. Delightfully hard to put down.':'Konnect Vision Media is a creative and digital marketing partner for Indian businesses. We connect social media, design, search and campaigns around a clear idea, giving your brand a voice and a consistent digital presence.',
 'Little moments. Big wins.':'Different skills. One studio.',
 'It starts as one':'It starts with an','match.':'idea.','Then comes one more round.':'Then we bring it to life.',
 'A tiny game with a surprisingly big personality.':'A creative and digital partner for your brand.',
 'That first perfect match.':'Social media.','Your just-one-more moment.':'Graphic design.','A streak worth chasing.':'Search strategy.','The hero that feels like you.':'Campaign creative.','A new personal best.':'One connected direction.',
 'Turn over two cards. Find the same hero. That satisfying little click is where the adventure begins.':'Social strategy and content with a point of view.',
 'A fresh shuffle every round. A new chance to remember the board, beat the clock, and surprise yourself.':'Identities and visual worlds built around your brand.',
 'Keep matching without a miss and your combo grows. Steady hands. Sharp memory. A very happy score.':'Search strategy that helps the right people find you.',
 'A brave knight. A curious ranger. A mage with an enormous hat. Six chibi heroes, each with a whole lot of character.':'Paid creative and landing pages that invite a conversation.',
 'Finish with seconds to spare and bank the bonus. Your best score stays on this device, ready for the next challenge.':'Understand. Create. Connect. A shared direction from brief to delivery.',
 'Six heroes.':'Different skills.','One\'s yours.':'One studio.',
 'Choose your tiny champion. Knight, ranger, bard, paladin, mage, or rogue. Big personalities. Small screen.':'Explore the visual language of Konnect. Original illustrative studies, not client commissions.',
 'Meet your heroes':'Explore our studies','Made for your iPhone 17':'Made for your brand',
 'Tiny ':'Clear ','world.':'ideas.','Big':'Bold','wins.':'design.',
 'ONE THUMB. ALL THE FUN.':'ONE IDEA. A CLEAR DIRECTION.',
 'Portrait play, quick rounds, and a cast of tiny champions. An adventure that fits your hand and the little gaps in your day.':'We connect your message, identity and digital presence around a shared creative direction.',
 'GET A TASTE. BEAT YOUR BEST.':'MAKE YOUR NEXT CONNECTION.',
 'Play Relic Rush right here. Flip the cards, match all six heroes, and beat the thirty-second clock. Your next little victory is waiting.':'Tell us what you have in mind. We will help shape the brief and explore how Konnect can support your brand.',
 'YOUR NEXT LITTLE ADVENTURE':'YOUR NEXT CREATIVE CONNECTION','ONE MORE ROUND?':'HAVE SOMETHING IN MIND?',
 'Got thirty':'Let’s make','seconds?':'contact.',
 'Six little heroes. A quick game of memory. One more little victory to take with you.':'Bring us your next idea. Let’s give it a clear creative direction.',
 'Free to play in your browser. No download needed.':'Social · Design · Search · Campaigns',
 '06 HEROES':'KONNECT STUDIES','A WHOLE LOT OF CHARACTER':'ILLUSTRATIVE · NOT CLIENT WORK',
 'Small game. Big adventure.':'Creative direction. Digital presence.',
 'A LITTLE ADVENTURE FOR YOUR IPHONE.':'A CREATIVE AND DIGITAL PARTNER.','Coming to iOS.':'Based in India.',
 'Meet your heroes ↑':'Explore our work',
 'A WORLD IN YOUR POCKET':'A WORLD BUILT AROUND YOUR BRAND',
 'Small screen.':'Clear ideas.','characters.':'connections.',
 'SIX HEROES. ALL PERSONALITY.':'ORIGINAL KONNECT DESIGN STUDIES.',
 'A knight with a brave heart. A mage with a little magic. Meet the tiny legends who make every match a little more magical.':'Explore our original visual studies. These compositions illustrate Konnect’s creative direction and are not client commissions.',
 'Pick the one that feels like you. ↘':'Explore a creative direction.',
 'YOUR CHAMPION':'YOUR DIRECTION','CHOOSE HERO':'EXPLORE STUDY','CHIBI HERO · ':'DESIGN STUDY · ',
 'Six pairs. Your next personal best.':'Original studies. Different points of view.',
 'MORE THAN A LUCKY MATCH':'CREATIVE AND DIGITAL, CONNECTED',
 'Every round.':'Every idea.','A little ':'A new ','magic.':'connection.',
 'TINY HEROES. BIG LITTLE WINS.':'YOUR BRAND. A SHARED DIRECTION.',
 'A flash of memory. A perfect pair. That just-one-more feeling. Meet the little legends who make every round your own.':'Social media, design, search and campaigns. We bring the right disciplines together around your brand.',
 'SIX CHIBI HEROES. ONE LITTLE ADVENTURE.':'DIFFERENT SKILLS. ONE CONNECTED STUDIO.',
 'Flip. Match. Make a little magic.':'Understand. Create. Connect.',
 'Gathering':'Connecting','party.':'ideas.','POCKET':'KONNECT','QUEST':'STUDIO',
 'SMALL GAME. BIG ADVENTURE.':'CREATIVE DIRECTION. DIGITAL PRESENCE.',
 'A LITTLE ADVENTURE IS ON ITS WAY':'A NEW CONNECTION IS ON ITS WAY',
 'Six little heroes. A world of possibility. Your next great match is almost here.':'Creative direction. Digital presence. A world built around your brand.',
 'A brave heart is all you need.':'A clear idea is where we start.',
 'THE ORIGINAL SIX':'ORIGINAL KONNECT STUDIES','EST. 2026':'VISION MEDIA',
 'Your party is ready.':'Your studio is ready.','Preparing your little world…':'Preparing the studio…',
 '06 HEROES · 12 CARDS · 30 SECONDS':'SOCIAL · DESIGN · SEARCH · CAMPAIGNS',
 'Let the little adventure begin.':'Let’s make a connection.','Good things come in small quests.':'Creative ideas, coming together.',
 'Enter the world ↗':'Enter the studio','Continue to the site ↗':'Continue to the site',
 'Lyriath':'Search','Vaelorn':'Social','Thyren':'Design','Orvynn':'Campaigns','Sevran':'Strategy','Nyravel':'Creative',
 'Moonveil Arcanist':'Search strategy','Oathbound Knight':'Social direction','Briar Ranger':'Visual identity','Requiem Bard':'Campaign creative','Dawnward Paladin':'Brand strategy','Veilborne Rogue':'Creative direction',
 'THE KNIGHT':'SOCIAL','THE MAGE':'SEARCH','THE RANGER':'DESIGN','THE BARD':'CAMPAIGNS','THE PALADIN':'STRATEGY','THE ROGUE':'CREATIVE',
 'KNIGHT’S':'SOCIAL','GAMBIT':'DIRECTION','ARCANE':'BE','RECALL':'FOUND','SHADOW':'MAKE A','MATCH':'MARK','BARD’S':'GOOD','ENCORE':'COMPANY','ROYAL':'ONE','PERFECT':'LET’S','HEIST':'TALK',
 'Remember your heroes. Find all six pairs.':'Social strategy and content with a point of view.',
 'A quick look. A little magic. Trust your memory.':'Help the right people find your brand.',
 'Two cards. One perfect match. Keep your eyes sharp.':'Identities and visual worlds built around you.',
 'Every pair sets the rhythm. Keep the combo going.':'Campaigns that invite a conversation.',
 'Keep your focus. Turn a good round into a great one.':'Different skills, one clear direction.',
 'Take a peek. Remember the board. Steal a new best.':'Bring your next idea to Konnect.'
};
replacements['Pocket Quest — Small game. Big adventure.']='Konnect Vision Media — Creative direction. Digital presence.';
Object.assign(replacements,{'01 / RELIC RUSH':'KONNECT DESIGN STUDY','A LITTLE MATCH. A LITTLE MAGIC.':'CREATIVE DIRECTION. DIGITAL PRESENCE.','FLIP. MATCH. REPEAT.':'UNDERSTAND. CREATE. CONNECT.','30s':'2D','TIME':'FORMAT','PAIRS':'STUDIES','COMBO':'STUDIO','×3':'K'},{"Pocket Quest — back to top":"Konnect — back to top","Preparing Pocket Quest":"Preparing Konnect","Loading Pocket Quest":"Loading Konnect","Choose your Pocket Quest hero":"Choose a Konnect study","Pocket Quest game preview on an iPhone":"Konnect design studies on a phone","Relic Rush":"Konnect studies","Challenge accepted. Thirty seconds.":"Creative direction. Made to connect.","Challenge":"Creative","accepted.":"direction.","Thirty":"Made to","seconds.":"connect.","Chapter 04":"","About Problem":"Our approach","Choose your tiny champion. Knight, ranger, bard, paladin, mage, or rogue. Big personalities. Pocket-sized adventures. Who are you playing today?":"Explore original Konnect visual studies. Illustrative work, not client commissions.","A brave heart, a tiny sword, and a little courage for every new adventure.":"Social strategy and content with a point of view.","A steady bow and a curious spirit. Every little detail is worth discovering.":"Identities and visual worlds built around your brand.","A warm smile and a pocket full of songs. Every match deserves an encore.":"Paid creative and landing pages that invite a conversation.","A kind heart behind a shining shield. Small hero, legendary bravery.":"A shared direction, from understanding your brief to delivery.","An enormous hat and a little sparkle. There is magic in every perfect pair.":"Search strategy that helps the right people find you.","Quick hands and quicker thinking. One golden key, a thousand tiny adventures.":"Creative direction that connects your message and identity.","A brave little hero. A very big sense of adventure.":"Social strategy and content with a point of view.","A spell in his book. A little magic in every match.":"Help the right people find your brand.","A steady bow. Sharp eyes. Never misses a detail.":"Identities and visual worlds built around your brand.","Big heart. Good rhythm. Always ready for an encore.":"Campaign creative that invites a conversation.","A kind heart. Steady courage. A champion through and through.":"Understand the brief. Shape a clear direction.","Quick hands. Quicker thinking. Your next best score awaits.":"Different skills, one connected creative studio.","Knight":"Social","Ranger":"Design","Bard":"Campaigns","Paladin":"Strategy","Mage":"Search","Rogue":"Creative","Heroes":"Konnect studies","Previous hero":"Previous study","Next hero":"Next study"});
Object.assign(replacements,{'Sevran':'Process','Nyravel':'Studio','Strategy':'Process','Creative':'Studio'});
function adapt(code){
 for(const [from,to] of Object.entries(replacements)){
  for(const quoted of [JSON.stringify(from),"'"+from.replaceAll("'","\\'")+"'",'`'+from+'`']) code=code.split(quoted).join(JSON.stringify(to));
 }
 return code;
}
for(const f of bundle.files){
 if(crypto.createHash('sha256').update(f.code).digest('hex')!==f.sha256)throw Error(f.path);
 if(!f.path.startsWith('public/'))continue;
 let code=adapt(f.code);
 code=code.replaceAll('Cute chibi human ','Konnect illustrative study: ').replaceAll('Play as the ','Enquire about ').replaceAll(' Pocket Quest',' Konnect');
 if(/HomePage-|pocket-card-art|pocket-loader|totems-/.test(f.path)){const colors={'#497568':'#242429','#7d6598':'#b4121b','#ab7357':'#45454a','#ad8c47':'#242429','#577ea0':'#55555b','#aa748b':'#b4121b','#ff6b5e':'#e9101b','#5e9cff':'#d6d6d8','#46c98e':'#a3a3ab','#c77dff':'#e9101b','#f7c6f7':'#d6d6d8','#ffdcff':'#d6d6d8','#9a5ec2':'#e9101b','#f2cdf8':'#d6d6d8','#f3eee4':'#d6d6d8'};for(const [a,b] of Object.entries(colors))code=code.replaceAll(a,b)}
 if(f.path.endsWith('/HomePage-SelUD7Yz.js')){
 code=code.replace('Zn="Creative direction. Digital presence."','Zn=window.konnectContent?.intro?.heading||"KONNECT"');
 code=code.replace(/chapter:`Chapter \d+`/g,'chapter:``');
 }
 if(f.path.endsWith('/HomePage-SelUD7Yz.js')){
 code=code.replace(JSON.stringify('Konnect Vision Media is a creative and digital marketing partner for Indian businesses. We connect social media, design, search and campaigns around a clear idea, giving your brand a voice and a consistent digital presence.'),'(window.konnectContent?.studio?.copy||'+JSON.stringify('A creative and digital marketing partner for Indian businesses.')+')');
 code=code.replace(JSON.stringify('Creative direction. Digital presence.'),'(window.konnectContent?.intro?.copy||'+JSON.stringify('Creative direction. Digital presence.')+')');
 }
 if(f.path.endsWith('/pocket-loader.js'))code=code.replace('if(exit.current||(', 'if(elapsed>6000||exit.current||(');
 if(f.path.endsWith('/pocket-card-art.js'))code=code.replace("const sans='Switzer, Arial, sans-serif'","const sans='Manrope, Arial, sans-serif'").replace(/ink:'#[a-f0-9]+',accent:'#[a-f0-9]+'/g,"ink:'#242429',accent:'#d6d6d8'");
 if(f.path.endsWith('/package.js')){
 const pack=JSON.parse(f.code.replace(/^export default /,'').replace(/;\s*$/,''));
 pack.css=pack.css.replaceAll('PP Pangaia','Clash Grotesk').replaceAll('Switzer','General Sans').replaceAll('#f3eee4','#d6d6d8').replaceAll('#eee9df','#d6d6d8').replaceAll('#c9a24a','#e9101b').replaceAll('#cbb3d8','#e9101b');
 pack.css=pack.css.replaceAll('/landing-pages/aura-2026-10-20-assets/other/d1bf801ffb1a6096def70a7c.woff2','/wp-content/themes/konnect/assets/fonts/general-sans.woff2').replaceAll('/landing-pages/aura-2026-10-20-assets/other/4e40a135ca1cf92ac998da69.woff2','/wp-content/themes/konnect/assets/fonts/clash-grotesk.woff2');
 for(const [k,v] of Object.entries(pack.assets))pack.assets[k]=local(v);
 for(const [k,v] of Object.entries(pack.modules))pack.modules[k]=local(v);
 const art={knight:'social',ranger:'identity',bard:'lead',paladin:'process',mage:'search',rogue:'studio'};
 for(const [hero,poster] of Object.entries(art)){pack.assets['/heroes/'+hero+'.webp']='/wp-content/themes/konnect/assets/studio/'+poster+'.webp';pack.assets['/relics/'+hero+'.webp']=pack.assets['/heroes/'+hero+'.webp'];}
 pack.assets['/Logo.svg']=root+'/konnect-logo.svg';pack.assets['/Fav.svg']='/wp-content/themes/konnect/assets/studio/mark.svg';
 pack.assets['/fonts/Switzer-Variable.woff2']='/wp-content/themes/konnect/assets/fonts/general-sans.woff2';
 pack.assets['/fonts/PPPangaia-Light.woff2']='/wp-content/themes/konnect/assets/fonts/clash-grotesk.woff2';
 darkPack(pack);
 code='export default '+JSON.stringify(pack)+';';
 }else code=local(code);
 if(f.path.endsWith('/HomePage-SelUD7Yz.js')){
 code=code.replace(/rr=\[\{t:[\s\S]*?\],ir=/,'rr=(window.konnectContent?.process?.heading||"Understand. Create. Connect.").split(/(?<=[.!?])\\s+/).filter(Boolean).map((t,i)=>({t,ml:["42.4vw","33vw","17vw","42.4vw"][i%4]})),ir=');
 }
 if(f.path.endsWith('/pocket-content.js')){
 code=code.replaceAll("+' — '+d.hero", "");
 }
 if(f.path.endsWith('/pocket-card-art.js'))code=await fs.readFile('src/pocket-card-art.js','utf8');
 if(f.path.endsWith('/pocket-content.js')){
 code=code.replaceAll('width:1024,height:1536','width:1024,height:1024').replaceAll("h('small',{children:'RELIC RUSH'})","h('small',{children:''})");
 }
 if(f.path.endsWith('/pocket-content.js')){
 const compactWorld=await fs.readFile('src/pocket-world-adapted.js','utf8');
 const services=await fs.readFile('src/pocket-services-adapted.js','utf8');
 const sectionSource=/export function PocketWorld\(\)\{[\s\S]*?\n\}\n\nconst MAGIC=[\s\S]*?export function PocketMagic\(\)\{[\s\S]*?\n\}/;
 if(!sectionSource.test(code))throw Error('ThreeUI work and services source boundary changed');
 code=code.replace(sectionSource,()=>compactWorld.trimEnd()+'\n\n'+services.trimEnd());
 const strip=(source)=>{if(!code.includes(source))throw Error('ThreeUI content source boundary changed: '+source.slice(0,48));code=code.replace(source,'');};
 strip('h(\'p\',{className:\'pq-footer-note\',children:"Social · Design · Search · Campaigns"})');
 }
 if(f.path.endsWith('/HomePage-SelUD7Yz.js')){
 code=code.replace('text:"Different skills."','text:window.konnectContent?.studio?.heading||"Different skills. One studio."').replace('text:"One studio."','text:""');
 code=code.replace(JSON.stringify('KONNECT VISION MEDIA\nCreative direction. Digital presence.'),'("KONNECT VISION MEDIA\\n"+(window.konnectContent?.intro?.copy||"Creative direction. Digital presence."))');
 const strip=(source)=>{if(!code.includes(source))throw Error('ThreeUI homepage source boundary changed: '+source.slice(0,48));code=code.replace(source,'');};
 strip('(0,W.jsx)(`p`,{className:Q.tagline,children:("KONNECT VISION MEDIA\\n"+(window.konnectContent?.intro?.copy||"Creative direction. Digital presence."))}),');
 strip('D&&(0,W.jsx)(ft,{label:"From idea to identity",chapter:``,tone:`light`,className:Q.s4colontitle}),');
 strip('V&&(0,W.jsx)(ft,{label:"From idea to identity",chapter:``,tone:`light`}),');
 }
 code=darkModule(code,f.path);
 if(f.path.endsWith('/pocket-content.js')){
  const phoneSource=/function Phone\(\)\{[\s\S]*?\nexport function PocketFeature/;
  if(!phoneSource.test(code))throw Error('ThreeUI phone source boundary changed');
  code=code.replace(phoneSource,()=>phoneMenuSource.trim()+'\nexport function PocketFeature');
 }
 const p=path.join(out,f.path.replace(/^public\//,''));await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,code);
}
for(const a of bundle.assets){const b=await fs.readFile('design-source/threeui/'+a.path);if(crypto.createHash('sha256').update(b).digest('hex')!==a.sha256)throw Error(a.path);const p=path.join(out,a.path.replace(/^public\//,''));await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,b)}
await fs.writeFile(out+'/konnect-logo.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="330" height="60" viewBox="0 0 330 60" fill="${palette.white}"><text x="0" y="43" font-family="Arial,sans-serif" font-weight="700" font-size="43" letter-spacing="-2">KONNECT</text><path d="M238 13V47" stroke="${palette.graphite}"/><text x="250" y="27" font-family="Arial,sans-serif" font-weight="500" font-size="15" letter-spacing="1">VISION</text><text x="250" y="45" font-family="Arial,sans-serif" font-weight="500" font-size="15" letter-spacing="1">MEDIA</text></svg>`);
let html=await fs.readFile(out+'/landing-pages/pocket-quest.html','utf8');
html=html.replace(/<head>[\s\S]*?<meta charset/, '<head><meta charset');
html=html.replace(/<script>document.addEventListener\('click',[\s\S]*?<\/script>/g,'');
html=html.replace(/<!-- Pocket Quest:[\s\S]*?-->/,'<!-- Adapted from the registered ThreeUI Pocket Quest source. Original visual design: Grail / Denormalized. See docs/pocket-integration.md. -->');
html=html.replace('<div id="root"></div>','<main id="root" tabindex="-1"></main>');
html=html.replace(/<dialog id="pq-game"[\s\S]*?<\/dialog>/,'<!-- KONNECT_CONTACT -->');
html=html.replace(/<noscript>[\s\S]*?<\/noscript>/,'<!-- KONNECT_FALLBACK -->');
html=html.replace("  await import('grail/pocket-game.js');",'');
html=html.replace("  'use strict';","  'use strict'; if(window.konnectStatic) return;");
html=html.replace('</head>','<!-- KONNECT_HEAD --><link rel="stylesheet" href="'+root+'/brand.css"></head>');
html=html.replace("  await import('grail/index-qyEp212_.js');","  if(!window.konnectStatic) await import('grail/index-qyEp212_.js');");
html=html.replace("    console.error(error);","    console.error(error); document.documentElement.classList.remove('konnect-ready'); document.documentElement.classList.add('konnect-static'); document.getElementById('konnect-fallback').inert=false;");
html=html.replace('</body>','<script src="'+root+'/brand.js"></script><!-- KONNECT_FOOT --></body>');
await fs.writeFile(out+'/document.html',html);
console.log('Built Konnect adaptation from 30 verified source files and 41 verified assets');

await fs.copyFile('src/pocket-brand.css',out+'/brand.css');
await fs.copyFile('src/pocket-brand.js',out+'/brand.js');

await fs.copyFile('src/pocket-slides.js',out+'/konnect-slides.js');
await fs.writeFile(out+'/konnect-palette.js',`export default ${JSON.stringify(palette, null, 2)};\n`);
await fs.copyFile('src/konnect-phone.svg',out+'/konnect-phone.svg');
