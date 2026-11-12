import {n as makeReact,t as makeJSX} from 'grail/jsx-runtime-B4RpOl0S.js';
const {jsx:h,jsxs:hs}=makeJSX();
const {useEffect,useRef}=makeReact();
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};

// Keep the original typesetting as the measuring surface. Only the visible ink
// travels through space, so the section and every following chapter stay put.
export function PocketSpiralText({lines,className,lineClassName}){
 const root=useRef(null);
 useEffect(()=>{
  const el=root.current,section=el.closest('section');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let glyphs=[],frame=0,active=false,alive=true,dirty=true,width=0,height=0,current=null,lastTime=0;
  function measure(){
   el.classList.remove('is-measured');
   const bounds=el.getBoundingClientRect();width=bounds.width;height=innerHeight;
   glyphs=[];
   el.querySelectorAll('.pq-spiral-word').forEach(word=>{
    const base=word.querySelector('.pq-spiral-base'),text=base.firstChild,box=word.getBoundingClientRect();
    const row=Number(word.closest('[data-spiral-row]').dataset.spiralRow);
    const range=document.createRange();
    [...word.querySelectorAll('.pq-spiral-glyph')].forEach((ink,i)=>{
     range.setStart(text,i);range.setEnd(text,i+1);
     const rect=range.getBoundingClientRect(),x=rect.left-box.left;
     ink.style.left=x+'px';
     glyphs.push({ink,row,x:rect.left-bounds.left+rect.width/2,local:rect.width/2});
    });
   });
   el.classList.add('is-measured');dirty=false;
  }
  function paint(p){
   const mobile=width<769,radius=width*(mobile?.72:.43),pitch=width*(mobile?.075:.047);
   let moving=false;
   for(const {ink,row,x,local} of glyphs){
    const entrance=1-smooth(.12+row*.018,.49+row*.018,p);
    const departure=smooth(.63+row*.012,.98,p);
    const amount=motion.matches?0:Math.max(entrance,departure);
    moving ||= amount>.001;
    const turn=entrance*4.65-departure*3.7;
    const bend=(x-width*.5)/radius;
    const angle=turn+bend;
    // A helical ribbon: angular motion shares its radius with depth and pitch.
    const orbitX=width*.5+Math.sin(angle)*radius;
    const dx=(orbitX-x)*amount;
    const dy=(Math.sin(turn)*pitch*2.5+bend*pitch+((row-1.5)*pitch*.3))*amount;
    const z=((Math.cos(angle)-1)*radius*.78+Math.sin(turn)*radius*.16)*amount;
    const yaw=angle*amount;
    const roll=Math.sin(turn)*8*amount;
    ink.style.transform=`translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,${z.toFixed(2)}px) rotateY(${yaw.toFixed(4)}rad) rotateZ(${roll.toFixed(2)}deg)`;
    ink.style.transformOrigin=local+'px 50%';
    ink.style.opacity=String(1-amount*(.64*(1-Math.max(0,Math.cos(angle)))));
   }
   el.classList.toggle('is-moving',active&&moving);
   el.dataset.spiralProgress=p.toFixed(3);
  }
  function tick(now){
   frame=0;if(!alive||document.hidden)return;
   if(dirty)measure();
   const rect=section.getBoundingClientRect();
   const target=clamp((height-rect.top)/(height+rect.height));
   const dt=Math.min(50,now-(lastTime||now));lastTime=now;
   current=current==null||motion.matches?target:current+(target-current)*(1-Math.exp(-dt/65));
   if(Math.abs(target-current)<.0002)current=target;
   paint(current);
   if(active&&Math.abs(target-current)>.0002)frame=requestAnimationFrame(tick);
  }
  function wake(){if(alive&&!frame&&(active||dirty))frame=requestAnimationFrame(tick)}
  function resize(){dirty=true;current=null;wake()}
  const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;el.classList.toggle('is-moving',active&&!motion.matches);if(active)wake();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'20% 0px'});
  const resizeObserver=new ResizeObserver(resize);
  observer.observe(section);resizeObserver.observe(el);
  window.addEventListener('scroll',wake,{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',wake);
  motion.addEventListener('change',resize);
  document.fonts.ready.then(()=>{if(alive)resize()});
  wake();
  return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();window.removeEventListener('scroll',wake);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',wake);motion.removeEventListener('change',resize)};
 },[]);
 return h('div',{ref:root,className:className+' pq-text-spiral','aria-hidden':true,children:lines.map((line,i)=>h('div',{className:lineClassName+' pq-spiral-line',style:{marginLeft:line.ml},'data-spiral-row':i,children:line.t.split(' ').flatMap((word,j)=>[
  hs('span',{className:'pq-spiral-word',children:[h('span',{className:'pq-spiral-base',children:word}),h('span',{className:'pq-spiral-ink',children:[...word].map((letter,k)=>h('span',{className:'pq-spiral-glyph',children:letter},k))})]},j), ' '
 ])},i))});
}
