(() => {
  const root = document.getElementById('root');
  const fallback = document.getElementById('konnect-fallback');
  const dialog = document.getElementById('konnect-contact');
  let opener;
  const open = () => { opener=document.activeElement; if (!dialog.open) dialog.showModal(); dialog.querySelector('.konnect-close').focus(); };
  window.addEventListener('pocket-play', open);
  dialog.querySelector('.konnect-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>opener?.focus());
  if (location.hash==='#studio-contact' || new URLSearchParams(location.search).has('enquiry_state') || new URLSearchParams(location.search).has('enquiry_sent')) open();
  const nav=document.createElement('nav');nav.className='konnect-links';nav.setAttribute('aria-label','Main navigation');
  for (const [label,url] of [['Work','/work/'],['Services','/services/'],['Studio','/about/'],['Contact','/contact/']]) {const a=document.createElement('a');a.href=url;a.textContent=label;nav.append(a)}
  document.body.prepend(nav);
  const skip=document.createElement('a');skip.className='konnect-skip';skip.href='#konnect-contact-title';skip.textContent='Skip to enquiry';skip.addEventListener('click',event=>{event.preventDefault();open()});document.body.prepend(skip);
  matchMedia('(max-width:768px)').addEventListener('change',()=>location.reload());
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>location.reload());
  const staticMode=new URLSearchParams(location.search).has('static') || matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData;
  if(staticMode){window.konnectStatic=true;document.documentElement.classList.add('konnect-static');return}
  const observer=new MutationObserver(()=>{if(root.querySelector('h1')){document.documentElement.classList.add('konnect-ready');fallback.inert=true;observer.disconnect()}});
  observer.observe(root,{childList:true,subtree:true});
  window.addEventListener('error',event=>{if(event.filename?.includes('/pocket/')){document.documentElement.classList.remove('konnect-ready');document.documentElement.classList.add('konnect-static');fallback.inert=false}});
})();
