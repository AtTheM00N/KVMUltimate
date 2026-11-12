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
   gsap.to(track,{x:()=>-(track.scrollWidth-section.clientWidth),ease:'none',scrollTrigger:{id:'konnect-horizontal',trigger:section,start:'top top',end:()=>'+='+Math.round(innerHeight*(slides.length-1)*.8),pin:true,scrub:.6,invalidateOnRefresh:true,anticipatePin:1}});
  },section);
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
