/* NZER STORE - vitrina navideña de demostración, 5 juguetes cada 3 segundos */
(()=>{
 'use strict';
 const root=document.getElementById('nzerChristmasRotator');
 const counter=document.getElementById('nzerChristmasPosition');
 if(!root||typeof NZER_PRODUCTS==='undefined')return;
 const ids=['magnet','train','activity','track','rainbow'];
 const products=ids.map(id=>NZER_PRODUCTS.find(p=>p.id===id)).filter(Boolean);
 if(!products.length)return;
 let active=0;
 root.innerHTML=products.map((p,i)=>
  '<article class="nzer-christmas-slide'+(i===0?' is-active':'')+'" aria-hidden="'+(i!==0)+'"'+(i===0?'':' inert')+'>'+
   '<div class="nzer-christmas-product-photo">'+productArtwork(p)+'</div>'+
   '<div class="nzer-christmas-product-info"><span>IDEA DE REGALO · REFERENCIAL</span><h3>'+p.name+'</h3>'+
   '<div class="nzer-christmas-price">'+demoPriceMarkup(p)+'</div>'+
   '<a href="producto/index.html?id='+encodeURIComponent(p.id)+'">Conocer juguete →</a></div>'+
  '</article>').join('');
 const slides=[...root.querySelectorAll('.nzer-christmas-slide')];
 function show(i){
  active=(i+slides.length)%slides.length;
  slides.forEach((slide,j)=>{const on=active===j;slide.classList.toggle('is-active',on);slide.setAttribute('aria-hidden',String(!on));if(on)slide.removeAttribute('inert');else slide.setAttribute('inert','');});
  if(counter)counter.textContent=(active+1)+' de '+slides.length;
 }
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){return;}
 let timer=null;
 function start(){if(!timer)timer=window.setInterval(()=>show(active+1),3000)}
 function stop(){if(timer){window.clearInterval(timer);timer=null}}
 root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
 root.addEventListener('focusin',stop);root.addEventListener('focusout',()=>{if(!root.contains(document.activeElement))start()});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 start();
})();