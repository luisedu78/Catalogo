
// Mobile hamburger (reuse)
const hb = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
hb?.addEventListener('click', ()=> menu.style.display = (menu.style.display==='block'?'none':'block') );
document.addEventListener('click', (e)=>{ if(menu && !menu.contains(e.target) && !hb.contains(e.target)) menu.style.display='none'; });

/* HERO horizontal slider with auto + arrows + dots + drag */
(function(){
  const track = document.getElementById('heroTrack');
  const slides = Array.from(track?.children || []);
  const dotsWrap = document.getElementById('heroDots');
  const prev = document.querySelector('.hero-prev');
  const next = document.querySelector('.hero-next');
  if(!track || !slides.length) return;

  // dots
  slides.forEach((_,i)=>{
    const d = document.createElement('div');
    d.className = 'hero-dot' + (i===0?' active':'');
    d.addEventListener('click', ()=> go(i));
    dotsWrap.appendChild(d);
  });
  function setDot(i){
    Array.from(dotsWrap.children).forEach((el,idx)=> el.classList.toggle('active', idx===i));
  }

  function indexFromScroll(){
    return Math.round(track.scrollLeft / track.clientWidth);
  }
  function go(i){
    track.scrollTo({left: i * track.clientWidth, behavior:'smooth'});
    setDot(i);
  }

  // arrows
  prev.addEventListener('click', ()=> go(Math.max(0, indexFromScroll()-1)));
  next.addEventListener('click', ()=> go(Math.min(slides.length-1, indexFromScroll()+1)));

  // drag / swipe
  let isDown=false, startX=0, startLeft=0;
  track.addEventListener('pointerdown', e=>{ isDown=true; startX=e.clientX; startLeft=track.scrollLeft; track.setPointerCapture(e.pointerId); stopAuto(); });
  track.addEventListener('pointermove', e=>{ if(!isDown) return; track.scrollLeft = startLeft - (e.clientX - startX); });
  track.addEventListener('pointerup', ()=>{ isDown=false; startAuto(); });

  // update dots on scroll
  let raf=null;
  track.addEventListener('scroll', ()=>{
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=> setDot(indexFromScroll()));
  });

  // auto-advance
  let timer=null;
  function startAuto(){ timer = setInterval(()=>{
    const i = indexFromScroll();
    const nextIndex = (i+1)%slides.length;
    go(nextIndex);
  }, 5000); }
  function stopAuto(){ if(timer){ clearInterval(timer); timer=null; } }
  startAuto();
  window.addEventListener('blur', stopAuto);
  window.addEventListener('focus', ()=> !timer && startAuto());
})();

/* Destaques (cards) carousel with arrows + dots + drag (from v3) */
(function(){
  const wrap = document.querySelector('.cards');
  const dots = document.querySelector('.dots');
  if(!window.PRODUCTS || !wrap || !dots) return;
  const items = window.PRODUCTS.slice(0,5);
  items.forEach(p=>{
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `<img src="${p.img}" alt="${p.nome}"><h3>${p.nome}</h3><p>${p.desc}</p>`;
    wrap.appendChild(card);
  });
  const pages = Math.max(1, Math.ceil(items.length / 3));
  for(let i=0;i<pages;i++){
    const d=document.createElement('div'); d.className='dot' + (i===0?' active':''); dots.appendChild(d);
    d.addEventListener('click', ()=>{ wrap.scrollTo({left: wrap.clientWidth*i, behavior:'smooth'}); setActive(i); });
  }
  function setActive(i){ Array.from(dots.children).forEach((el,idx)=>el.classList.toggle('active', idx===i)); }
  function detectActive(){ const i = Math.round(wrap.scrollLeft / wrap.clientWidth); setActive(i); }
  wrap.addEventListener('scroll',()=>{ window.requestAnimationFrame(detectActive); });
  document.querySelector('.c-prev')?.addEventListener('click', ()=> wrap.scrollBy({left: -wrap.clientWidth, behavior:'smooth'}));
  document.querySelector('.c-next')?.addEventListener('click', ()=> wrap.scrollBy({left: wrap.clientWidth, behavior:'smooth'}));
  // drag
  let isDown=false, startX=0, startLeft=0;
  wrap.addEventListener('pointerdown', e=>{ isDown=true; startX=e.clientX; startLeft=wrap.scrollLeft; wrap.setPointerCapture(e.pointerId); });
  wrap.addEventListener('pointermove', e=>{ if(!isDown) return; wrap.scrollLeft = startLeft - (e.clientX - startX); });
  wrap.addEventListener('pointerup', ()=>{ isDown=false; });
})();
