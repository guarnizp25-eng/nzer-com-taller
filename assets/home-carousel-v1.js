/* NZER Inicio — carrusel de cuatro servicios, intervalo 5 segundos */
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
 const interval=5000;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=0,timer=null;
 function show(index,announce){
  active=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>{
   const visible=i===active;
   slide.classList.toggle('is-active',visible);
   slide.setAttribute('aria-hidden',String(!visible));
   if('inert' in slide)slide.inert=!visible;
   slide.querySelectorAll('a').forEach(a=>{if(visible)a.removeAttribute('tabindex');else a.setAttribute('tabindex','-1')});
  });
  dots.forEach((dot,i)=>{
   dot.setAttribute('aria-current',String(i===active));
   dot.setAttribute('aria-label','Mostrar '+slides[i].dataset.n5Slide);
  });
  if(announce&&status)status.textContent='Mostrando: '+slides[active].dataset.n5Slide;
 }
 function stop(){if(timer!==null){window.clearInterval(timer);timer=null}}
 function start(){
  stop();
  if(document.hidden)return;
  timer=window.setInterval(()=>show(active+1,false),interval);
 }
 function navigate(i){show(i,true);start()}
 prev.addEventListener('click',()=>navigate(active-1));
 next.addEventListener('click',()=>navigate(active+1));
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>navigate(i)));
 // La rotación permanece activa aunque el cursor o el foco estén en la franja.
 // Los controles manuales reinician el intervalo para dar tiempo a leer la diapositiva.
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
 show(0,false);
 start();
})();
