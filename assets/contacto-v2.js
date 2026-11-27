/* NZER Contacto: copiar dirección conocida sin recolectar datos */
(()=>{'use strict';
function init(){
 const button=document.getElementById('nzcCopyAddress');
 const status=document.getElementById('nzcAddressStatus');
 if(!button||!status)return;
 button.addEventListener('click',async()=>{
  const address="NZER KID'S CENTER, PPJJ El Triunfo, Zona A, La Joya 04405, Arequipa, Perú";
  try{
   if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
   await navigator.clipboard.writeText(address);
   status.textContent='Dirección copiada. Puedes pegarla en tu aplicación de mapas.';
  }catch(error){
   status.textContent='No fue posible copiar automáticamente. Selecciona la dirección mostrada en pantalla para copiarla.';
  }
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();