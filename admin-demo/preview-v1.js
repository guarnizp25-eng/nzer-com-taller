/* NZER ADMIN · Vista previa de catálogo antes de aprobar (solo simulador). */
(()=>{
'use strict';
const api=window.NZER_ADMIN_MOCK;if(!api)return;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const safe=t=>String(t??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
const money=n=>'S/ '+Number(n||0).toFixed(2);
let visited=new Set(),approved=false,view='desktop',selected=null;
const frame=$('#nzaPreviewFrame');
const checks=$$('.nza-check');
const deviceBtns=$$('[data-device]');
const baseProducts=()=>api.getData().products.filter(p=>p.status==='Preparado');
const icon=p=>p.category==='Regalos'?'🎁':p.category==='Carros'?'🚚':p.category==='Juguetes NZER Kids'?'🧸':p.category==='Madera didáctica'?'🧮':'🧩';
const card=p=>'<article class="nza-shop-card"><div class="nza-shop-photo">'+(p.image?'<img alt="" loading="lazy" src="'+safe(p.image)+'">':icon(p))+(p.stock<=0?'<span class="nza-soldout">Agotado</span>':'')+'</div><div class="nza-shop-info"><span class="nza-shop-category">'+safe(p.category)+'</span><strong>'+safe(p.name)+'</strong><p>'+safe(p.description||'Juguete para explorar y aprender.')+'</p><span class="nza-shop-price">'+money(p.price)+'</span><button type="button" data-preview-product="'+safe(p.id)+'">Ver producto</button></div></article>';
function render(){
 const data=api.getData(),items=baseProducts(),promo=data.promo;
 const heading=$('#nzaShopHeroTitle'),sub=$('#nzaShopHeroSub'),root=$('#nzaPreviewCards');
 if(!heading||!root)return;
 heading.textContent=promo?.title||'Descubre juguetes para crear grandes momentos';
 sub.textContent=promo?'Promoción de prueba: '+promo.discount+'% de descuento ilustrativo. No vigente.':'Encuentra experiencias que inspiran el juego y el aprendizaje.';
 $('#nzaShopSectionTitle').textContent='Juguetes destacados';
 $('#nzaPreviewCount').textContent=items.length+' productos preparados de prueba';
 root.innerHTML=items.length?items.map(card).join(''):'<div class="empty" style="grid-column:1/-1">No hay productos preparados para publicar. Edita un producto y cambia su estado a Preparado.</div>';
 root.querySelectorAll('[data-preview-product]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.previewProduct;showDetail()}));
 if(selected){const p=items.find(p=>p.id===selected);if(!p){selected=null;$('#nzaPreviewDetail').classList.add('hidden')}else showDetail()}
}
function showDetail(){
 const p=baseProducts().find(p=>p.id===selected),detail=$('#nzaPreviewDetail');if(!p||!detail)return;
 detail.classList.remove('hidden');
 detail.innerHTML='<button type="button" id="nzaClosePreviewDetail">← Volver al catálogo</button><h4>'+safe(p.name)+'</h4><p>'+safe(p.description||'Descripción pendiente de revisión.')+'</p><p style="margin:10px 0;font-weight:1000;color:#0b683f;font-size:21px">'+money(p.price)+'</p><p style="font-size:11px">'+(p.stock>0?'Existencia de prueba: '+p.stock:'Agotado')+' · '+safe(p.category)+'</p>';
 $('#nzaClosePreviewDetail').onclick=()=>{selected=null;detail.classList.add('hidden')};
}
function updateDevice(name){
 view=name;visited.add(name);frame.classList.toggle('desktop',name==='desktop');frame.classList.toggle('mobile',name==='mobile');
 deviceBtns.forEach(b=>{const active=b.dataset.device===name;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 $('#nzaScreenSize').textContent=name==='mobile'?'Celular · 375 px':'Escritorio · adaptable';
 updateChecks();
}
function updateChecks(){
 const done=checks.every(c=>c.checked)&&visited.has('desktop')&&visited.has('mobile');
 const approvalBtn=$('#nzaApprovePreview');approvalBtn.disabled=!done||approved;
 const warning=$('#nzaPreviewWarning');
 warning.classList.toggle('approved',approved);
 warning.textContent=approved?'Vista previa aprobada en esta sesión de prueba. Aún no se ha publicado nada.':!visited.has('mobile')?'Aún falta revisar la visualización en celular.':!visited.has('desktop')?'Aún falta revisar la visualización en escritorio.':done?'Revisión completa. Puedes aprobar la maqueta.':'Marca los cuatro puntos después de comprobar ambas pantallas.';
 $('#nzaPublishReadiness').textContent=approved?'Aprobación de demostración completada. La publicación real sigue deshabilitada porque aún no hay conexión segura.':'Revisa y aprueba la vista previa antes del futuro proceso de publicación.';
 $('#nzaPublishReadiness').classList.toggle('approved',approved);
}
function invalidate(){
 approved=false;
 visited=new Set();
 checks.forEach(c=>c.checked=false);
 updateDevice('desktop');
}
deviceBtns.forEach(b=>b.addEventListener('click',()=>updateDevice(b.dataset.device)));
checks.forEach(c=>c.addEventListener('change',updateChecks));
$('#nzaApprovePreview')?.addEventListener('click',()=>{if(checks.every(c=>c.checked)&&visited.has('desktop')&&visited.has('mobile')){approved=true;updateChecks();api.nav('publicar')}});
window.addEventListener('nzer-admin-updated',()=>{render();invalidate()});
render();updateDevice('desktop');
})();
