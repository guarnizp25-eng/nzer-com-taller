/* NZER STORE — escaparate navideño ilustrativo con 5 artículos, rotación 3 s */
(()=>{
'use strict';
const root=document.getElementById('nzerChristmasRotator');
if(!root||typeof NZER_PRODUCTS==='undefined'||typeof productArtwork!=='function')return;
const counter=document.getElementById('nzerChristmasPosition');
const dots=document.getElementById('nzerChristmasDots');
const prev=document.getElementById('nzerChristmasPrev');
const next=document.getElementById('nzerChristmasNext');
const items=['activity','magnet','train','track','rainbow'].map(id=>NZER_PRODUCTS.find(p=>p.id===id)).filter(Boolean);
if(!items.length)return;
root.innerHTML=items.map((p,i)=>{
 const discount=typeof demoDiscount==='function'?demoDiscount(p):0;
 const old='<del>S/ '+Number(p.price).toFixed(2)+'</del>';
 const now='S/ '+Number(typeof demoPrice==='function'?demoPrice(p):p.price).toFixed(2);
 return '<article class="nzer-christmas-slide'+(i===0?' is-active':'')+'" aria-hidden="'+(i!==0)+'"'+(i===0?'':' inert')+'>'+
 '<div class="nzer-christmas-product-photo">'+productArtwork(p)+'</div>'+
 '<div class="nzer-christmas-product-info"><span>REGALO DIDÁCTICO · REFERENCIAL</span><h3>'+p.name+'</h3>'+
 '<div class="nzer-christmas-offer-line">'+(discount?old:'')+
 (discount?'<span class="nzer-christmas-discount" aria-label="'+discount+' por ciento de descuento simulado">−'+discount+'%</span>':'')+'</div>'+
 '<div class="nzer-christmas-price">'+now+'</div>'+
 '<a href="producto/index.html?id='+encodeURIComponent(p.id)+'">Conocer juguete →</a></div></article>';
}).join('');
const slides=[...root.querySelectorAll('.nzer-christmas-slide')];
if(dots)dots.innerHTML=slides.map((_,i)=>'<button type="button" class="nzer-christmas-dot'+(i===0?' is-active':'')+'" aria-label="Ver juguete '+(i+1)+'" aria-pressed="'+(i===0)+'" data-slide="'+i+'"></button>').join('');
let active=0,timer=null;
function show(index){
 active=(index+slides.length)%slides.length;
 slides.forEach((slide,i)=>{
  const selected=active===i;
  slide.classList.toggle('is-active',selected);
  slide.setAttribute('aria-hidden',String(!selected));
  if(selected)slide.removeAttribute('inert');else slide.setAttribute('inert','');
 });
 dots?.querySelectorAll('[data-slide]').forEach((dot,i)=>{
  dot.classList.toggle('is-active',i===active);
  dot.setAttribute('aria-pressed',String(i===active));
 });
 if(counter)counter.textContent=(active+1)+' de '+slides.length;
}
function stop(){if(timer!==null){window.clearInterval(timer);timer=null}}
function start(){stop();if(!document.hidden)timer=window.setInterval(()=>show(active+1),3000)}
prev?.addEventListener('click',()=>{show(active-1);start()});
next?.addEventListener('click',()=>{show(active+1);start()});
dots?.addEventListener('click',e=>{const b=e.target.closest('[data-slide]');if(b){show(Number(b.dataset.slide));start()}});
root.addEventListener('focusin',stop);
root.addEventListener('focusout',()=>{if(!root.contains(document.activeElement))start()});
document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
show(0);start();
})();