import {GAME_CARDS,drawGameCardFront,drawGameCardBack,loadGameHeroes} from 'grail/pocket-card-art.js';
import {n as makeReact,t as makeJSX} from 'grail/jsx-runtime-B4RpOl0S.js';
const {jsx:h,jsxs:hs}=makeJSX();
const {useEffect,useRef,useState}=makeReact();
const asset=path=>window.__grailAsset(path);
const play=()=>window.dispatchEvent(new Event('pocket-play'));
const heroes=['knight','ranger','bard','paladin','mage','rogue'];
const crest=['tempers','brotherhood-of-tale','keepers-of-time','seeker-of-forsaken','wind-shifters'];
function Button({label='Play the demo'}){return h('button',{className:'pq-button',onClick:play,children:label})}
function RoundButton({label,onClick=play,className=''}){return hs('button',{type:'button',className:'pq-round-button '+className,onClick,'aria-label':label,children:[
 h('span',{className:'pq-round-symbol','aria-hidden':true,children:h('svg',{viewBox:'0 0 24 24',fill:'none',children:h('path',{d:'M8 5.5 18 12 8 18.5Z',fill:'currentColor'})})}),
 hs('span',{className:'pq-round-label',children:[h('small',{children:'RELIC RUSH'}),h('strong',{children:label})]}),
 h('span',{className:'pq-round-time','aria-hidden':true,children:'30s'})
]})}
function Phone(){return hs('div',{className:'pq-phone','aria-label':'Pocket Quest game preview on an iPhone',children:[
  h('div',{className:'pq-island','aria-hidden':true}),
  hs('div',{className:'pq-phone-heading',children:[h('span',{children:'POCKET QUEST'}),h('span',{children:'✧'})]}),
  h('p',{className:'pq-phone-title',children:'Relic Rush'}),
  hs('div',{className:'pq-phone-hud',children:[hs('span',{children:[h('small',{children:'TIME'}),'00:30']}),hs('span',{children:[h('small',{children:'SCORE'}),'1,250']}),hs('span',{children:[h('small',{children:'COMBO'}),'×3']})]}),
  h('div',{className:'pq-preview-grid','aria-hidden':true,children:[0,1,2,3,4,5,4,2,1,0,5,3].map((id,i)=>h('div',{className:'pq-preview-card '+([0,4,8,10].includes(i)?'is-back':''),children:[0,4,8,10].includes(i)?h('img',{src:asset('/grail-mark.svg'),alt:''}):h('img',{src:asset('/heroes/'+heroes[id]+'.webp'),alt:''})},i))}),
  h('p',{className:'pq-phone-tip',children:'Your next match is a little bit of magic.'}),
  h(Button,{label:'Try a 30-second round'}),h('div',{className:'pq-home-bar','aria-hidden':true})
]})}
export function PocketFeature(){return hs('section',{className:'_voice_bknov_3 pq-feature',children:[
  hs('div',{className:'pq-chapter',children:[h('span',{children:'Made for your iPhone 17'}),h('span',{children:'Chapter 04'})]}),
  hs('div',{className:'pq-feature-grid',children:[hs('h2',{className:'pq-feature-title',children:['Tiny ',h('br',{}),'world.']}),h(Phone,{}),hs('p',{className:'pq-feature-title pq-feature-right',children:['Big',h('br',{}),'wins.']})]}),
  hs('div',{className:'pq-feature-bottom',children:[hs('div',{children:[h('span',{className:'pq-eyebrow',children:'ONE THUMB. ALL THE FUN.'}),h('p',{children:'Portrait play, quick rounds, and a cast of tiny champions. An adventure that fits your hand and the little gaps in your day.'})]}),hs('div',{children:[h('span',{className:'pq-eyebrow',children:'GET A TASTE. BEAT YOUR BEST.'}),h('p',{children:'Play Relic Rush right here. Flip the cards, match all six heroes, and beat the thirty-second clock. Your next little victory is waiting.'})]})]})
]})}
export function PocketFooter(){
 const root=useRef(null);
 useEffect(()=>{const el=root.current;const observer=new IntersectionObserver(([v])=>el.classList.toggle('is-visible',v.isIntersecting),{threshold:.1});observer.observe(el);return()=>observer.disconnect();},[]);
 const cast=[{hero:'mage',name:'Lyriath',role:'Moonveil Arcanist',number:'II'},{hero:'knight',name:'Vaelorn',role:'Oathbound Knight',number:'I'},{hero:'bard',name:'Orvynn',role:'Requiem Bard',number:'III'}];
 return hs('footer',{ref:root,id:'pocket-footer',className:'_footer_jyv7u_1 pq-footer','aria-labelledby':'pq-footer-title',children:[
  hs('div',{className:'pq-footer-topline',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),'YOUR NEXT LITTLE ADVENTURE']}),h('span',{children:'CHAPTER 08'})]}),
  hs('div',{className:'pq-footer-main',children:[
   hs('div',{className:'pq-footer-copy',children:[
    h('p',{className:'pq-footer-eyebrow',children:'ONE MORE ROUND?'}),
    hs('h2',{id:'pq-footer-title',children:['Got thirty',h('br',{}),h('em',{children:'seconds?'})]}),
    h('p',{className:'pq-footer-pitch',children:'Six little heroes. A quick game of memory. One more little victory to take with you.'}),
    h(RoundButton,{label:'Play the free demo',className:'pq-footer-play'}),
    h('p',{className:'pq-footer-note',children:'Free to play in your browser. No download needed.'})
   ]}),
   hs('div',{className:'pq-footer-art',children:[
    h('div',{className:'pq-footer-deck','aria-hidden':true,children:cast.map((c,i)=>hs('div',{className:'pq-footer-hero pq-footer-hero-'+i,children:[
     hs('div',{className:'pq-footer-card-top',children:[h('span',{children:'POCKET QUEST'}),h('span',{children:c.number})]}),
     h('img',{className:'pq-footer-character',src:asset('/heroes/'+c.hero+'.webp'),alt:'',loading:'lazy',decoding:'async'}),
     hs('div',{className:'pq-footer-card-name',children:[h('strong',{children:c.name}),h('span',{children:c.role})]})
    ]},c.hero))}),
    hs('p',{className:'pq-footer-deck-caption',children:[h('span',{children:'06 HEROES'}),h('span',{'aria-hidden':true,children:'—'}),h('span',{children:'A WHOLE LOT OF CHARACTER'})]})
   ]})
  ]}),
  hs('div',{className:'pq-footer-endnote',children:[h('p',{children:'Small game. Big adventure.'}),hs('p',{className:'pq-footer-release',children:[h('span',{children:'A LITTLE ADVENTURE FOR YOUR IPHONE.'}),h('span',{children:'Coming to iOS.'})]})]}),
  hs('div',{className:'pq-footer-base',children:[h('button',{className:'pq-top','aria-label':'Pocket Quest — back to top',onClick:()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}),children:h('img',{src:asset('/Logo.svg'),alt:'Pocket Quest'})}),h('span',{children:'© '+new Date().getFullYear()+' Pocket Quest'}),h('a',{href:'#pocket-world',children:'Meet your heroes ↑'})]})
 ]});
}
function MobileGameCard({index,front}){
  const ref=useRef(null);
  useEffect(()=>{let alive=true;Promise.all([loadGameHeroes(),document.fonts.ready]).then(([heroes])=>{
    if(!alive||!ref.current)return;const d=GAME_CARDS[index%GAME_CARDS.length];
    if(front)drawGameCardFront(ref.current,d,heroes);else drawGameCardBack(ref.current,d);
  });return()=>{alive=false;};},[index,front]);
  return h('canvas',{ref,className:'pq-mobile-card pq-art-card '+(front?'face face-'+index:'back back-'+index),'aria-hidden':true});
}
export function PocketMobileDeck(){return h('div',{className:'pq-mobile-deck','aria-hidden':true,children:[0,1,2,3,4,5].map(index=>h(MobileGameCard,{index,front:index===1||index===4},index))})}

