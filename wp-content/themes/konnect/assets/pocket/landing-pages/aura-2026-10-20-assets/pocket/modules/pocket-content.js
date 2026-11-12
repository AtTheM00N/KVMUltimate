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
function Phone(){return hs('div',{className:'pq-phone','aria-label':"Konnect design studies on a phone",children:[
  h('div',{className:'pq-island','aria-hidden':true}),
  hs('div',{className:'pq-phone-heading',children:[h('span',{children:"KONNECT"}),h('span',{children:'✧'})]}),
  h('p',{className:'pq-phone-title',children:"Konnect studies"}),
  hs('div',{className:'pq-phone-hud',children:[hs('span',{children:[h('small',{children:"FORMAT"}),'00:30']}),hs('span',{children:[h('small',{children:'SCORE'}),'1,250']}),hs('span',{children:[h('small',{children:"STUDIO"}),"K"]})]}),
  h('div',{className:'pq-preview-grid','aria-label':'Interactive Konnect studies',children:[0,1,2,3,4,5,4,2,1,0,5,3].map((id,i)=>h('button',{type:'button','aria-label':'Turn Konnect study '+(i+1),'aria-pressed':false,onClick:e=>{const b=e.currentTarget;b.classList.toggle('is-turned');b.setAttribute('aria-pressed',String(b.classList.contains('is-turned')))},className:'pq-preview-card '+([0,4,8,10].includes(i)?'is-back':''),children:[0,4,8,10].includes(i)?h('img',{src:asset('/grail-mark.svg'),alt:''}):h('img',{src:asset('/heroes/'+heroes[id]+'.webp'),alt:''})},i))}),
  h('p',{className:'pq-phone-tip',children:'Your next match is a little bit of magic.'}),
  h(Button,{label:"Explore our work"}),h('div',{className:'pq-home-bar','aria-hidden':true})
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
  hs('div',{className:'pq-footer-topline',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),"YOUR NEXT CREATIVE CONNECTION"]}),h('span',{children:''})]}),
  hs('div',{className:'pq-footer-main',children:[
   hs('div',{className:'pq-footer-copy',children:[
    h('p',{className:'pq-footer-eyebrow',children:"HAVE SOMETHING IN MIND?"}),
    hs('h2',{id:'pq-footer-title',children:["Let’s make",h('br',{}),h('em',{children:"contact."})]}),
    h('p',{className:'pq-footer-pitch',children:"Bring us your next idea. Let’s give it a clear creative direction."}),
    h(RoundButton,{label:"Start a project",className:'pq-footer-play'}),
    h('p',{className:'pq-footer-note',children:"Social · Design · Search · Campaigns"})
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
    hs('div',{className:'pq-world-top',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),"A WORLD BUILT AROUND YOUR BRAND"]}),h('span',{children:''})]}),
    hs('div',{className:'pq-world-heading',children:[
      h('div',{'data-guild-title':true,children:hs('h2',{id:'pq-world-title',children:[window.konnectContent?.work?.heading||'Made to connect',h('br',{}),hs('span',{children:['Big ',h('em',{children:"connections."})]})]})}),
      hs('div',{className:'pq-world-intro',children:[h('span',{className:'pq-world-kicker',children:"ORIGINAL KONNECT DESIGN STUDIES."}),h('p',{children:"Explore our original visual studies. These compositions illustrate Konnect’s creative direction and are not client commissions."}),h('span',{className:'pq-world-invitation',children:"Explore a creative direction."})]})
    ]}),
    h('div',{className:'konnect-selected-work',children:(window.konnectContent?.work?.projects||[]).map(p=>h('a',{href:p.url,children:[h('img',{src:p.image,alt:'',loading:'lazy'}),h('h3',{children:p.title}),p.study?h('p',{children:'Konnect design study · Not client work'}):null]},p.url))}),hs('div',{className:'pq-world-stage',children:[
      h('div',{className:'pq-world-orbit','aria-hidden':true}),
      h('div',{ref:gallery,className:'pq-world-gallery',role:'group','aria-label':"Choose a Konnect study",children:GAME_CARDS.map((d,i)=>hs('button',{
        type:'button',ref:el=>items.current[i]=el,className:'pq-world-hero'+(selected===i?' is-selected':''),
        style:{'--hero-color':d.accent,'--hero-ink':d.ink,'--hero-angle':[-6,-3,-1,1,3,6][i]+'deg','--hero-delay':(-i*1.2)+'s'},
        'aria-label':'Choose '+d.role.toLowerCase(),'aria-pressed':selected===i,onClick:()=>choose(i),
        children:[
          hs('div',{className:'pq-world-portrait',children:[
            h('span',{className:'pq-world-index',children:String(i+1).padStart(2,'0')}),
            h('span',{className:'pq-world-spark','aria-hidden':true,children:'✦'}),
            h('div',{className:'pq-world-halo','aria-hidden':true}),
            h('div',{className:'pq-world-shadow','aria-hidden':true}),
            h('svg',{className:'pq-world-creature',viewBox:d.crop[0]+' '+d.crop[1]+' '+d.crop[2]+' '+d.crop[3],'aria-hidden':true,children:h('image',{href:asset('/heroes/'+d.hero+'.webp'),width:1024,height:1024})}),
            h('span',{className:'pq-world-pick',children:selected===i?"YOUR DIRECTION":"EXPLORE STUDY"})
          ]}),
          h('span',{className:'pq-world-role',children:d.role.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}),
          h('span',{className:'pq-world-species',children:"DESIGN STUDY · "+String(d.id).padStart(2,'0')})
        ]},d.id))})
    ]}),
    hs('div',{className:'pq-world-controls',children:[h('button',{type:'button','aria-label':"Previous study",onClick:()=>choose(selected-1),children:'←'}),h('span',{'aria-live':'polite',children:String(selected+1).padStart(2,'0')+' / 06'}),h('button',{type:'button','aria-label':"Next study",onClick:()=>choose(selected+1),children:'→'})]}),
    hs('div',{className:'pq-world-bottom',children:[
      hs('div',{className:'pq-world-story','aria-live':'polite',children:[h('span',{className:'pq-world-story-name',children:hero.role}),h('p',{children:WORLD_LINES[selected]})]}),
      hs('div',{className:'pq-world-action',children:[h(RoundButton,{className:'pq-world-launch',label:'Start a project',onClick:playHero}),h('span',{children:"Original studies. Different points of view."})]})
    ]})
  ]});
}

