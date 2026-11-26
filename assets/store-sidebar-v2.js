/* NZER STORE: panel lateral responsive y filtros sincronizados con catálogo. */
(()=>{
'use strict';
function setup(){
 const sidebar=document.getElementById('nzstoreFilters'),open=document.getElementById('nzstoreOpenFilters'),close=document.getElementById('nzstoreCloseFilters');
 if(!sidebar||!open)return;
 const checkboxes=[...sidebar.querySelectorAll('input[type="checkbox"]:not(:disabled)')];
 const badge=document.getElementById('nzstoreFilterBadge');
 const sync=()=>{
   const total=checkboxes.filter(x=>x.checked).length;
   if(badge){badge.textContent=total;badge.hidden=!total;}
   if(typeof renderShop==='function')renderShop();
 };
 const toggle=show=>{
   sidebar.classList.toggle('is-open',show);
   open.setAttribute('aria-expanded',String(show));
   if(show)close?.focus();
   else if(window.matchMedia('(max-width:760px)').matches)open.focus();
 };
 open.addEventListener('click',()=>toggle(true));
 close?.addEventListener('click',()=>toggle(false));
 sidebar.querySelector('#nzstoreApplyFilters')?.addEventListener('click',()=>toggle(false));
 sidebar.querySelector('#nzstoreClearFilters')?.addEventListener('click',()=>{checkboxes.forEach(x=>x.checked=false);sync();});
 checkboxes.forEach(x=>x.addEventListener('change',sync));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar.classList.contains('is-open'))toggle(false);});
 document.addEventListener('click',e=>{if(sidebar.classList.contains('is-open')&&!sidebar.contains(e.target)&&!open.contains(e.target))toggle(false);});
 const media=window.matchMedia('(min-width:761px)');
 media.addEventListener('change',()=>{if(media.matches){sidebar.classList.remove('is-open');open.setAttribute('aria-expanded','false');}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();