/* NZER Aprende · apertura de recursos al seleccionar cada tarjeta */
(()=>{'use strict';
function init(){
 const links=document.querySelectorAll('.nza-card-link[href^="#"]');
 links.forEach(link=>link.addEventListener('click',event=>{
  const target=document.getElementById(link.hash.slice(1));
  if(!target || target.tagName!=='DETAILS')return;
  event.preventDefault();
  target.open=true;
  history.replaceState(null,'',link.hash);
  target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 }));
 if(location.hash.startsWith('#nza-recurso-')){
  const target=document.getElementById(location.hash.slice(1));
  if(target?.tagName==='DETAILS')target.open=true;
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();