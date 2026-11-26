/* NZER STORE: valla comercial editable, cinco ofertas de demostración. */
(()=>{
 'use strict';
 const stage=document.getElementById('nzv-product-image');
 if(!stage||typeof NZER_PRODUCTS==='undefined'||typeof productArtwork!=='function')return;
 const ids=['builder','activity','magnet','train','rainbow'];
 const products=ids.map(id=>NZER_PRODUCTS.find(p=>p.id===id)).filter(Boolean);
 if(!products.length)return;
 const el=id=>document.getElementById(id);
 const dots=el('nzv-dots');
 let active=0,timer=null,switchTimer=null;
 const money=n=>'S/ '+Number(n).toFixed(2);
 const escapeHtml=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 dots.innerHTML=products.map((_,i)=>'<button type="button" aria-label="Ver juguete '+(i+1)+'" aria-current="'+(i===0)+'" data-index="'+i+'"></button>').join('');
 function paint(i){
  const p=products[i];
  const discount=typeof demoDiscount==='function'?demoDiscount(p):0;
  const newPrice=typeof demoPrice==='function'?demoPrice(p):p.price;
  stage.innerHTML=productArtwork(p);
  const original=stage.querySelector('img');
  if(original){original.loading='eager';}
  el('nzv-product-name').textContent=p.name;
  el('nzv-old-price').textContent=discount?money(p.price):'';
  el('nzv-discount').textContent=discount?'−'+discount+'%':'Precio de demostración';
  el('nzv-new-price').textContent=money(newPrice);
  el('nzv-product-link').href='producto/index.html?id='+encodeURIComponent(p.id);
  [...dots.children].forEach((dot,index)=>dot.setAttribute('aria-current',String(i===index)));
 }
 function show(i){
  active=(i+products.length)%products.length;
  stage.classList.add('is-switching');
  if(switchTimer)clearTimeout(switchTimer);
  switchTimer=setTimeout(()=>{paint(active);stage.classList.remove('is-switching');},220);
 }
 function stop(){if(timer){clearInterval(timer);timer=null;}}
 function start(){stop();if(!document.hidden)timer=setInterval(()=>show(active+1),3000);}
 el('nzv-prev')?.addEventListener('click',()=>{show(active-1);start()});
 el('nzv-next')?.addEventListener('click',()=>{show(active+1);start()});
 dots.addEventListener('click',e=>{const target=e.target.closest('button[data-index]');if(target){show(Number(target.dataset.index));start();}});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 stage.addEventListener('focusin',stop);stage.addEventListener('focusout',start);
 paint(0);start();
})();