/* NZER STORE · pantalla de orientación de pagos · demo, no procesa operaciones */
(()=>{'use strict';
function init(){
const trigger=document.getElementById('nzcPreviewPayment'),preview=document.getElementById('nzcPaymentPreview'),items=document.getElementById('cartItems');
if(!trigger||!preview||!items)return;
const labels={yape:'Yape',plin:'Plin',transferencia:'transferencia bancaria',local:'pago en el local'};
const safeNote='Esta es una simulación. No se ha enviado un pedido, reservado inventario ni iniciado un pago.';
function refresh(){
 if(!preview.hidden){preview.hidden=true;preview.replaceChildren();}
}
items.addEventListener('click',event=>{if(event.target.closest('[data-qty]'))refresh();});
document.querySelectorAll('input[name="paymentDemo"]').forEach(input=>input.addEventListener('change',refresh));
trigger.addEventListener('click',()=>{
 const qty=Number(document.querySelector('[data-order-count]')?.textContent)||0;
 if(!qty){preview.hidden=false;preview.textContent='Agrega al menos un producto de demostración antes de revisar el pago.';return;}
 const method=document.querySelector('input[name="paymentDemo"]:checked')?.value||'local';
 const total=document.querySelector('[data-subtotal]')?.textContent||'S/ 0.00';
 const lead=document.createElement('strong');lead.textContent='Medio seleccionado: '+(labels[method]||'pago en el local');
 const p=document.createElement('p');p.textContent='Total referencial: '+total+'. Recojo previsto en Cruce La Joya, Arequipa, previa coordinación.';
 const note=document.createElement('p');note.textContent=(method==='local'?'El pago se acordaría al confirmar la disponibilidad y el recojo.':'Todavía no existe un enlace, QR o cuenta de cobro autorizada para '+(labels[method]||method)+'.')+' '+safeNote;
 preview.replaceChildren(lead,p,note);preview.hidden=false;
 preview.scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();