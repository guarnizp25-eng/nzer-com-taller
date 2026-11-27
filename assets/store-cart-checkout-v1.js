/* NZER STORE · selector inicial de cuenta o compra como visitante (sin backend de identidad) */
(()=>{'use strict';
function init(){
 const modal=document.getElementById('nzcAccountOverlay');
 const dialog=modal?.querySelector('.nzc-account-dialog');
 const guest=document.getElementById('nzcGuestContinue');
 const open=document.getElementById('nzcOpenAccountModal');
 const close=document.getElementById('nzcAccountClose');
 const emailForm=document.getElementById('nzcCreateAccountForm');
 const email=document.getElementById('nzcAccountEmail');
 const accountMessage=document.getElementById('nzcAccountMessage');
 const feedback=document.getElementById('nzcIdentityFeedback');
 const trigger=document.getElementById('nzcPreviewPayment');
 const preview=document.getElementById('nzcPaymentPreview');
 const items=document.getElementById('cartItems');
 if(!modal||!dialog||!guest||!open||!close||!emailForm||!email||!accountMessage||!feedback||!trigger||!preview||!items)return;
 const labels={yape:'Yape',plin:'Plin',transferencia:'transferencia bancaria',local:'pago en el local'};
 let guestChosen=false,restoreFocus=null;
 function showModal(){
  restoreFocus=document.activeElement;
  modal.hidden=false;
  document.body.style.overflow='hidden';
  accountMessage.textContent='';
  dialog.focus();
 }
 function hideModal(){
  modal.hidden=true;document.body.style.overflow='';
  email.value=''; // never persist a visitor's email in this demo
  (restoreFocus?.isConnected?restoreFocus:open).focus();
 }
 function setGuest(){
  guestChosen=true;
  feedback.textContent='Continuarás como visitante. No creamos una cuenta ni almacenamos datos personales.';
  refresh();
  hideModal();
 }
 function refresh(){preview.hidden=true;preview.replaceChildren();}
 guest.addEventListener('click',setGuest);
 close.addEventListener('click',hideModal);
 open.addEventListener('click',showModal);
 modal.addEventListener('click',e=>{if(e.target===modal)hideModal();});
 document.addEventListener('keydown',e=>{
  if(modal.hidden)return;
  if(e.key==='Escape'){e.preventDefault();hideModal();return;}
  if(e.key==='Tab'){
   const focusable=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled])')].filter(el=>el.getClientRects().length);
   const first=focusable[0],last=focusable[focusable.length-1];
   if(!first)return;
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 emailForm.addEventListener('submit',e=>{
  e.preventDefault();
  if(!email.validity.valid){accountMessage.textContent='Introduce un correo electrónico válido.';email.focus();return;}
  // There is no secure authentication provider connected; do not store/transmit or falsely register.
  accountMessage.textContent='El registro de cuentas con correo todavía no está habilitado. Tu correo no se ha guardado ni enviado. Puedes continuar sin cuenta por ahora.';
  email.value='';
 });
 items.addEventListener('click',event=>{if(event.target.closest('[data-qty]'))refresh();});
 document.querySelectorAll('input[name="paymentDemo"]').forEach(input=>input.addEventListener('change',refresh));
 trigger.addEventListener('click',()=>{
  const count=Number(document.querySelector('[data-order-count]')?.textContent)||0;
  if(!count){preview.hidden=false;preview.textContent='Agrega al menos un producto para revisar el pago de prueba.';return;}
  if(!guestChosen){showModal();return;}
  const method=document.querySelector('input[name="paymentDemo"]:checked')?.value||'local';
  const total=document.querySelector('[data-subtotal]')?.textContent||'S/ 0.00';
  const title=document.createElement('strong');title.textContent='Pago de prueba: '+(labels[method]||'pago en local');
  const amount=document.createElement('p');amount.textContent='Total referencial: '+total+'. Recojo previsto en Cruce La Joya, previa coordinación.';
  const disclaimer=document.createElement('p');disclaimer.textContent='Simulación únicamente: no se registra ningún pedido ni se cobra. Los medios de pago reales aún no están habilitados.';
  preview.replaceChildren(title,amount,disclaimer);preview.hidden=false;
 });
 // Every entry into the cart starts with the choice, regardless of cart content.
 showModal();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();