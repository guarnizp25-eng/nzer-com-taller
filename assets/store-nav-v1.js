/* NZER STORE: menú izquierdo y exploración por edades — sin atribuciones no verificadas */
(() => {
'use strict';
const drawer=document.getElementById('nzerStoreDrawer');
const overlay=document.getElementById('nzerStoreOverlay');
const toggle=document.getElementById('nzerStoreMenuToggle');
const close=document.getElementById('nzerStoreDrawerClose');
if(!drawer||!overlay||!toggle||!close)return;
let lastFocus=null;
function isOpen(){return !drawer.hidden}
function openDrawer(){
 lastFocus=document.activeElement;
 drawer.hidden=false;overlay.hidden=false;
 toggle.setAttribute('aria-expanded','true');
 document.body.style.overflow='hidden';
 close.focus();
}
function closeDrawer(){
 drawer.hidden=true;overlay.hidden=true;
 toggle.setAttribute('aria-expanded','false');
 document.body.style.overflow='';
 if(lastFocus&&typeof lastFocus.focus==='function')lastFocus.focus();
}
toggle.addEventListener('click',()=>isOpen()?closeDrawer():openDrawer());
close.addEventListener('click',closeDrawer);
overlay.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{
 if(!isOpen())return;
 if(e.key==='Escape'){e.preventDefault();closeDrawer()}
 if(e.key==='Tab'){
  const focusable=Array.from(drawer.querySelectorAll('a[href],button:not([disabled])'));
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
drawer.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',closeDrawer));
const ageSection=document.getElementById('comprar-por-edades');
const ageResult=document.getElementById('nzerAgeResult');
const ageButtons=Array.from(document.querySelectorAll('[data-nzer-age]'));
function chooseAge(age){
 ageButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.nzerAge===age)));
 if(ageResult){
  ageResult.hidden=false;
  ageResult.textContent='Seleccionaste '+age+'. Aún no tenemos productos con edades certificadas por sus fabricantes para mostrar recomendaciones seguras. Puedes explorar todo el catálogo mientras incorporamos las fichas verificadas.';
 }
 closeDrawer();
 if(ageSection)ageSection.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
ageButtons.forEach(btn=>btn.addEventListener('click',()=>chooseAge(btn.dataset.nzerAge)));
drawer.querySelectorAll('[data-nzer-category]').forEach(btn=>btn.addEventListener('click',()=>{
 const category=btn.dataset.nzerCategory;
 const filter=Array.from(document.querySelectorAll('.filter[data-category]')).find(el=>el.dataset.category===category);
 if(filter)filter.click();
 closeDrawer();
 document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth',block:'start'});
}));
const ageCta=document.getElementById('nzerAgeCta');
ageCta?.addEventListener('click',e=>{
 if(!ageSection)return;
 e.preventDefault();ageSection.scrollIntoView({behavior:'smooth',block:'start'});
});

/* Enlaces entrantes desde el menú corporativo de Inicio */
const params=new URLSearchParams(window.location.search);
const incomingAge={
 '0-12':'0–12 meses','1-2':'1–2 años','2-3':'2–3 años',
 '3-5':'3–5 años','6-8':'6–8 años'
}[params.get('age')];
if(incomingAge){
 // No inventar compatibilidades por edad: solo resaltar la etapa seleccionada.
 ageButtons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.nzerAge===incomingAge)));
 if(ageResult){
  ageResult.hidden=false;
  ageResult.textContent='Seleccionaste '+incomingAge+'. Aún no tenemos productos con edades recomendadas verificadas por sus fabricantes. Puedes explorar todo el catálogo mientras incorporamos las fichas correspondientes.';
 }
}
const incomingCategory=params.get('category');
if(['construccion','carros','madera'].includes(incomingCategory)){
 const filter=Array.from(document.querySelectorAll('.filter[data-category]')).find(btn=>btn.dataset.category===incomingCategory);
 if(filter)filter.click();
}
})();