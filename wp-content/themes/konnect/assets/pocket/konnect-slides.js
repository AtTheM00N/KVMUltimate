import {n as makeReact,t as makeJSX} from 'grail/jsx-runtime-B4RpOl0S.js';
const {jsx:h,jsxs:hs}=makeJSX();
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
 h('div',{className:'konnect-slide-track',children:items.map(([title,symbol,copy],i)=>hs('article',{className:'konnect-slide',children:[
 h('div',{className:'konnect-slide-symbol',children:h('img',{src:'/wp-content/themes/konnect/assets/studio/'+symbol+(i%2===0?'-on-red':'')+'.svg',alt:'',width:512,height:512})}),
 hs('div',{className:'konnect-slide-copy',children:[h('h3',{children:i<4?(overrides[i+'_heading']||title):title}),h('p',{children:i<4?(overrides[i+'_copy']||copy):i===4?(chapters.process?.copy||chapters.process?.heading||copy):(chapters.studio?.copy||copy)})]})
 ]},symbol))})
 ]});
}
