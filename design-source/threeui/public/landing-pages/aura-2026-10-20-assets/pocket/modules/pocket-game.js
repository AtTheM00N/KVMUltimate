(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const dialog=$('pq-game'),board=$('pq-board'),start=$('pq-start'),result=$('pq-result');
  const names=['Knight','Ranger','Bard','Paladin','Mage','Rogue'];
  const heroArt=[
    {role:'The Knight',line:'A small sword. Unshakeable courage.',color:'#b8d1bf',ink:'#375d51',crop:'0 0 1024 1536'},
    {role:'The Ranger',line:'Sharp eyes. A curious kind of magic.',color:'#e0b297',ink:'#754834',crop:'0 0 1024 1536'},
    {role:'The Bard',line:'Big heart. Always one more encore.',color:'#dec88a',ink:'#73592c',crop:'0 0 1024 1536'},
    {role:'The Paladin',line:'A kind heart. Legendary bravery.',color:'#acc7dc',ink:'#39556b',crop:'0 0 1024 1536'},
    {role:'The Mage',line:'A little spell for a perfect match.',color:'#c9b5df',ink:'#5a4777',crop:'0 0 1024 1536'},
    {role:'The Rogue',line:'Quick hands. Even quicker thinking.',color:'#d9b4c3',ink:'#714958',crop:'0 0 1024 1536'}
  ];
  const svgNS='http://www.w3.org/2000/svg';
  const source=path=>window.__grailAsset(path);
  const heroButtons=[...dialog.querySelectorAll('[data-hero]')];
  let cards=[],open=[],matches=0,score=0,combo=0,moves=0,best=0,phase='idle';
  let raf=0,deadline=0,remaining=30000,turn=0,pending=[],paused=false,storageWorks=true,oldOverflow='',lastHud='';
  try {best=Number(localStorage.getItem('pocket-quest-best-v1'))||0;} catch {storageWorks=false;}
  dialog.querySelectorAll('[data-asset]').forEach(img=>img.src=source(img.dataset.asset));
  const later=(fn,ms)=>{const token=turn;const id=setTimeout(()=>{if(token===turn)fn();},ms);pending.push(id);return id;};
  function cancel(){turn++;cancelAnimationFrame(raf);pending.forEach(clearTimeout);pending=[];}
  function bestLabel(){ $('pq-best').textContent='Personal best: '+best.toLocaleString()+' · '+(storageWorks?'Saved on this device':'This session'); }
  function note(text){$('pq-note').textContent=text;}
  function artwork(index){
    const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox',heroArt[index].crop);svg.setAttribute('aria-hidden','true');
    const img=document.createElementNS(svgNS,'image');img.setAttribute('href',source('/heroes/'+names[index].toLowerCase()+'.webp'));img.setAttribute('width','1024');img.setAttribute('height','1536');svg.append(img);return svg;
  }
  function setHero(slug){
    const index=names.findIndex(n=>n.toLowerCase()===slug);if(index<0)return;
    heroButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.hero===slug)));
    const image=dialog.querySelector('.pq-selected-hero');image.setAttribute('viewBox',heroArt[index].crop);image.setAttribute('aria-label','Your champion: '+names[index]);image.querySelector('image').setAttribute('href',source('/heroes/'+slug+'.webp'));
    $('pq-champion-name').textContent=heroArt[index].role;$('pq-champion-line').textContent=heroArt[index].line;
    dialog.style.setProperty('--champion-color',heroArt[index].color);
  }
  heroButtons.forEach((button,index)=>{const label=document.createElement('span');label.textContent=names[index];button.replaceChildren(artwork(index),label);button.setAttribute('aria-label',names[index]);button.addEventListener('click',()=>setHero(button.dataset.hero));});
  window.addEventListener('pocket-hero',event=>setHero(event.detail));
  function hud(){
    const seconds=Math.max(0,Math.ceil(remaining/1000));
    $('pq-time-fill').style.width=(remaining/300)+'%';
    const state=[seconds,score,combo,matches,phase].join(':');if(state===lastHud)return;lastHud=state;
    $('pq-time').textContent='00:'+String(seconds).padStart(2,'0');
    $('pq-time').classList.toggle('is-urgent',seconds<=5&&phase==='playing');
    $('pq-score').textContent=score.toLocaleString();$('pq-combo').textContent='×'+Math.max(1,Math.min(combo,3));
    $('pq-pair-count').textContent=matches+' / 6 pairs';
    [...$('pq-pair-marks').children].forEach((mark,i)=>mark.classList.toggle('is-filled',i<matches));
    [...$('pq-combo-dots').children].forEach((mark,i)=>mark.classList.toggle('is-filled',i<combo));
    dialog.dataset.phase=phase;
    $('pq-phase').textContent=({idle:'READY TO PLAY',preview:'TAKE A PEEK',playing:'ROUND IN PLAY',result:'ROUND COMPLETE'})[phase];
  }
  function expose(index,show){
    const card=cards[index];card.element.classList.toggle('is-face',show);
    card.element.setAttribute('aria-label',show?names[card.hero]+' — card '+(index+1):'Card '+(index+1)+', face down');
  }
  function draw(){
    board.replaceChildren();
    cards.forEach((card,index)=>{
      const button=document.createElement('button');button.type='button';button.className='pq-card';button.disabled=true;
      button.setAttribute('aria-label','Card '+(index+1)+', face down');
      const inner=document.createElement('span');inner.className='pq-card-inner';
      const back=document.createElement('span');back.className='pq-card-back';back.setAttribute('aria-hidden','true');
      back.innerHTML='<svg viewBox="0 0 120 132" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".6"><rect x="7" y="7" width="106" height="118" rx="8"/><path d="M60 13 106 66 60 119 14 66Z"/><ellipse cx="60" cy="66" rx="32" ry="43"/><ellipse cx="60" cy="66" rx="23" ry="32"/><path d="M60 19v16m0 62v16M19 66h13m56 0h13"/></g><path d="M60 42 77 54 72 76 60 86 48 76 43 54Z" fill="#382640" stroke="currentColor" stroke-width=".8"/><path d="m60 50 4.5 11.5L76 66l-11.5 4.5L60 82l-4.5-11.5L44 66l11.5-4.5Z" fill="currentColor"/><g fill="currentColor"><path d="m19 17 1.5 4.5L25 23l-4.5 1.5L19 29l-1.5-4.5L13 23l4.5-1.5Zm82 86 1.5 4.5L107 109l-4.5 1.5-1.5 4.5-1.5-4.5L95 109l4.5-1.5Z"/><circle cx="101" cy="23" r="1.5"/><circle cx="19" cy="109" r="1.5"/></g></svg>';
      const face=document.createElement('span');face.className='pq-card-front';face.setAttribute('aria-hidden','true');
      face.style.setProperty('--face-color',heroArt[card.hero].color);face.style.setProperty('--face-ink',heroArt[card.hero].ink);
      const label=document.createElement('span');label.className='pq-face-label';label.textContent=names[card.hero];
      const check=document.createElement('span');check.className='pq-match-check';check.textContent='✓';face.append(artwork(card.hero),label,check);
      inner.append(back,face);button.append(inner);button.addEventListener('click',()=>flip(index));card.element=button;board.append(button);
    });
  }
  function reset(){
    cancel();phase='idle';paused=false;score=0;combo=0;moves=0;matches=0;open=[];remaining=30000;
    result.hidden=true;board.classList.remove('is-peek');
    cards=Array.from({length:12},(_,i)=>({hero:i%6,matched:false}));
    for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]];}
    draw();hud();bestLabel();start.disabled=false;start.textContent='Start 30-second round';
  }
  function tick(){
    if(phase!=='playing'||paused)return;
    remaining=Math.max(0,deadline-performance.now());hud();
    if(remaining<=0){finish(false);return;}raf=requestAnimationFrame(tick);
  }
  function begin(){
    reset();phase='preview';hud();start.disabled=true;start.textContent='Remember the board…';note('Take a good look. Your thirty seconds start after the preview.');
    board.classList.add('is-peek');cards.forEach((_,i)=>expose(i,true));
    later(()=>{
      board.classList.remove('is-peek');cards.forEach((card,i)=>{expose(i,false);card.element.disabled=false;});
      phase='playing';deadline=performance.now()+30000;start.disabled=false;start.textContent='Restart round';
      note('Find a pair. Keep the combo. Make a little magic.');cards[0].element.focus({preventScroll:true});tick();
    },2400);
  }
  function finish(won){
    if(phase!=='playing')return;
    remaining=Math.max(0,deadline-performance.now());phase='result';cancel();
    cards.forEach((card,i)=>{card.element.disabled=true;expose(i,true);});
    const bonus=won?Math.floor(remaining/1000)*10:0;score+=bonus;const newBest=score>best;
    if(newBest){best=score;try{localStorage.setItem('pocket-quest-best-v1',String(best));}catch{storageWorks=false;}}
    hud();bestLabel();result.hidden=false;
    $('pq-result-label').textContent=newBest?'NEW PERSONAL BEST':won?'BOARD CLEARED':'ROUND COMPLETE';
    $('pq-result-title').textContent=won?'A little victory.':'One more round?';
    $('pq-result-score').textContent=score.toLocaleString();
    $('pq-result-detail').textContent=won?'Six pairs found · '+bonus+' time-bonus points':matches+' of 6 pairs · '+moves+(moves===1?' attempt':' attempts');
    note(won?'All six heroes found. Nicely played.':'A fresh shuffle. A fresh chance.');
    start.textContent='Play again';$('pq-again').focus({preventScroll:true});
  }
  function flip(index){
    if(phase!=='playing'||paused||open.length===2||cards[index].matched||open.includes(index))return;
    remaining=Math.max(0,deadline-performance.now());if(remaining<=0){finish(false);return;}
    expose(index,true);open.push(index);
    if(open.length!==2)return;moves++;
    const [a,b]=open;
    if(cards[a].hero===cards[b].hero){
      combo++;matches++;const points=100*Math.min(combo,3);score+=points;
      for(const id of open){cards[id].matched=true;cards[id].element.classList.add('is-match');cards[id].element.disabled=true;cards[id].element.setAttribute('aria-label',names[cards[id].hero]+' matched');}
      open=[];hud();note(names[cards[a].hero]+' matched! +'+points+' points · '+matches+' / 6 pairs');
      if(matches===6)finish(true);
    }else{
      combo=0;hud();cards[a].element.classList.add('is-miss');cards[b].element.classList.add('is-miss');note('Not quite. Remember them for your next match.');
      later(()=>{for(const id of [a,b]){expose(id,false);cards[id].element.classList.remove('is-miss');}open=[];},760);
    }
  }
  board.addEventListener('keydown',event=>{
    const columns=getComputedStyle(board).gridTemplateColumns.split(" ").length;
    const offsets={ArrowRight:1,ArrowLeft:-1,ArrowDown:columns,ArrowUp:-columns};if(!(event.key in offsets))return;
    const buttons=cards.map(c=>c.element),index=buttons.indexOf(document.activeElement);if(index<0)return;event.preventDefault();
    let next=(index+offsets[event.key]+12)%12;for(let i=0;i<12;i++){if(!buttons[next].disabled){buttons[next].focus();break;}next=(next+1)%12;}
  });
  start.addEventListener('click',begin);$('pq-again').addEventListener('click',begin);
  dialog.querySelector('.pq-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{cancel();phase='idle';document.documentElement.style.overflow=oldOverflow;});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  window.addEventListener('pocket-play',()=>{
    if(dialog.open)return;reset();note('Match all six pairs in 30 seconds. Pick your champion to begin.');
    oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();start.focus({preventScroll:true});
  });
  document.addEventListener('visibilitychange',()=>{
    if(phase!=='playing')return;
    if(document.hidden){remaining=Math.max(0,deadline-performance.now());paused=true;cancelAnimationFrame(raf);}
    else if(paused){paused=false;deadline=performance.now()+remaining;tick();}
  });
  setHero('knight');reset();
})();
