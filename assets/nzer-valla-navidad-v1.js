/* NZER STORE: valla comercial editable, cinco ofertas de demostración. */
(()=>{
 'use strict';
 const stage=document.getElementById('nzv-product-image');
 if(!stage||typeof NZER_PRODUCTS==='undefined'||typeof productArtwork!=='function')return;
 const ids=['activity','magnet','train','track','rainbow'];
 const products=ids.map(id=>NZER_PRODUCTS.find(p=>p.id===id)).filter(Boolean);
 if(!products.length)return;
 const el=id=>document.getElementById(id);
 const dots=el('nzv-dots');
 let active=0,timer=null,switchTimer=null;
 const money=n=>'S/ '+Number(n).toFixed(2);

 const cutouts=new Map();
 const backgroundCutout=async(src)=>{
  if(cutouts.has(src))return cutouts.get(src);
  const work=(async()=>{
   const image=new Image();image.decoding='async';image.src=src;await image.decode();
   const scale=Math.min(1,700/image.naturalWidth);
   const w=Math.max(1,Math.round(image.naturalWidth*scale)),h=Math.max(1,Math.round(image.naturalHeight*scale));
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   ctx.drawImage(image,0,0,w,h);
   const data=ctx.getImageData(0,0,w,h),pixels=data.data,total=w*h;
   const checked=new Uint8Array(total),queue=new Int32Array(total);
   const corner=[0,w-1,(h-1)*w,(h*w)-1];let sr=0,sg=0,sb=0;
   for(const i of corner){const k=i*4;sr+=pixels[k];sg+=pixels[k+1];sb+=pixels[k+2];}
   sr/=4;sg/=4;sb/=4;
   if((sr+sg+sb)/3<171||Math.max(sr,sg,sb)-Math.min(sr,sg,sb)>80)return src;
   const qualifies=(i)=>{
    const k=i*4,r=pixels[k],g=pixels[k+1],b=pixels[k+2];
    if((r+g+b)/3<166)return false;
    if(Math.max(r,g,b)-Math.min(r,g,b)>79)return false;
    return Math.hypot(r-sr,g-sg,b-sb)<114;
   };
   let head=0,tail=0;
   const add=i=>{if(i<0||i>=total||checked[i]||!qualifies(i))return;checked[i]=1;queue[tail++]=i};
   for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}
   for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
   while(head<tail){
    const i=queue[head++],x=i%w;
    if(x>0)add(i-1);
    if(x<w-1)add(i+1);
    if(i>=w)add(i-w);
    if(i+w<total)add(i+w);
   }
   if(tail<total*.05)return src;
   for(let n=0;n<tail;n++)pixels[queue[n]*4+3]=0;
   for(let n=0;n<total;n++){
    if(checked[n])continue;
    const x=n%w;
    if((x>0&&checked[n-1])||(x<w-1&&checked[n+1])||(n>=w&&checked[n-w])||(n+w<total&&checked[n+w])){
     const k=n*4,r=pixels[k],g=pixels[k+1],b=pixels[k+2];
     if(Math.hypot(r-sr,g-sg,b-sb)<130&&((r+g+b)/3)>150)pixels[k+3]=Math.min(pixels[k+3],135);
    }
   }
   ctx.putImageData(data,0,0);
   return canvas.toDataURL('image/png');
  })().catch(()=>src);
  cutouts.set(src,work);
  return work;
 };

 const escapeHtml=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 dots.innerHTML=products.map((_,i)=>'<button type="button" aria-label="Ver juguete '+(i+1)+'" aria-current="'+(i===0)+'" data-index="'+i+'"></button>').join('');
 function paint(i){
  const p=products[i];
  const discount=typeof demoDiscount==='function'?demoDiscount(p):0;
  const newPrice=typeof demoPrice==='function'?demoPrice(p):p.price;
  stage.innerHTML=productArtwork(p);
  const original=stage.querySelector('img');
  if(original){
   original.loading='eager';
   original.classList.add('nzv-cutout-pending');
   const src=original.src;
   backgroundCutout(src).then(transformed=>{
    if(!original.isConnected)return;
    if(transformed!==src){
      original.src=transformed;
      original.classList.add('nzv-cutout-ready');
      original.classList.remove('nzv-cutout-pending');
    }else{
      original.classList.add('nzv-cutout-fallback');
      original.classList.remove('nzv-cutout-pending');
    }
   });
  }
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