import {n as makeReact,t as makeJSX} from 'grail/jsx-runtime-B4RpOl0S.js';
const {jsx:h,jsxs:hs}=makeJSX();
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
