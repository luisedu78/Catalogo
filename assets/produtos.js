
const $ = s=>document.querySelector(s);
const $$ = s=>Array.from(document.querySelectorAll(s));

function money(v){ return 'R$ ' + v.toFixed(2).replace('.',','); }

function render(list){
  const grid = $('#grid'); grid.innerHTML='';
  list.forEach(p=>{
    const el = document.createElement('article');
    el.className='card';
    el.innerHTML = `<img src="${p.img}" alt="${p.nome}">
      <h3>${p.nome}</h3><p>${p.desc}</p><p><strong>${money(p.preco)}</strong></p>`;
    grid.appendChild(el);
  });
  $('#count').textContent = `${list.length} produto${list.length===1?'':'s'}`;
}

const state = {tipo:new Set(), marca:new Set(), min:null, max:null, q:''};

function apply(){
  let list = window.PRODUCTS.slice();
  if(state.q){
    const q = state.q.toLowerCase();
    list = list.filter(p => (p.nome+' '+p.desc+' '+p.tipo+' '+p.marca).toLowerCase().includes(q));
  }
  if(state.tipo.size) list = list.filter(p => state.tipo.has(p.tipo));
  if(state.marca.size) list = list.filter(p => state.marca.has(p.marca));
  if(state.min!=null) list = list.filter(p => p.preco >= state.min);
  if(state.max!=null) list = list.filter(p => p.preco <= state.max);
  render(list);
}

function init(){
  render(window.PRODUCTS);

  // build filters
  const tipos = [...new Set(window.PRODUCTS.map(p=>p.tipo))];
  const marcas = [...new Set(window.PRODUCTS.map(p=>p.marca))];
  const tipoBox = $('#tipoBox'), marcaBox = $('#marcaBox');
  tipos.forEach(t=>{
    const id='t-'+t.replace(/\s+/g,'-');
    tipoBox.insertAdjacentHTML('beforeend', `<label class="chk"><input id="${id}" type="checkbox" value="${t}"><span>${t}</span></label>`);
  });
  marcas.forEach(m=>{
    const id='m-'+m.replace(/\s+/g,'-');
    marcaBox.insertAdjacentHTML('beforeend', `<label class="chk"><input id="${id}" type="checkbox" value="${m}"><span>${m}</span></label>`);
  });

  tipoBox.addEventListener('change', e=>{
    if(e.target.type==='checkbox'){ const v=e.target.value; e.target.checked?state.tipo.add(v):state.tipo.delete(v); apply(); }
  });
  marcaBox.addEventListener('change', e=>{
    if(e.target.type==='checkbox'){ const v=e.target.value; e.target.checked?state.marca.add(v):state.marca.delete(v); apply(); }
  });

  $('#applyPrice').addEventListener('click', ()=>{
    const min = parseFloat($('#min').value); const max = parseFloat($('#max').value);
    state.min = Number.isFinite(min)?min:null; state.max = Number.isFinite(max)?max:null; apply();
  });

  $('#q').addEventListener('input', e=>{ state.q=e.target.value.trim(); apply(); });
}
document.addEventListener('DOMContentLoaded', init);