const MAGIC=[
 {label:'Social',value:'S',unit:'SOCIAL MEDIA',hero:'knight',symbol:'✧',color:'#8f0000',line:'Find your voice.',body:'Social strategy and content with a point of view.'},
 {label:'Design',value:'D',unit:'GRAPHIC DESIGN',hero:'ranger',symbol:'ϟ',color:'#eff2f1',line:'Make a mark.',body:'Identities and visual worlds built around your brand.'},
 {label:'Search',value:'S',unit:'SEARCH STRATEGY',hero:'mage',symbol:'◎',color:'#eff2f1',line:'Be found.',body:'Help the right people find your brand.'},
 {label:'Campaigns',value:'C',unit:'LEAD GENERATION',hero:'bard',symbol:'✦',color:'#8f0000',line:'Start a conversation.',body:'Campaign messaging, creative and landing pages.'}];
MAGIC.forEach((m,i)=>{const a=window.konnectContent?.services?.serviceCopy||{};m.line=a[i+'_heading']||m.line;m.body=a[i+'_copy']||m.body});
export function PocketMagic(){
 const root=useRef(null);
 useEffect(()=>{const el=root.current;if(!el)return;const io=new IntersectionObserver(([v])=>el.classList.toggle('is-visible',v.isIntersecting),{threshold:.15});io.observe(el);return()=>io.disconnect();},[]);
 const playAs=slug=>{window.dispatchEvent(new CustomEvent('pocket-hero',{detail:slug}));play();};
 return hs('section',{id:'pocket-magic',ref:root,className:'pq-magic','aria-labelledby':'pq-magic-title',children:[
  hs('div',{className:'pq-magic-top',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),"CREATIVE AND DIGITAL, CONNECTED"]}),h('span',{children:''})]}),
  hs('header',{className:'pq-magic-heading',children:[hs('h2',{id:'pq-magic-title',children:window.konnectContent?.services?.heading||'What we do'}),hs('div',{className:'pq-magic-intro',children:[h('span',{children:"YOUR BRAND. A SHARED DIRECTION."}),h('p',{children:"Social media, design, search and campaigns. We bring the right disciplines together around your brand."})]})]}),
  h('div',{className:'pq-magic-grid',children:MAGIC.map((m,i)=>hs('article',{className:'pq-magic-card',style:{'--magic-color':m.color,'--magic-delay':(-i*1.2)+'s'},children:[
   hs('div',{className:'pq-magic-card-top',children:[h('span',{className:'pq-magic-trait',children:[m.label]}),h('span',{'aria-hidden':true,children:m.symbol})]}),
   hs('div',{className:'pq-magic-metric',children:[h('strong',{children:m.value}),h('span',{children:m.unit})]}),
   hs('div',{className:'pq-magic-art',children:[h('div',{className:'pq-magic-halo','aria-hidden':true}),h('img',{src:asset('/heroes/'+m.hero+'.webp'),alt:'Konnect illustrative study: '+m.label,decoding:'async'}),h('span',{className:'pq-magic-art-spark','aria-hidden':true,children:'✦'})]}),
   hs('div',{className:'pq-magic-card-copy',children:[h('h3',{children:m.line}),h('p',{children:m.body}),hs('button',{onClick:()=>playAs(m.hero),'aria-label':'Enquire about '+m.label,children:['Enquire about '+m.label,h('span',{'aria-hidden':true,children:'↗'})]})]})
  ]},m.hero))}),
  hs('footer',{className:'pq-magic-bottom',children:[hs('span',{children:[h('i',{'aria-hidden':true}),"DIFFERENT SKILLS. ONE CONNECTED STUDIO."]}),h('span',{children:"Understand. Create. Connect."})]})
 ]});
}
