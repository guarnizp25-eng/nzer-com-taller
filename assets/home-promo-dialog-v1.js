/* NZER Inicio: promociones de maqueta (no disponibles) */
(() => {
 'use strict';
 const modal=document.getElementById('n5PromoDialog');
 const close=document.getElementById('n5PromoDialogClose');
 const message=document.getElementById('n5PromoDialogMessage');
 if(!modal||!close||!message)return;
 const names={desarrollo:'Desarrollo Infantil',care:'NZER CARE',psico:'PSICO NZER',store:'NZER STORE'};
 let lastFocus=null;
 function hide(){
  modal.hidden=true;
  document.body.style.overflow='';
  if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus();
 }
 function show(service){
  lastFocus=document.activeElement;
  message.textContent='La promoción de '+(names[service]||'NZER')+' es una demostración del diseño. Todavía no está vigente y no se puede solicitar ni canjear. Cuando aprobemos las campañas reales, este botón permitirá consultar sus condiciones.';
  modal.hidden=false;
  document.body.style.overflow='hidden';
  close.focus();
 }
 document.querySelectorAll('[data-promo-service]').forEach(btn=>
  btn.addEventListener('click',()=>show(btn.dataset.promoService))
 );
 close.addEventListener('click',hide);
 modal.addEventListener('click',e=>{if(e.target===modal)hide()});
 document.addEventListener('keydown',e=>{
  if(modal.hidden)return;
  if(e.key==='Escape'){e.preventDefault();hide()}
  if(e.key==='Tab'){e.preventDefault();close.focus()}
 });
})();
