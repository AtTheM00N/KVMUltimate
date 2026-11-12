import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
let cleanup=()=>{},observer;
function watch(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||window.konnectStatic)return;
 const mount=()=>{
  const section=document.getElementById('konnect-slideshow');if(!section)return;
  observer?.disconnect();
  const track=section.querySelector('.konnect-slide-track'),slides=track.children;
  const context=gsap.context(()=>{
   section.classList.add('is-scroll-driven');
   const cards=Array.from(slides),setters=cards.map(card=>({rotate:gsap.quickSetter(card,'rotationY','deg'),scale:gsap.quickSetter(card,'scale'),y:gsap.quickSetter(card,'y','px')}));
   const distance=()=>cards.at(-1).offsetLeft-cards[0].offsetLeft;
   const compose=()=>{const x=Number(gsap.getProperty(track,'x'));cards.forEach((card,i)=>{const relative=(card.offsetLeft-cards[0].offsetLeft+x)/section.clientWidth;setters[i].rotate(Math.max(-12,Math.min(12,relative*12)));setters[i].scale(1-Math.min(.08,Math.abs(relative)*.08));setters[i].y(Math.min(28,Math.abs(relative)*28));});};
   gsap.to(track,{x:()=>-distance(),ease:'none',onUpdate:compose,scrollTrigger:{id:'konnect-horizontal',trigger:section,start:'top top',end:()=>'+='+Math.round(innerHeight*(slides.length-1)*.95),pin:true,scrub:.8,invalidateOnRefresh:true,anticipatePin:1,onRefresh:compose}});
   const feature=document.querySelector('.pq-feature');
   if(feature)gsap.fromTo(feature,{'--red-exit':0},{'--red-exit':1,ease:'none',scrollTrigger:{trigger:feature.closest('[class*="_peelWrap_"]')||feature,start:'bottom bottom',end:'bottom top',scrub:.8}});
  });
  const refresh=()=>ScrollTrigger.refresh();
  document.fonts.ready.then(refresh);section.querySelectorAll('img').forEach(img=>img.addEventListener('load',refresh,{once:true}));
  window.addEventListener('load',refresh,{once:true});
  cleanup=()=>{window.removeEventListener('load',refresh);context.revert();section.classList.remove('is-scroll-driven');};
  refresh();
 };
 observer=new MutationObserver(mount);observer.observe(document.getElementById('root')||document.body,{childList:true,subtree:true});mount();
}
window.addEventListener('pagehide',()=>{observer?.disconnect();cleanup();});
window.addEventListener('pageshow',event=>{if(event.persisted)watch();});
watch();
