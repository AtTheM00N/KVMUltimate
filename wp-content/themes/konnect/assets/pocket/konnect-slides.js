import {n as makeReact,t as makeJSX} from 'grail/jsx-runtime-B4RpOl0S.js';
import {t as createWarp} from 'grail/warpFill-CfnOsA5y.js';
const React=makeReact();
const {jsx:h,jsxs:hs}=makeJSX();
// Reuse the registered ThreeUI shader with the same settled colors as the phone scene.
export function KonnectAtmosphere(){
 const ref=React.useRef(null);
 React.useEffect(()=>{
  const canvas=ref.current;let renderer;
  try{renderer=createWarp(canvas,{transparent:true});}catch{return;}
  const draw=()=>{const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(canvas.clientWidth*ratio);canvas.height=Math.round(canvas.clientHeight*ratio);renderer.draw({origin:[.5,.5],progress:1,noiseAmp:.82,noiseScale:8.5,edge:.01,time:0,bright:[143/255,0,0],base:[0,0,0],deep:[143/255,0,0],backdrop:[0,0,0]});};
  const resize=new ResizeObserver(draw);resize.observe(canvas);draw();
  return()=>{resize.disconnect();renderer.dispose();};
 },[]);
 return h('canvas',{ref,className:'konnect-atmosphere','aria-hidden':true});
}
export function KonnectConnection(){
 const curve='M30 100 C220 100 240 30 400 100 S580 100 770 100';
 return hs('svg',{className:'konnect-signal',viewBox:'0 0 800 200',fill:'none','aria-hidden':true,children:[
 h('path',{d:curve,className:'signal-rail'}),
 h('path',{d:curve,transform:'translate(0 200) scale(1 -1)',className:'signal-rail'}),
 h('path',{d:curve,pathLength:100,className:'signal-pulse signal-out'}),
 h('path',{d:curve,pathLength:100,transform:'translate(0 200) scale(1 -1)',className:'signal-pulse signal-in'}),
 ...[30,770].map(cx=>hs('g',{children:[h('circle',{cx,cy:100,r:13,className:'signal-ring'}),h('circle',{cx,cy:100,r:4,className:'signal-node'})]},cx))]});
}
const items=[
 ['Social','social','Social strategy and content with a point of view.'],
 ['Design','identity','A visual identity built around your brand.'],
 ['Search','search','Help the right people find you.'],
 ['Campaigns','lead','Creative that starts a conversation.'],
 ['Process','process','Understand. Create. Connect.'],
 ['Studio','studio','Different skills. One connected studio.']
];
export function KonnectSlideshow(){
 const chapters=window.konnectContent||{},overrides=chapters.services?.serviceCopy||{};
 return hs('section',{id:'konnect-slideshow',className:'konnect-slideshow','aria-labelledby':'konnect-slideshow-title',children:[
 h('header',{className:'konnect-slide-header',children:h('h2',{id:'konnect-slideshow-title',children:chapters.studio?.heading||'Different skills. One studio.'})}),
 h('div',{className:'konnect-flex-stage','aria-hidden':true}),
 h('div',{className:'konnect-slide-track',children:items.map(([title,symbol,copy],i)=>hs('article',{className:'konnect-slide'+(i===0?' is-current':''),children:[
 h('div',{className:'konnect-slide-symbol',children:h('img',{src:'/wp-content/themes/konnect/assets/studio/'+symbol+'.webp',alt:'Original Konnect Vision Media '+title+' poster study',width:1024,height:1024})}),
 hs('div',{className:'konnect-slide-copy',children:[h('h3',{children:i<4?(overrides[i+'_heading']||title):title}),h('p',{children:i<4?(overrides[i+'_copy']||copy):i===4?(chapters.process?.copy||chapters.process?.heading||copy):(chapters.studio?.copy||copy)})]})
 ]},symbol))})
 ]});
}
