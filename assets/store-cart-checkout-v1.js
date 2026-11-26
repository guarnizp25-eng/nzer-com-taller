/* NZER STORE · checkout demostrativo V2: identificación honesta sin credenciales */
(()=>{
'use strict';
function init(){
 const trigger=document.getElementById('nzcPreviewPayment');
 const preview=document.getElementById('nzcPaymentPreview');
 const items=document.getElementById('cartItems');
 const guest=document.getElementById('nzcGuestContinue');
 const login=document.getElementById('nzcLoginUnavailable');
 const feedback=document.getElementById('nzcIdentityFeedback');
 if(!trigger||!preview||!items||!guest||!login||!feedback)return;
 const labels={yape:'Yape',plin:'Plin',transferencia:'transferencia bancaria',local:'pago en el local'};
 let guestChosen=false;
 function refresh(){preview.hidden=true;preview.replaceChildren();}
 function showMessage(msg){feedback.textContent=msg;}
 function goToSection(section){section?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
 guest.addEventListener('click',()=>{
  guestChosen=true;guest.setAttribute('aria-pressed','true');
  guest.textContent='✓ Continuar como visitante';
  showMessage('Has elegido continuar como visitante en esta demostración. No creamos una cuenta ni almacenamos tus datos personales.');
  refresh();
  goToSection(document.getElementById('nzcDeliveryHeading'));
 });
 login.addEventListener('click',()=>{
  showMessage('El inicio de sesión todavía no está disponible: estamos preparando una autenticación segura. No introduzcas contraseñas ni datos bancarios. Puedes continuar como visitante en esta demostración.');
  goToSection(document.getElementById('nzcIdentityHeading'));
 });
 items.addEventListener('click',event=>{if(event.target.closest('[data-qty]'))refresh();});
 document.querySelectorAll('input[name="paymentDemo"]').forEach(input=>input.addEventListener('change',refresh));
 trigger.addEventListener('click',()=>{
  const count=Number(document.querySelector('[data-order-count]')?.textContent)||0;
  if(!count){preview.hidden=false;preview.textContent='Tu carrito está vacío. Agrega productos de demostración antes de continuar.';return;}
  if(!guestChosen){
   showMessage('Primero selecciona «Continuar como visitante». El acceso con cuenta está pendiente de implementación.');
   goToSection(document.getElementById('nzcIdentityHeading'));
   return;
  }
  const method=document.querySelector('input[name="paymentDemo"]:checked')?.value||'local';
  const total=document.querySelector('[data-subtotal]')?.textContent||'S/ 0.00';
  const lead=document.createElement('strong');lead.textContent='Modalidad seleccionada: '+(labels[method]||'pago en el local');
  const p=document.createElement('p');p.textContent='Total referencial: '+total+'. El recojo en Cruce La Joya se coordinaría al confirmar el pedido.';
  const note=document.createElement('p');note.textContent=(method==='local'?'El pago se realizaría únicamente después de confirmar disponibilidad y el punto de recojo.':'No existe aún un enlace, QR o cuenta de cobro habilitada para '+(labels[method]||method)+'.')+' Esta es una simulación: no se ha enviado un pedido, reservado inventario ni iniciado un pago.';
  preview.replaceChildren(lead,p,note);preview.hidden=false;goToSection(preview);
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();