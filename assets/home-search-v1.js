/* NZER Inicio — Buscador desplegable de productos, categorías y servicios */
(() => {
 'use strict';
 const root=document.getElementById('nzerSearch');
 const base=root?.dataset.base||'';
 const input=document.getElementById('nzerSearchInput');
 const panel=document.getElementById('nzerSearchPanel');
 const overlay=document.getElementById('nzerSearchOverlay');
 const form=document.getElementById('nzerSearchForm');
 const clear=document.getElementById('nzerSearchClear');
 const close=document.getElementById('nzerSearchClose');
 const container=document.getElementById('nzerSearchSections');
 if(!root||!input||!panel||!overlay||!form||!clear||!close||!container)return;
 const services=[
  {label:'Inicio',hint:'Página principal NZER',href:'index.html',icon:'⌂'},
  {label:'NZER STORE',hint:'Tienda de juguetes didácticos',href:'store/index.html',icon:'🛍️'},
  {label:'Desarrollo infantil',hint:'Nuestros programas',href:'desarrollo-infantil/index.html',icon:'🌱'},
  {label:'NZER CARE',hint:'Cuidado y aprendizaje',href:'care/index.html',icon:'💚'},
  {label:'PSICO NZER',hint:'Atención y orientación psicológica',href:'psico/index.html',icon:'🧠'},
  {label:'Aprende',hint:'Recursos para familias',href:'aprende/index.html',icon:'📚'},
  {label:'Nosotros',hint:'Conoce NZER',href:'nosotros/index.html',icon:'🏡'},
  {label:'Contacto',hint:'Comunícate con nosotros',href:'contacto/index.html',icon:'✉️'}
 ];
 const categories=[
  {label:'Comprar por edades',href:'store/index.html#comprar-por-edades',icon:'👶'},
  {label:'Construcción',href:'store/index.html?category=construccion#catalogo',icon:'🧩'},
  {label:'Carros',href:'store/index.html?category=carros#catalogo',icon:'🚗'},
  {label:'Madera didáctica',href:'store/index.html?category=madera#catalogo',icon:'🌳'}
 ];
 const ages=[
  {label:'0–12 meses',href:'store/index.html?age=0-12#comprar-por-edades'},
  {label:'1–2 años',href:'store/index.html?age=1-2#comprar-por-edades'},
  {label:'2–3 años',href:'store/index.html?age=2-3#comprar-por-edades'},
  {label:'3–5 años',href:'store/index.html?age=3-5#comprar-por-edades'},
  {label:'6–8 años',href:'store/index.html?age=6-8#comprar-por-edades'}
 ];
 const normalize=text=>String(text||'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const productList=typeof NZER_PRODUCTS!=='undefined'?NZER_PRODUCTS:[];
 let open=false;
 const escapeText=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 function links(title,items){
  if(!items.length)return '';
  return '<section class="nzer-search-group"><h3>'+escapeText(title)+'</h3>'+items.map(item=>'<a href="'+base+item.href+'"><span aria-hidden="true">'+(item.icon||'⌕')+'</span><span>'+escapeText(item.label)+'</span></a>').join('')+'</section>';
 }
 function productCards(items){
  if(!items.length)return '';
  return '<section class="nzer-search-group"><h3>Productos sugeridos · precios referenciales</h3>'+items.map(item=>{
   const picture=typeof art!=='undefined'?art[item.id]||'':'';
   return '<a class="nzer-search-result" href="'+base+'store/producto/index.html?id='+encodeURIComponent(item.id)+'">'+
    '<span class="nzer-search-result-art" aria-hidden="true">'+picture+'</span>'+
    '<span class="nzer-search-result-info"><b>'+escapeText(item.name)+'</b><small>S/ '+Number(item.price).toFixed(2)+' · Referencial</small></span></a>';
  }).join('')+'</section>';
 }
 function setOpen(next){
  open=next;
  panel.hidden=!open;
  overlay.hidden=!open;
  root.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('nzer-search-is-open',open);
 }
 function render(){
  const q=normalize(input.value.trim());
  clear.classList.toggle('is-visible',!!q);
  const selectedServices=services.filter(item=>!q||normalize(item.label+' '+item.hint).includes(q)).slice(0,q?5:4);
  const selectedCats=categories.filter(item=>!q||normalize(item.label).includes(q)||normalize(item.label).includes('construccion')&&q==='bloques');
  const selectedAges=ages.filter(item=>q&&(/edad|ano|mes|bebe|pequeno/.test(q)||normalize(item.label).includes(q))).slice(0,5);
  const selectedProducts=productList.filter(item=>!q||normalize(item.name+' '+item.categoryLabel+' '+item.desc).includes(q)).slice(0,q?6:4);
  const left=links(q?'Categorías y servicios':'Búsquedas populares',selectedCats.concat(selectedAges).slice(0,7))+links('Accesos NZER',selectedServices);
  const right=productCards(selectedProducts);
  container.innerHTML= '<div>'+left+'</div><div>'+(right||'<div class="nzer-search-noresults">No hay productos que coincidan con esta búsqueda.</div>')+'</div>';
  if(!left&&!right)container.innerHTML='<p class="nzer-search-noresults">No encontramos resultados. Prueba con construcción, carros, CARE o PSICO.</p>';
 }
 function show(){render();setOpen(true)}
 function hide(){setOpen(false)}
 input.addEventListener('focus',show);
 input.addEventListener('input',show);
 clear.addEventListener('click',()=>{input.value='';input.focus();show()});
 close.addEventListener('click',hide);
 overlay.addEventListener('click',hide);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&open){hide();input.blur();}});
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const first=container.querySelector('a[href]');
  if(first)window.location.href=first.href;
  else show();
 });
})();
