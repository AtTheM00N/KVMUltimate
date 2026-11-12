/** One native scroll timeline for flat typography, artwork and a shared colour field. */
export function mountScroll(root, gsap, ScrollTrigger) {
  let disposed = false, trigger, resizeObserver, refreshFrame = 0;
  const touched = new Map();
  const cards = [...root.querySelectorAll('.story-project')];
  const interactions = [...cards, ...root.querySelectorAll('.service-words,.hero-actions')];
  const chapters = [...root.querySelectorAll('[data-chapter]')];
  const field = root.querySelector('.scroll-field'), mark = root.querySelector('.scroll-mark');
  const timeline = gsap.timeline({ paused: true });
  function remember(element) {
    if (element && !touched.has(element)) touched.set(element, element.getAttribute('style'));
    return element;
  }
  function restore() {
    for (const [element, value] of touched) {
      if (value === null) element.removeAttribute('style'); else element.setAttribute('style', value);
    }
  }
  function pointers() {
    for (const item of interactions) {
      const pointerEvents = Number(gsap.getProperty(item,'opacity')) > .5 ? 'auto' : 'none';
      for (const link of item.matches('a') ? [item] : item.querySelectorAll('a')) {
        remember(link); link.style.pointerEvents=pointerEvents;
      }
    }
  }
  function measure() {
    if (disposed) return;
    const progress = timeline.progress();
    timeline.clear(); restore();
    for (const chapter of chapters) {
      const body=chapter.querySelector('.chapter-body');
      body.classList.remove('is-tall');
      const content=chapter.querySelector('.chapter-enquiry') || chapter.querySelector('.chapter-lead');
      if (content && chapter.dataset.chapter !== 'services') body.classList.toggle('is-tall',content.scrollHeight>innerHeight*.76);
    }
    const distance = Math.max(1, root.offsetHeight-innerHeight);
    const at = value => Math.max(0,Math.min(.999,value/distance));
    const duration = value => Math.max(.001,value/distance);
    const add = (element, from, to, start, length) => {
      if (!remember(element)) return;
      timeline.fromTo(element,from,{...to,duration:duration(length),ease:'none',immediateRender:false},at(start));
    };
    const enter = (element,start,length=innerHeight*.4,from={y:70,opacity:0}) => {
      if(!element)return;
      remember(element); gsap.set(element,from);
      add(element,from,{x:0,y:0,xPercent:0,rotation:0,scale:1,opacity:1},start,length);
    };
    const exit = (element,start,length=innerHeight*.3,to={y:-65,opacity:0}) => {
      if(!remember(element))return;
      timeline.to(element,{...to,duration:duration(length),ease:'none'},at(start));
    };
    remember(field); remember(mark);
    gsap.set(field,{xPercent:0,yPercent:76,rotation:0,scale:1});
    gsap.set(mark,{xPercent:0,yPercent:0,scale:1,rotation:0,opacity:.8});
    const paint = (top,values,markValues={}) => {
      timeline.to(field,{...values,duration:duration(innerHeight*.75),ease:'none'},at(top-innerHeight*.6));
      timeline.to(mark,{...markValues,duration:duration(innerHeight*.8),ease:'none'},at(top-innerHeight*.6));
    };
    for (const chapter of chapters) {
      const top=chapter.offsetTop, length=chapter.offsetHeight;
      const lead=chapter.querySelector('.chapter-lead:not(.screen-reader-text)');
      switch(chapter.dataset.chapter) {
        case 'intro': {
          remember(lead); gsap.set(lead,{opacity:1,xPercent:0,scale:1});
          exit(lead,innerHeight*.18,innerHeight*.9,{xPercent:-28,scale:1.32,opacity:0});
          exit(chapter.querySelector('.hero-actions'),innerHeight*.4,innerHeight*.45,{y:30,opacity:0});
          break;
        }
        case 'work': {
          paint(top,{xPercent:36,yPercent:0,rotation:-8,scale:1.3},{xPercent:-55,yPercent:5,rotation:12,scale:1.2,opacity:.5});
          enter(lead,top-innerHeight*.45,innerHeight*.4,{x:-100,opacity:0});
          const projects=[...chapter.querySelectorAll('.story-project')];
          const hold=Math.max(innerHeight*.6,(length-innerHeight)/Math.max(1,projects.length));
          projects.forEach((project,index)=>{
            const start=top+index*hold-innerHeight*.22;
            project.dataset.focusOffset=String(index*hold);
            enter(project,start,innerHeight*.4,{xPercent:65,rotation:6,opacity:0});
            exit(project,start+hold,innerHeight*.25,{xPercent:-70,rotation:-5,opacity:0});
          });
          break;
        }
        case 'services': {
          chapter.querySelectorAll('[data-service-beat]').forEach((article,index)=>{
            const start=top+index*innerHeight;
            paint(start,{xPercent:index%2 ? 48 : -48,yPercent:0,rotation:index%2 ? -10 : 10,scale:1.2},{xPercent:index%2 ? -65 : 12,rotation:index%2 ? -15 : 15,opacity:.5});
            enter(article.querySelector('.service-words'),start-innerHeight*.45,innerHeight*.55,{x:index%2 ? 180 : -180,opacity:0});
            enter(article.querySelector('.service-poster'),start-innerHeight*.55,innerHeight*.7,{x:index%2 ? -150 : 150,rotation:index%2 ? 14 : -14,scale:.75,opacity:0});
            exit(article.querySelector('.service-words'),start+innerHeight*.6,innerHeight*.4,{x:index%2 ? -130 : 130,opacity:0});
            exit(article.querySelector('.service-poster'),start+innerHeight*.55,innerHeight*.4,{scale:1.15,opacity:0});
          });
          break;
        }
        case 'process': {
          paint(top,{xPercent:0,yPercent:86,rotation:0,scale:1},{xPercent:-20,yPercent:30,rotation:0,opacity:.35});
          chapter.querySelectorAll('.story-process span').forEach((word,index)=>enter(word,top-innerHeight*.55+index*innerHeight*.2,innerHeight*.55,{x:index%2 ? 200 : -200,opacity:0}));
          break;
        }
        case 'studio': {
          paint(top,{xPercent:0,yPercent:0,rotation:0,scale:1.05},{xPercent:-45,yPercent:5,rotation:-12,scale:1.6,opacity:.3});
          enter(lead,top-innerHeight*.5,innerHeight*.6,{scale:.76,y:55,opacity:0});
          break;
        }
        case 'contact': {
          paint(top,{xPercent:0,yPercent:96,rotation:0,scale:1},{xPercent:30,yPercent:0,rotation:0,scale:1,opacity:.15});
          enter(lead,top-innerHeight*.4,innerHeight*.4,{x:-80,opacity:0});
          // The form is ordinary HTML and settles before the visitor reaches it.
          enter(chapter.querySelector('.chapter-enquiry'),top-innerHeight*.45,innerHeight*.4,{opacity:0});
          break;
        }
      }
    }
    // Keep the animation's duration normalized even when the final beat ends early.
    timeline.to({value:0},{value:1,duration:1,ease:'none'},0);
    timeline.progress(progress,true); pointers();
  }
  function focus(event) {
    const chapter=event.target.closest('[data-chapter]'); if(!chapter)return;
    const card=event.target.closest('.story-project');
    const service=event.target.closest('[data-service-beat]');
    const item=card || service?.querySelector('.service-words') || chapter.querySelector('.chapter-lead');
    const box=event.target.getBoundingClientRect();
    if((item && Number(gsap.getProperty(item,'opacity'))<.8) || box.top<80 || box.bottom>innerHeight){
      const serviceIndex=service ? [...chapter.querySelectorAll('[data-service-beat]')].indexOf(service) : 0;
      const offset=Number(card?.dataset.focusOffset || serviceIndex*innerHeight);
      window.scrollTo({top:root.getBoundingClientRect().top+scrollY+chapter.offsetTop+offset+innerHeight*.22,behavior:'instant'});
      trigger.update(); trigger.getTween()?.progress(1);
    }
  }
  function refresh() {
    if(disposed || refreshFrame)return;
    refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;if(!disposed)ScrollTrigger.refresh();});
  }
  function cleanup() {
    if(disposed)return; disposed=true;
    cancelAnimationFrame(refreshFrame); resizeObserver?.disconnect();
    trigger?.kill(); timeline.kill(); restore();
    root.removeEventListener('focusin',focus); window.removeEventListener('resize',refresh);
    root.querySelectorAll('img').forEach(image=>image.removeEventListener('load',refresh));
    root.classList.remove('is-scroll'); root.dataset.sceneState='static';
    chapters.forEach(chapter=>chapter.querySelector('.chapter-body').classList.remove('is-tall'));
    cards.forEach(card=>delete card.dataset.focusOffset);
  }
  try {
    root.classList.add('is-scroll'); measure();
    trigger=ScrollTrigger.create({trigger:root,start:'top top',end:'bottom bottom',animation:timeline,scrub:.65,invalidateOnRefresh:true,onRefreshInit:measure,onUpdate:pointers});
    root.addEventListener('focusin',focus); window.addEventListener('resize',refresh,{passive:true});
    resizeObserver=new ResizeObserver(refresh); resizeObserver.observe(root);
    root.querySelectorAll('img').forEach(image=>image.addEventListener('load',refresh,{once:true}));
    document.fonts?.ready.then(refresh);
    root.dataset.sceneState='ready'; ScrollTrigger.refresh();
    const destination=location.hash && document.getElementById(location.hash.slice(1));
    if(destination && root.contains(destination))destination.scrollIntoView({behavior:'instant',block:'start'});
  } catch(error) { cleanup(); throw error; }
  return cleanup;
}
