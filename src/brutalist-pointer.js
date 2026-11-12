(() => {
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 if(!fine.matches)return;
 const pointer=document.createElement('div');pointer.className='konnect-pointer';pointer.setAttribute('aria-hidden','true');document.body.append(pointer);
 const move=event=>{
  const field=event.target.closest('input,textarea,select,[contenteditable=true]');
  pointer.hidden=!!field;document.documentElement.classList.toggle('konnect-cursor-ready',!field);
  pointer.style.left=event.clientX+'px';pointer.style.top=event.clientY+'px';
  pointer.classList.toggle('is-action',!!event.target.closest('a,button,[role=button]'));
 };
 window.addEventListener('pointermove',move,{passive:true});
 window.addEventListener('pointerdown',()=>pointer.classList.add('is-pressed'),{passive:true});
 window.addEventListener('pointerup',()=>pointer.classList.remove('is-pressed'),{passive:true});
 document.addEventListener('pointerleave',()=>{pointer.hidden=true;document.documentElement.classList.remove('konnect-cursor-ready')});
 window.addEventListener('blur',()=>{pointer.hidden=true;document.documentElement.classList.remove('konnect-cursor-ready')});
})();
