import {KonnectAtmosphere} from 'grail/konnect-slides.js';
import {GAME_CARDS,drawGameCardFront,drawGameCardBack,loadGameHeroes} from 'grail/pocket-card-art.js';
import {n as makeReact,t as makeJSX} from 'grail/jsx-runtime-B4RpOl0S.js';
const {jsx:h,jsxs:hs}=makeJSX();
const {useEffect,useRef,useState}=makeReact();
const asset=path=>window.__grailAsset(path);
const play=()=>window.dispatchEvent(new Event('pocket-play'));
const heroes=['knight','ranger','bard','paladin','mage','rogue'];
const crest=['tempers','brotherhood-of-tale','keepers-of-time','seeker-of-forsaken','wind-shifters'];
function Button({label="Start a project"}){return h('button',{className:'pq-button',onClick:play,children:label})}
function RoundButton({label,onClick=play,className=''}){return hs('button',{type:'button',className:'pq-round-button '+className,onClick,'aria-label':label,children:[
 h('span',{className:'pq-round-symbol','aria-hidden':true,children:h('svg',{viewBox:'0 0 24 24',fill:'none',children:h('path',{d:'M8 5.5 18 12 8 18.5Z',fill:'currentColor'})})}),
 hs('span',{className:'pq-round-label',children:[h('small',{children:''}),h('strong',{children:label})]}),
 h('span',{className:'pq-round-time','aria-hidden':true,children:"2D"})
]})}
function Phone(){return hs('div',{className:'pq-phone konnect-menu-phone',children:[
  h('div',{className:'pq-island','aria-hidden':true}),
  h('div',{className:'konnect-phone-menu-slot','aria-hidden':true}),
  h('div',{className:'pq-home-bar','aria-hidden':true})
]})}
export function PocketFeature(){return hs('section',{className:'_voice_bknov_3 pq-feature',children:[h(KonnectAtmosphere,{}),
  hs('div',{className:'pq-chapter',children:[h('span',{children:"Made for your brand"}),h('span',{children:""})]}),
  hs('div',{className:'pq-feature-grid',children:[hs('h2',{className:'pq-feature-title',children:["Clear ",h('br',{}),"ideas."]}),h(Phone,{}),hs('p',{className:'pq-feature-title pq-feature-right',children:["Bold",h('br',{}),"design."]})]}),
  hs('div',{className:'pq-feature-bottom',children:[hs('div',{children:[h('span',{className:'pq-eyebrow',children:"ONE IDEA. A CLEAR DIRECTION."}),h('p',{children:"We connect your message, identity and digital presence around a shared creative direction."})]}),hs('div',{children:[h('span',{className:'pq-eyebrow',children:"MAKE YOUR NEXT CONNECTION."}),h('p',{children:"Tell us what you have in mind. We will help shape the brief and explore how Konnect can support your brand."})]})]})
]})}
export function PocketFooter(){
 const root=useRef(null);
 useEffect(()=>{const el=root.current;const observer=new IntersectionObserver(([v])=>el.classList.toggle('is-visible',v.isIntersecting),{threshold:.1});observer.observe(el);return()=>observer.disconnect();},[]);
 const cast=[{hero:'mage',name:"Search",role:"Search strategy",number:'II'},{hero:'knight',name:"Social",role:"Social direction",number:'I'},{hero:'bard',name:"Campaigns",role:"Campaign creative",number:'III'}];
 return hs('footer',{ref:root,id:'pocket-footer',className:'_footer_jyv7u_1 pq-footer','aria-labelledby':'pq-footer-title',children:[
  hs('div',{className:'pq-footer-topline',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),"YOUR NEXT CREATIVE CONNECTION"]}),h('span',{children:'CHAPTER 08'})]}),
  hs('div',{className:'pq-footer-main',children:[
   hs('div',{className:'pq-footer-copy',children:[
    h('p',{className:'pq-footer-eyebrow',children:"HAVE SOMETHING IN MIND?"}),
    hs('h2',{id:'pq-footer-title',children:["Let’s make",h('br',{}),h('em',{children:"contact."})]}),
    h('p',{className:'pq-footer-pitch',children:"Bring us your next idea. Let’s give it a clear creative direction."}),
    h(RoundButton,{label:"Start a project",className:'pq-footer-play'}),
    
   ]}),
   hs('div',{className:'pq-footer-art',children:[
    h('div',{className:'pq-footer-deck','aria-hidden':true,children:cast.map((c,i)=>hs('div',{className:'pq-footer-hero pq-footer-hero-'+i,children:[
     hs('div',{className:'pq-footer-card-top',children:[h('span',{children:"KONNECT"}),h('span',{children:c.number})]}),
     h('img',{className:'pq-footer-character',src:asset('/heroes/'+c.hero+'.webp'),alt:'',loading:'lazy',decoding:'async'}),
     hs('div',{className:'pq-footer-card-name',children:[h('strong',{children:c.name}),h('span',{children:c.role})]})
    ]},c.hero))}),
    hs('p',{className:'pq-footer-deck-caption',children:[h('span',{children:"KONNECT STUDIES"}),h('span',{'aria-hidden':true,children:'—'}),h('span',{children:"ILLUSTRATIVE · NOT CLIENT WORK"})]})
   ]})
  ]}),
  hs('div',{className:'pq-footer-endnote',children:[h('p',{children:"Creative direction. Digital presence."}),hs('p',{className:'pq-footer-release',children:[h('span',{children:"A CREATIVE AND DIGITAL PARTNER."}),h('span',{children:"Based in India."})]})]}),
  hs('div',{className:'pq-footer-base',children:[h('button',{className:'pq-top','aria-label':"Konnect — back to top",onClick:()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}),children:h('img',{src:asset('/Logo.svg'),alt:"Konnect"})}),h('span',{children:'© '+new Date().getFullYear()+' Konnect'}),h('a',{href:'#pocket-world',children:"Explore our work"})]})
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
  "Social strategy and content with a point of view.",
  "Help the right people find your brand.",
  "Identities and visual worlds built around your brand.",
  "Campaign creative that invites a conversation.",
  "Understand the brief. Shape a clear direction.",
  "Different skills, one connected creative studio."
];
export function PocketWorld(){
  return hs('section',{id:'pocket-world',className:'_guilds_194d4_3 pq-world pq-world-compact','aria-labelledby':'pq-world-title',children:[
    hs('div',{className:'pq-world-heading',children:[
      h('div',{'data-guild-title':true,children:hs('h2',{id:'pq-world-title',children:[window.konnectContent?.work?.heading||'Made to connect',h('br',{}),hs('span',{children:['Big ',h('em',{children:"connections."})]})]})})
    ]})
  ]});
}

