import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { smokeFragment } from './smoke-field.js';

gsap.registerPlugin(ScrollTrigger);

// One low-resolution GPU field is shared by the visible chapter canvases.
// Each canvas is behind its chapter content, never over type or card artwork.
export function mountSmoke() {
  const root = document.getElementById('root');
  if (!root || window.konnectStatic) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || navigator.connection?.saveData) return () => {};
  const selector = '[class*="_hero_"],[class*="_section2_"],[class*="_section3_"],[class*="_section5_"],.pq-feature,.konnect-slideshow,.pq-magic,.pq-world';
  const entries = new Map();
  let renderer, program, mesh, frame = 0, previous = 0, time = 12, disposed = false;
  try {
    renderer = new Renderer({ alpha:true, premultipliedAlpha:false, antialias:false, depth:false, dpr:1 });
    program = new Program(renderer.gl, {
      vertex:'attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}',
      fragment:smokeFragment,
      uniforms:{uResolution:{value:[640,400]},uTime:{value:time}},
      transparent:false,depthTest:false,depthWrite:false,
    });
    if (!renderer.gl.getProgramParameter(program.program,renderer.gl.LINK_STATUS)) throw Error('Smoke shader failed to link');
    mesh = new Mesh(renderer.gl,{geometry:new Triangle(renderer.gl),program});
    renderer.gl.clearColor(0,0,0,0);
  } catch {
    renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
    return () => {};
  }
  const tick = now => {
    frame = 0;
    if(disposed || document.hidden || reduce.matches) return;
    if(now-previous >= 1000/24) {
      time += Math.min((now-previous)/1000,.08);previous=now;
      const visible = [...entries.values()].filter(e=>e.visible);
      if(visible.length) {
        const width = Math.min(innerWidth,800), height = Math.round(width*innerHeight/innerWidth);
        if(renderer.width!==width || renderer.height!==height) renderer.setSize(width,height);
        program.uniforms.uResolution.value=[width,height];program.uniforms.uTime.value=time;
        renderer.render({scene:mesh});
        for(const e of visible){
          if(e.canvas.width!==width || e.canvas.height!==height){e.canvas.width=width;e.canvas.height=height;}
          e.ctx.clearRect(0,0,width,height);e.ctx.drawImage(renderer.gl.canvas,0,0);
        }
      }
    }
    if([...entries.values()].some(e=>e.visible)) frame=requestAnimationFrame(tick);
  };
  const wake=()=>{if(!frame && !disposed && !document.hidden && !reduce.matches){previous=performance.now();frame=requestAnimationFrame(tick);}};
  const visibility=new IntersectionObserver(changes=>{for(const c of changes){const e=entries.get(c.target);if(e)e.visible=c.isIntersecting;}wake();});
  const discover=()=>{
    for(const [section,e] of entries) if(!section.isConnected){visibility.unobserve(section);e.tween?.scrollTrigger?.kill();e.tween?.revert();entries.delete(section);}
    for(const section of root.querySelectorAll(selector)){
      if(entries.has(section))continue;
      const canvas=document.createElement('canvas');canvas.className='konnect-smoke';canvas.setAttribute('aria-hidden','true');
      const ctx=canvas.getContext('2d');if(!ctx)continue;
      section.classList.add('has-konnect-smoke');section.prepend(canvas);
      const entry={canvas,ctx,visible:false};entries.set(section,entry);visibility.observe(section);
      if(section.matches('.pq-feature')){
        // The feature has an authored sticky runway. Anchor to the next chapter,
        // not its unpinned height, so red holds until the deck actually arrives.
        entry.tween=gsap.fromTo(section,{'--smoke-red':1},{'--smoke-red':0,ease:'none',scrollTrigger:{trigger:root.querySelector('#konnect-slideshow') || section,start:'top 100%',end:'top 20%',scrub:.7,invalidateOnRefresh:true}});
      }
    }
  };
  const observer=new MutationObserver(discover);observer.observe(root,{childList:true,subtree:true});discover();
  document.addEventListener('visibilitychange',wake);
  const lost=()=>dispose();renderer.gl.canvas.addEventListener('webglcontextlost',lost);
  const dispose=()=>{
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();
    document.removeEventListener('visibilitychange',wake);reduce.removeEventListener('change',dispose);
    for(const [section,e] of entries){e.tween?.scrollTrigger?.kill();e.tween?.revert();e.canvas.remove();section.classList.remove('has-konnect-smoke');}
    entries.clear();renderer.gl.canvas.removeEventListener('webglcontextlost',lost);
    mesh.geometry.remove();program.remove();renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
  reduce.addEventListener('change',dispose);
  return dispose;
}