const WORLD_LINES=[
  'A brave little hero. A very big sense of adventure.',
  'A spell in his book. A little magic in every match.',
  'A steady bow. Sharp eyes. Never misses a detail.',
  'Big heart. Good rhythm. Always ready for an encore.',
  'A kind heart. Steady courage. A champion through and through.',
  'Quick hands. Quicker thinking. Your next best score awaits.'
];
export function PocketWorld(){
  const [selected,setSelected]=useState(0),root=useRef(null),gallery=useRef(null),items=useRef([]);
  const hero=GAME_CARDS[selected];
  useEffect(()=>{const el=root.current;if(!el)return;const io=new IntersectionObserver(([entry])=>el.classList.toggle('is-visible',entry.isIntersecting),{threshold:.1});io.observe(el);return()=>io.disconnect();},[]);
  function choose(index){
    const next=(index+GAME_CARDS.length)%GAME_CARDS.length;
    setSelected(next);window.dispatchEvent(new CustomEvent('pocket-hero',{detail:GAME_CARDS[next].hero}));
    const row=gallery.current,item=items.current[next];
    if(row&&item&&row.scrollWidth>row.clientWidth+10)row.scrollTo({left:item.offsetLeft-row.offsetLeft-(row.clientWidth-item.offsetWidth)/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function playHero(){window.dispatchEvent(new CustomEvent('pocket-hero',{detail:hero.hero}));play();}
  return hs('section',{ref:root,id:'pocket-world',className:'_guilds_194d4_3 pq-world','aria-labelledby':'pq-world-title',children:[
    hs('div',{className:'pq-world-top',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),'A WORLD IN YOUR POCKET']}),h('span',{children:'CHAPTER 07'})]}),
    hs('div',{className:'pq-world-heading',children:[
      h('div',{'data-guild-title':true,children:hs('h2',{id:'pq-world-title',children:['Small screen.',h('br',{}),hs('span',{children:['Big ',h('em',{children:'characters.'})]})]})}),
      hs('div',{className:'pq-world-intro',children:[h('span',{className:'pq-world-kicker',children:'SIX HEROES. ALL PERSONALITY.'}),h('p',{children:'A knight with a brave heart. A mage with a little magic. Meet the tiny legends who make every match a little more magical.'}),h('span',{className:'pq-world-invitation',children:'Pick the one that feels like you. ↘'})]})
    ]}),
    hs('div',{className:'pq-world-stage',children:[
      h('div',{className:'pq-world-orbit','aria-hidden':true}),
      h('div',{ref:gallery,className:'pq-world-gallery',role:'group','aria-label':'Choose your Pocket Quest hero',children:GAME_CARDS.map((d,i)=>hs('button',{
        type:'button',ref:el=>items.current[i]=el,className:'pq-world-hero'+(selected===i?' is-selected':''),
        style:{'--hero-color':d.accent,'--hero-ink':d.ink,'--hero-angle':[-6,-3,-1,1,3,6][i]+'deg','--hero-delay':(-i*1.2)+'s'},
        'aria-label':'Choose '+d.role.toLowerCase()+' — '+d.hero,'aria-pressed':selected===i,onClick:()=>choose(i),
        children:[
          hs('div',{className:'pq-world-portrait',children:[
            h('span',{className:'pq-world-index',children:String(i+1).padStart(2,'0')}),
            h('span',{className:'pq-world-spark','aria-hidden':true,children:'✦'}),
            h('div',{className:'pq-world-halo','aria-hidden':true}),
            h('div',{className:'pq-world-shadow','aria-hidden':true}),
            h('svg',{className:'pq-world-creature',viewBox:d.crop[0]+' '+d.crop[1]+' '+d.crop[2]+' '+d.crop[3],'aria-hidden':true,children:h('image',{href:asset('/heroes/'+d.hero+'.webp'),width:1024,height:1536})}),
            h('span',{className:'pq-world-pick',children:selected===i?'YOUR CHAMPION':'CHOOSE HERO'})
          ]}),
          h('span',{className:'pq-world-role',children:d.role.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}),
          h('span',{className:'pq-world-species',children:'CHIBI HERO · '+String(d.id).padStart(2,'0')})
        ]},d.id))})
    ]}),
    hs('div',{className:'pq-world-controls',children:[h('button',{type:'button','aria-label':'Previous hero',onClick:()=>choose(selected-1),children:'←'}),h('span',{'aria-live':'polite',children:String(selected+1).padStart(2,'0')+' / 06'}),h('button',{type:'button','aria-label':'Next hero',onClick:()=>choose(selected+1),children:'→'})]}),
    hs('div',{className:'pq-world-bottom',children:[
      hs('div',{className:'pq-world-story','aria-live':'polite',children:[h('span',{className:'pq-world-story-name',children:hero.role}),h('p',{children:WORLD_LINES[selected]})]}),
      hs('div',{className:'pq-world-action',children:[h(RoundButton,{className:'pq-world-launch',label:'Play as '+hero.role.replace('THE ','the ').toLowerCase(),onClick:playHero}),h('span',{children:'Six pairs. Your next personal best.'})]})
    ]})
  ]});
}

