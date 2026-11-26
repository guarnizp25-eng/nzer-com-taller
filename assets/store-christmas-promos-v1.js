/* NZER STORE: rotación de cinco creatividades navideñas simuladas */
(()=>{
'use strict';
const start=()=>{
 const root=document.getElementById('nzpromoBanner');
 if(!root)return;
 const slides=[...root.querySelectorAll('[data-nzpromo-slide]')];
 const dots=[...root.querySelectorAll('[data-nzpromo-dot]')];
 const counter=document.getElementById('nzpromoProgress');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer=null;
 function display(n){
  index=(n+slides.length)%slides.length;
  slides.forEach((slide,i)=>{
   const active=i===index;
   slide.classList.toggle('is-active',active);
   slide.setAttribute('aria-hidden',String(!active));
   slide.inert=!active;
  });
  dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));
  if(counter)counter.textContent=(index+1)+' / '+slides.length;
 }
 function pause(){if(timer){clearInterval(timer);timer=null;}}
 function play(){
  pause();
  if(!document.hidden&&!reduced.matches&&!root.matches(':hover')&&!root.matches(':focus-within'))
   timer=setInterval(()=>display(index+1),3000);
 }
 document.getElementById('nzpromoPrev')?.addEventListener('click',()=>{display(index-1);play();});
 document.getElementById('nzpromoNext')?.addEventListener('click',()=>{display(index+1);play();});
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>{display(i);play();}));
 root.addEventListener('mouseenter',pause);
 root.addEventListener('mouseleave',play);
 root.addEventListener('focusin',pause);
 root.addEventListener('focusout',()=>queueMicrotask(play));
 document.addEventListener('visibilitychange',play);
 if(typeof reduced.addEventListener==='function')reduced.addEventListener('change',play);
 display(0);play();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();