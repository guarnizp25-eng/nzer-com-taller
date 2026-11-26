/* NZER STORE · recorte automático del fondo blanco/crema del retrato.
   No altera la fotografía original en GitHub. Se ejecuta solo en la portada. */
(() => {
 'use strict';
 const img = document.querySelector('.nzer-christmas-boy');
 if (!img) return;
 async function cutout() {
  try {
   if (!img.complete) await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true});});
   if (img.decode) await img.decode().catch(()=>{});
   const scale = Math.min(1,1000/(img.naturalWidth||1000));
   const w=Math.round(img.naturalWidth*scale),h=Math.round(img.naturalHeight*scale);
   if (!w||!h) return;
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   if (!ctx) return;
   ctx.drawImage(img,0,0,w,h);
   const frame=ctx.getImageData(0,0,w,h),d=frame.data,n=w*h;
   const visited=new Uint8Array(n),queue=new Int32Array(n);
   let read=0,write=0;
   const isBg=(i)=>{
    const k=i*4,r=d[k],g=d[k+1],b=d[k+2];
    const light=(r+g+b)/3;
    return light>211 && Math.max(r,g,b)-Math.min(r,g,b)<58 && r>=g-8 && g>=b-8;
   };
   const push=i=>{if(i<0||i>=n||visited[i]||!isBg(i))return;visited[i]=1;queue[write++]=i;};
   for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}
   for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
   while(read<write){
    const i=queue[read++],x=i%w;
    if(x>0)push(i-1);
    if(x<w-1)push(i+1);
    if(i>=w)push(i-w);
    if(i+w<n)push(i+w);
   }
   // Fondo transparente solo en regiones claras conectadas al exterior.
   for(let i=0;i<n;i++)if(visited[i])d[i*4+3]=0;
   // Suavizado del borde externo: preservar ojos, ropa, juguetes y facciones.
   for(let i=w+1;i<n-w-1;i++){
    if(visited[i])continue;
    if(visited[i-1]||visited[i+1]||visited[i-w]||visited[i+w]){
      const k=i*4,r=d[k],g=d[k+1],b=d[k+2];
      const light=(r+g+b)/3,sat=Math.max(r,g,b)-Math.min(r,g,b);
      if(light>192 && sat<72)d[k+3]=Math.min(d[k+3],Math.round(255*Math.max(.32,(218-light)/26)));
    }
   }
   ctx.putImageData(frame,0,0);
   const url=canvas.toDataURL('image/png');
   if(url.length>150){img.src=url;img.classList.add('nzer-boy-is-cutout');}
  }catch(e){ /* Si el navegador bloquea canvas, queda la imagen original. */ }
 }
 cutout();
})();