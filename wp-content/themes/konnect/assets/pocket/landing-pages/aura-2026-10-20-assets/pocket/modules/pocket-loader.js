import {n as makeReact,t as makeJSX} from 'grail/jsx-runtime-B4RpOl0S.js';
import {loadGameHeroes} from 'grail/pocket-card-art.js';
const {jsx:h,jsxs:hs}=makeJSX();
const {useEffect,useRef,useState}=makeReact();
const CAST=[
 {hero:'mage',name:"Search",role:"Search strategy",number:'II'},
 {hero:'knight',name:"Social",role:"Social direction",number:'I'},
 {hero:'bard',name:"Campaigns",role:"Campaign creative",number:'III'}
];
function Mark(){return hs('svg',{viewBox:'0 0 64 64',fill:'none','aria-hidden':true,children:[h('path',{fill:'currentColor',d:'M32 3 58 20 49 49 32 61 15 49 6 20Z'}),h('path',{fill:'#eee9df',d:'m32 12 8 15 14 3-14 5-8 16-8-16-14-5 14-3Z'}),h('path',{fill:'currentColor',d:'m32 24 5 7-5 9-5-9Z'})]})}
export function PocketLoader({getProgress,onTick,onDone,params={}}){
 const root=useRef(null),callbacks=useRef({getProgress,onTick,onDone,params});
 callbacks.current={getProgress,onTick,onDone,params};
 const [progress,setProgress]=useState(0),[ready,setReady]=useState(false),[slow,setSlow]=useState(false),[leaving,setLeaving]=useState(false);
 const preview=useRef(new URLSearchParams(location.search).get('loader-preview')==='1');
 const exit=useRef(false);
 useEffect(()=>{
  let alive=true,frame=0,artReady=false,fontReady=false,finishedAt=null,exitAt=null,last=-1;
  const start=performance.now(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const host=root.current.parentElement;
  const siblings=[...host.children].filter(el=>el!==root.current).map(el=>[el,el.inert]);
  siblings.forEach(([el])=>{el.inert=true});
  document.body.classList.add('pq-is-loading');
  loadGameHeroes().then(()=>{artReady=true}).catch(()=>{});
  document.fonts.ready.then(()=>{fontReady=true});
  function tick(now){
   if(!alive)return;
   const elapsed=now-start,tracked=callbacks.current.getProgress?.();
   // The mobile fallback has no WebGL resource group to register.
   const scene=tracked==null?(elapsed>350?1:0):Math.min(1,Math.max(0,tracked));
   const complete=artReady&&fontReady&&scene>=1;
   const next=Math.min(complete?100:99,Math.floor(scene*80+(artReady?15:0)+(fontReady?5:0)));
   if(next>last){last=next;setProgress(next)}
   if(complete&&finishedAt==null){finishedAt=now;setReady(true)}
   if(elapsed>10000&&!complete)setSlow(true);
   if(elapsed>6000||exit.current||(!preview.current&&finishedAt!=null&&elapsed>=1200&&now-finishedAt>=250)){
    if(exitAt==null){exitAt=now;setLeaving(true)}
    const phase=Math.min(1,(now-exitAt)/(reduced?100:650));
    const p=callbacks.current.params;
    callbacks.current.onTick?.(phase*((p.spiralDelay??.9)+(p.spiralDur??2.2)));
    if(phase>=1){callbacks.current.onDone?.();return}
   }else callbacks.current.onTick?.(-1);
   frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
  return()=>{alive=false;cancelAnimationFrame(frame);document.body.classList.remove('pq-is-loading');siblings.forEach(([el,inert])=>{el.inert=inert})};
 },[]);
 const enter=()=>{exit.current=true;const url=new URL(location.href);url.searchParams.delete('loader-preview');history.replaceState(history.state,'',url)};
 return hs('section',{ref:root,className:'pq-loader'+(leaving?' is-leaving':''),'aria-label':"Preparing Konnect",'aria-busy':!ready,children:[
  hs('header',{className:'pq-loader-header',children:[hs('div',{className:'pq-loader-brand',children:[h(Mark,{}),hs('span',{children:["KONNECT",h('br',{}),"STUDIO"]})]}),h('span',{className:'pq-loader-edition',children:"CREATIVE DIRECTION. DIGITAL PRESENCE."})]}),
  hs('div',{className:'pq-loader-main',children:[
   hs('div',{className:'pq-loader-copy',children:[h('p',{className:'pq-loader-eyebrow',children:"A NEW CONNECTION IS ON ITS WAY"}),hs('h2',{children:["Connecting",h('br',{}),'your ',h('em',{children:"ideas."})]}),h('p',{className:'pq-loader-intro',children:"Creative direction. Digital presence. A world built around your brand."}),hs('div',{className:'pq-loader-note','aria-hidden':true,children:[h('span',{children:'✦'}),h('span',{children:"A clear idea is where we start."})]})]}),
   hs('div',{className:'pq-loader-gallery','aria-hidden':true,children:[h('div',{className:'pq-loader-orbit'}),...CAST.map((c,i)=>hs('div',{className:'pq-loader-portrait pq-loader-portrait-'+i,style:{'--arrival':i*90+'ms'},children:[hs('div',{className:'pq-loader-card-top',children:[h('span',{children:"KONNECT STUDY"}),h('span',{children:c.number})]}),h('div',{className:'pq-loader-arch'}),h('img',{src:window.__grailAsset('/heroes/'+c.hero+'.webp'),alt:'',decoding:'async',width:1024,height:1536}),hs('div',{className:'pq-loader-identity',children:[h('strong',{children:c.name}),h('span',{children:c.role})]})]},c.hero)),hs('div',{className:'pq-loader-caption',children:[h('span',{children:"ORIGINAL KONNECT STUDIES"}),h('span',{children:"VISION MEDIA"})]})]})
  ]}),
  hs('footer',{className:'pq-loader-footer',children:[
   hs('div',{className:'pq-loader-progress-head',children:[h('span',{role:'status','aria-live':'polite',children:slow&&!ready?'Taking a little longer…':ready?"Your studio is ready.":"Preparing the studio…"}),hs('span',{className:'pq-loader-percentage','aria-hidden':true,children:[String(progress).padStart(2,'0'),h('small',{children:' / 100'})]})]}),
   h('div',{className:'pq-loader-track',role:'progressbar','aria-label':"Loading Konnect",'aria-valuemin':0,'aria-valuemax':100,'aria-valuenow':progress,children:Array.from({length:6},(_,i)=>h('span',{children:h('i',{style:{transform:'scaleX('+Math.max(0,Math.min(1,(progress-i*100/6)/(100/6)))+')'}})},i))}),
   hs('div',{className:'pq-loader-footnote',children:[h('span',{children:"SOCIAL · DESIGN · SEARCH · CAMPAIGNS"}),(preview.current&&ready)||slow?h('button',{type:'button',onClick:enter,children:ready?"Enter the studio":"Continue to the site"}):h('span',{children:ready?"Let’s make a connection.":"Creative ideas, coming together."})]})
  ]})
 ]});
}
