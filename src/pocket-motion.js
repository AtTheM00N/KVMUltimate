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
   const cards=Array.from(slides),state={position:0};
   cards.forEach((card,i)=>gsap.set(card,{zIndex:cards.length-i,x:0,y:0,rotation:0,scale:1,opacity:1}));
   const compose=()=>cards.forEach((card,i)=>{
    const d=i-state.position,depth=Math.min(3,Math.max(0,d)),gone=Math.max(0,-d);
    gsap.set(card,{x:d<0?-gone*section.clientWidth*.9:depth*(innerWidth<600?12:28),y:d<0?gone*36:depth*-12,rotation:d<0?-gone*14:depth*2,scale:1-depth*.035,opacity:d<0?Math.max(0,1-Math.max(0,gone-.65)/.35):d>3?0:1});
   });
   gsap.to(state,{position:cards.length-1,ease:'none',onUpdate:compose,scrollTrigger:{id:'konnect-horizontal',trigger:section,start:'top top',end:()=>'+='+Math.round(innerHeight*(cards.length-1)*.95),pin:true,scrub:.65,invalidateOnRefresh:true,anticipatePin:1,onRefresh:compose}});
   compose();
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
