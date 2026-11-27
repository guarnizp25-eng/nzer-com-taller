/* NZER ADMIN — vista real en borrador. No publica nada. */
(()=>{
'use strict';
const api=window.NZER_ADMIN_MOCK;if(!api)return;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const frame=$('#nzaRealShopFrame');if(!frame)return;
const deviceButtons=$$('[data-device]'),checks=$$('.nza-check');
let approved=false,visited=new Set(),rev=0,device='desktop';
function updateChecks(){
 const complete=checks.every(x=>x.checked)&&visited.has('desktop')&&visited.has('mobile');
 const action=$('#nzaApprovePreview'),notice=$('#nzaPreviewWarning'),status=$('#nzaPublishReadiness');
 if(action)action.disabled=!complete||approved;
 if(notice){notice.classList.toggle('approved',approved);notice.textContent=approved?'Revisión del taller completada. Puedes aplicar una campaña desde Promociones.':!visited.has('mobile')?'Revisa también la tienda desde la vista celular.':complete?'Comprobaciones completas. Puedes marcar la revisión como finalizada.':'Verifica ambos dispositivos y marca todos los puntos.';}
 if(status){status.classList.toggle('approved',approved);status.textContent='Taller en pruebas; la página oficial no se ha modificado.';}
}
function reload(){
 const d=api.getData(),campaign=d.campaigns?.find(c=>c.id===localStorage.getItem('nzer_admin_preview_campaign_id'));
 const label=$('#nzaSelectedCampaign');
 if(label)label.textContent=campaign?'TALLER · Revisión de campaña: '+campaign.title+' · Verás los cambios antes de aplicarlos':'TALLER · Catálogo en pruebas';
 approved=false;
 const u=new URL('../store/index.html',location.href);u.searchParams.set('nzer_draft_preview','1');u.searchParams.set('revision',String(++rev));frame.src=u.href;
}
window.NZER_PREVIEW_REFRESH=reload;
$('#nzaOpenWorkshopStore')?.addEventListener('click',()=>window.open(new URL('../store/index.html?nzer_taller=1',location.href).href,'_blank','noopener'));

function changeDevice(value){device=value;visited.add(value);const container=$('#nzaPreviewFrame');container.classList.toggle('desktop',value==='desktop');container.classList.toggle('mobile',value==='mobile');deviceButtons.forEach(b=>{const on=b.dataset.device===value;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});$('#nzaScreenSize').textContent=value==='mobile'?'Celular · 375 px':'Escritorio';updateChecks();}
function invalidate(){approved=false;visited=new Set();checks.forEach(x=>x.checked=false);changeDevice(device);visited=new Set([device]);updateChecks();reload();}
deviceButtons.forEach(b=>b.addEventListener('click',()=>changeDevice(b.dataset.device)));
checks.forEach(b=>b.addEventListener('change',updateChecks));
$('#nzaApprovePreview')?.addEventListener('click',()=>{if(checks.every(x=>x.checked)&&visited.has('desktop')&&visited.has('mobile')){approved=true;updateChecks();}});
window.addEventListener('nzer-admin-updated',invalidate);
frame.addEventListener('load',()=>{
 try{
  const doc=frame.contentDocument;if(!doc)return;
  doc.addEventListener('click',e=>{
   const anchor=e.target.closest('a[href]');if(!anchor)return;
   const url=new URL(anchor.href,frame.contentWindow.location.href);
   if(url.origin!==location.origin||!url.pathname.includes('/nzer-com-taller/store/')){e.preventDefault();return;}
   if(url.pathname.includes('/carrito/')){e.preventDefault();return;}
   url.searchParams.set('nzer_draft_preview','1');
   e.preventDefault();frame.src=url.href;
  },true);
 }catch(e){console.warn('Vista previa no disponible',e)}
});
changeDevice('desktop');reload();
})();