const SERVICES = [
  { label: 'Social', hero: 'knight', poster: 'GOOD COMPANY', heading: 'Find your voice.', copy: 'Social strategy and content with a point of view.' },
  { label: 'Design', hero: 'ranger', poster: 'Layered Konnect K', heading: 'Make a mark.', copy: 'Identities and visual worlds built around your brand.' },
  { label: 'Search', hero: 'mage', poster: 'BE FOUND.', heading: 'Be found.', copy: 'Help the right people find your brand.' },
  { label: 'Campaigns', hero: 'bard', poster: 'LET’S TALK.', heading: 'Start a conversation.', copy: 'Campaign messaging, creative and landing pages.' },
];

// Adapted from React Bits SpotlightCard (David Haz, MIT + Commons Clause).
// https://reactbits.dev/r/SpotlightCard-JS-CSS.json
// License: docs/react-bits-smoke.md. The existing homepage supplies the React runtime.
function moveServiceSpotlight(event) {
  if (event.pointerType !== 'mouse' || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
}

export function PocketMagic() {
  const chapter = window.konnectContent?.services;
  const serviceCopy = chapter?.serviceCopy || {};

  return hs('section', {
    id: 'pocket-magic',
    className: 'pq-magic konnect-services',
    'aria-labelledby': 'pq-magic-title',
    children: [
      h('h2', { id: 'pq-magic-title', children: chapter?.heading || 'What we do' }),
      h('div', {
        className: 'konnect-services-grid',
        children: SERVICES.map(({label, hero, poster, heading, copy}, index) =>
          hs('article', {
            className: 'konnect-service',
            onPointerMove: moveServiceSpotlight,
            children: [
              h('img', {
                className: 'konnect-service-poster',
                src: asset('/heroes/' + hero + '.webp'),
                alt: `Konnect poster study: ${poster}`,
                width: 1024,
                height: 1024,
                loading: 'lazy',
                decoding: 'async',
              }),
              hs('div', {
                className: 'konnect-service-copy',
                children: [
                  h('h3', { children: label }),
                  h('p', { className: 'konnect-service-heading', children: serviceCopy[index + '_heading'] || heading }),
                  h('p', { children: serviceCopy[index + '_copy'] || copy }),
                  h('button', {
                    className: 'konnect-service-enquiry',
                    type: 'button',
                    onClick: play,
                    children: `Enquire about ${label}`,
                  }),
                ],
              }),
            ],
          }, hero)),
      }),
    ],
  });
}
