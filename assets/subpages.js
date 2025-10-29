
document.addEventListener('DOMContentLoaded', ()=>{
  const hb = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  hb?.addEventListener('click', ()=> menu.style.display = (menu.style.display==='block'?'none':'block') );
  document.addEventListener('click', (e)=>{ if(menu && !menu.contains(e.target) && !hb.contains(e.target)) menu.style.display='none'; });
});
