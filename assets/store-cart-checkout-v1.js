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
  const disclaimer=document.createElement('p');disclaimer.textContent='Puedes generar un pedido ficticio y revisarlo en NZER ADMIN · TALLER. No se cobra ni se verifica ningún pago.';
  const demoButton=document.createElement('button');demoButton.type='button';demoButton.textContent='Generar pedido ficticio en NZER ADMIN';
  demoButton.style.cssText='display:block;margin:15px 0;padding:13px 18px;background:#23763a;color:white;border:0;border-radius:10px;font-weight:700;cursor:pointer';
  const orderFeedback=document.createElement('p');orderFeedback.setAttribute('role','status');
  demoButton.addEventListener('click',()=>{
   const api=window.NZER_TALLER_CART_API;
   if(!api){orderFeedback.textContent='El catálogo de prueba no está listo. Actualiza la página.';return}
   const lines=api.getLines();
   const invalid=lines.some(l=>!l||!Number.isInteger(l.qty)||l.qty<1||!Number.isFinite(l.unitPrice)||l.unitPrice<0);
   if(!lines.length||invalid){orderFeedback.textContent='Revisa el carrito antes de generar tu pedido de prueba.';return}
   const key='nzer-taller-pedidos-v1';
   let data;
   try{data=JSON.parse(localStorage.getItem(key)||'null')}catch{}
   if(!data||!Array.isArray(data.orders)||!Number.isInteger(data.seq)||!data.stock||typeof data.stock!=='object'){
    data={seq:0,orders:[],stock:Object.fromEntries((window.NZER_CATALOG_PRODUCTS||[]).map(p=>[p.id,5]))};
   }
   const reserved=id=>data.orders.filter(o=>o.status==='PENDIENTE').reduce((n,o)=>n+(Array.isArray(o.lines)?o.lines:[{productId:o.productId,qty:o.qty}]).filter(l=>l.productId===id).reduce((q,l)=>q+l.qty,0),0);
   const shortage=lines.find(l=>l.qty>Math.max(0,(data.stock[l.productId]??5)-reserved(l.productId)));
   if(shortage){orderFeedback.textContent='No hay unidades disponibles suficientes de '+shortage.name+' en la simulación.';return}
   const date=new Date().toISOString();
   const id='NZER-WEB-'+String(++data.seq).padStart(5,'0');
   const subtotal=Math.round(lines.reduce((sum,l)=>sum+l.qty*l.unitPrice,0)*100)/100;
   const order={id,channel:'WEB',productId:lines[0].productId,name:lines[0].name,qty:lines.reduce((n,l)=>n+l.qty,0),lines,total:subtotal,customer:'Visitante de prueba',date,status:'PENDIENTE',paymentMethod:method,events:[{date,text:'Pedido web ficticio recibido; productos reservados; pago sin verificar'}]};
   data.orders.push(order);
   try{localStorage.setItem(key,JSON.stringify(data))}catch{orderFeedback.textContent='No se pudo almacenar el pedido. Revisa los permisos del navegador.';return}
   demoButton.disabled=true;api.clearCart();
   orderFeedback.textContent='Pedido '+id+' creado. No se ha efectuado ni verificado ningún pago.';
   const adminLink=document.createElement('a');adminLink.href='../../admin/pedidos/index.html';adminLink.textContent='Ver pedido en NZER ADMIN · TALLER →';adminLink.style.display='block';adminLink.style.marginTop='12px';
   orderFeedback.append(document.createElement('br'),adminLink);
   document.querySelectorAll('[data-order-count]').forEach(el=>el.textContent='0');
  });
  preview.replaceChildren(title,amount,disclaimer,demoButton,orderFeedback);preview.hidden=false;
 });
 // Every entry into the cart starts with the choice, regardless of cart content.
 showModal();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();