const MAGIC=[
 {label:'Streak',value:'×3',unit:'COMBO MULTIPLIER',hero:'bard',symbol:'✧',color:'#e0c577',line:'Find your rhythm.',body:'Match without a miss and turn a little win into a brilliant streak.'},
 {label:'Speed',value:'30',unit:'SECONDS OF ADVENTURE',hero:'rogue',symbol:'ϟ',color:'#d6acba',line:'Make every second sparkle.',body:'Beat the clock. Finish early and collect a little time-bonus magic.'},
 {label:'Focus',value:'06',unit:'PAIRS TO DISCOVER',hero:'ranger',symbol:'◎',color:'#e3ac8e',line:'Follow the familiar faces.',body:'One hero. One perfect pair. Keep your eyes on the little details.'},
 {label:'Memory',value:'12',unit:'CARDS. ENDLESS REMATCHES.',hero:'mage',symbol:'✦',color:'#c7b2df',line:'A little peek. A little magic.',body:'Remember your heroes, trust your instinct, and surprise yourself.'}
];
export function PocketMagic(){
 const root=useRef(null);
 useEffect(()=>{const el=root.current;if(!el)return;const io=new IntersectionObserver(([v])=>el.classList.toggle('is-visible',v.isIntersecting),{threshold:.15});io.observe(el);return()=>io.disconnect();},[]);
 const playAs=slug=>{window.dispatchEvent(new CustomEvent('pocket-hero',{detail:slug}));play();};
 return hs('section',{id:'pocket-magic',ref:root,className:'pq-magic','aria-labelledby':'pq-magic-title',children:[
  hs('div',{className:'pq-magic-top',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),'MORE THAN A LUCKY MATCH']}),h('span',{children:'CHAPTER 06'})]}),
  hs('header',{className:'pq-magic-heading',children:[hs('h2',{id:'pq-magic-title',children:['Every round.',h('br',{}),'A little ',h('em',{children:'magic.'})]}),hs('div',{className:'pq-magic-intro',children:[h('span',{children:'TINY HEROES. BIG LITTLE WINS.'}),h('p',{children:'A flash of memory. A perfect pair. That just-one-more feeling. Meet the little legends who make every round your own.'})]})]}),
  h('div',{className:'pq-magic-grid',children:MAGIC.map((m,i)=>hs('article',{className:'pq-magic-card',style:{'--magic-color':m.color,'--magic-delay':(-i*1.2)+'s'},children:[
   hs('div',{className:'pq-magic-card-top',children:[h('span',{className:'pq-magic-trait',children:[m.label]}),h('span',{'aria-hidden':true,children:m.symbol})]}),
   hs('div',{className:'pq-magic-metric',children:[h('strong',{children:m.value}),h('span',{children:m.unit})]}),
   hs('div',{className:'pq-magic-art',children:[h('div',{className:'pq-magic-halo','aria-hidden':true}),h('img',{src:asset('/heroes/'+m.hero+'.webp'),alt:'Cute chibi human '+m.hero,decoding:'async'}),h('span',{className:'pq-magic-art-spark','aria-hidden':true,children:'✦'})]}),
   hs('div',{className:'pq-magic-card-copy',children:[h('h3',{children:m.line}),h('p',{children:m.body}),hs('button',{onClick:()=>playAs(m.hero),'aria-label':'Play as the '+m.hero,children:['Play as the '+m.hero,h('span',{'aria-hidden':true,children:'↗'})]})]})
  ]},m.hero))}),
  hs('footer',{className:'pq-magic-bottom',children:[hs('span',{children:[h('i',{'aria-hidden':true}),'SIX CHIBI HEROES. ONE LITTLE ADVENTURE.']}),h('span',{children:'Flip. Match. Make a little magic.'})]})
 ]});
}
