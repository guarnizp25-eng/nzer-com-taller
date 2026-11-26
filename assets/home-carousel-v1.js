/* NZER Inicio — carrusel continuo: 1 → 2 → 3 → 4 → 1 (cada 5 segundos) */
(() => {
 'use strict';
 const root=document.getElementById('nzerHeroCarousel');
 if(!root)return;
 const slides=Array.from(root.querySelectorAll('[data-n5-slide]'));
 const dots=Array.from(root.querySelectorAll('[data-n5-dot]'));
 const status=document.getElementById('n5CarouselStatus');
 const prev=document.getElementById('n5CarouselPrev');
 const next=document.getElementById('n5CarouselNext');
 if(slides.length!==4||dots.length!==4||!prev||!next)return;

 const DELAY=5000;
 let active=0;
 let timer=null;

 function render(index,announce=false){
  active=((index%slides.length)+slides.length)%slides.length;
  slides.forEach((slide,i)=>{
   const selected=i===active;
   slide.classList.toggle('is-active',selected);
   slide.setAttribute('aria-hidden',String(!selected));
   if('inert' in slide)slide.inert=!selected;
   slide.querySelectorAll('a, button').forEach(a=>{
    if(selected)a.removeAttribute('tabindex');
    else a.setAttribute('tabindex','-1');
   });
  });
  dots.forEach((dot,i)=>{
   dot.setAttribute('aria-current',String(i===active));
   dot.setAttribute('aria-label','Mostrar '+slides[i].dataset.n5Slide);
  });
  if(announce&&status)status.textContent='Mostrando: '+slides[active].dataset.n5Slide;
 }

 function cancel(){
  if(timer!==null){window.clearTimeout(timer);timer=null}
 }
 function schedule(){
  cancel();
  if(document.hidden)return;
  timer=window.setTimeout(()=>{
   timer=null;
   render((active+1)%slides.length);
   schedule(); // Al terminar la cuarta, reinicia automáticamente desde la primera.
  },DELAY);
 }
 function navigate(index){
  render(index,true);
  schedule();
 }

 prev.addEventListener('click',()=>navigate(active-1));
 next.addEventListener('click',()=>navigate(active+1));
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>navigate(i)));
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)cancel();
  else schedule();
 });

 render(0);
 schedule();
})();
