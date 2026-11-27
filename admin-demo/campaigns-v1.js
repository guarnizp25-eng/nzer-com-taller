/* NZER ADMIN · Campañas manuales de taller. Nunca publica ofertas comerciales. */
(()=>{'use strict';
const api=window.NZER_ADMIN_MOCK;if(!api)return;
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'S/ '+Number(n).toFixed(2),fmt=n=>Number(n).toFixed(1)+'%';
const form=$('#nzaCampaignForm');if(!form)return;
let editId=null,selected={};
const DEMO_SALES_30=Object.freeze({magnet:8,builder:0,truck:11,excavator:2,toolbox:0,ridecar:6,track:1,garage:1,train:9,cubes:1,animals:5,abacus:2,balance:0,hammer:3,woodblocks:12,crane:0,activity:0,fruits:8,shapes:2,rainbow:3});
const segmentValue=()=>$('#nzaCampaignSegment')?.value||'all';
const percentValue=()=>Number($('#nzaBulkDiscount')?.value||10);
const demoSales=p=>DEMO_SALES_30[p.storeId]??0;
function rotation(p){
 const sold=demoSales(p),remaining=Number(p.stock)||0;
 if(sold===0)return 'no-sales';
 const rate=sold/(sold+remaining||1);
 return rate<.15?'low':rate<.4?'medium':'high';
}
const belongs=(p,segment)=>segment==='all'||(segment==='low-stock'&&p.stock>0&&p.stock<=3)||(segment==='out-stock'&&p.stock===0)||rotation(p)===segment;
const offerFromPercent=(p,percentage)=>{
 const regular=Number(p.price);
 if(!Number.isFinite(regular)||regular<=0)return null;
 return Math.max(.01,Math.round(regular*(1-percentage/100)*100)/100);
};
function updateSegmentInfo(){
 const group=products().filter(p=>belongs(p,segmentValue()));
 const total=products().length;
 const box=$('#nzaCampaignSegmentSummary');
 if(box)box.textContent=group.length+' de '+total+' productos cumplen este criterio. Seleccionados: '+Object.keys(selected).length+'. Ventas y rotación simuladas para pruebas (últimos 30 días); no son pedidos reales.';
}
function selectGroup(){
 const percentage=percentValue();
 if(!Number.isFinite(percentage)||percentage<1||percentage>90){alert('Ingresa un descuento entre 1% y 90%.');return;}
 const matching=products().filter(p=>belongs(p,segmentValue()));
 selected={};for(const p of matching){const price=offerFromPercent(p,percentage);if(price!==null&&price<p.price)selected[p.id]=price;}
 drawPicker();drawTotals();
}
function applyBulkDiscount(){
 const percentage=percentValue();
 if(!Number.isFinite(percentage)||percentage<1||percentage>90){alert('Ingresa un descuento entre 1% y 90%.');return;}
 const candidates=products().filter(p=>Object.prototype.hasOwnProperty.call(selected,p.id));
 if(!candidates.length){alert('Selecciona primero algún producto utilizando un filtro.');return;}
 for(const p of candidates){const price=offerFromPercent(p,percentage);if(price!==null&&price<p.price)selected[p.id]=price;}
 drawPicker();drawTotals();
}
const products=()=>api.getData().products||[];
const data=()=>{const d=api.getData();if(!Array.isArray(d.campaigns))d.campaigns=[];return d};
function reset(){editId=null;selected={};form.reset();$('#nzaCampaignSegment').value='all';$('#nzaBulkDiscount').value='10';selectGroup();}
function currentRows(){return products().filter(p=>selected[p.id]!==undefined).map(p=>({p,price:Number(selected[p.id])}));}
function drawTotals(){
 const entries=currentRows();const changed=entries.filter(({p,price})=>Number.isFinite(price)&&price>=0&&price<Number(p.price));
 $('#nzaCampaignTotals').textContent=entries.length?entries.length+' productos seleccionados · '+changed.length+' descuentos válidos (precio promocional menor al regular).':'Selecciona productos y establece su precio promocional.';
 updateSegmentInfo();
}
function drawPicker(){
 const root=$('#nzaCampaignProducts'),term=($('#nzaCampaignSearch')?.value||'').trim().toLocaleLowerCase('es');
 const list=products().filter(p=>belongs(p,segmentValue())&&(!term||(p.name+' '+p.sku).toLocaleLowerCase('es').includes(term)));
 root.innerHTML=list.map(p=>{
 const chosen=Object.prototype.hasOwnProperty.call(selected,p.id),regular=Number(p.price),price=chosen?selected[p.id]:'';
 const discount=chosen&&Number(price)>=0&&Number(price)<regular?((regular-Number(price))/regular*100):0;
 const cost=Number(p.cost)||0,margin=chosen?Number(price)-cost:0;
 return '<div class="nza-promo-item" data-id="'+esc(p.id)+'"><label class="nza-promo-check"><input type="checkbox" data-pick="'+esc(p.id)+'" '+(chosen?'checked':'')+'><span class="nza-promo-photo">'+(p.image?'<img src="'+esc(p.image)+'" alt="">':'—')+'</span><span class="nza-promo-name"><strong>'+esc(p.name)+'</strong><small>'+esc(p.sku)+'</small></span></label>'+
 '<div class="nza-promo-prices"><span>Regular <strong>'+money(regular)+'</strong><small class="nza-promo-rotation">30 días: '+demoSales(p)+' ventas · '+({ 'no-sales':'Sin ventas',low:'Rotación baja',medium:'Rotación media',high:'Rotación alta'})[rotation(p)]+'</small></span><label>Promoción (S/)<input type="number" min="0.01" step=".01" data-offer="'+esc(p.id)+'" value="'+(chosen?esc(price):'')+'" placeholder="0.00" '+(!chosen?'disabled':'')+'></label><span class="nza-promo-percent">'+(discount>0?'−'+fmt(discount):'—')+'</span></div>'+
 (chosen?'<small class="nza-promo-margin">Margen bruto referencial: '+money(margin)+(cost===0?' · costo no registrado':'')+'</small>':'')+'</div>';
 }).join('')||'<p>No se encontraron productos.</p>';
}
function renderList(){
 const root=$('#nzaCampaignList'),list=data().campaigns;
 root.innerHTML=list.length?list.slice().reverse().map(c=>{
  const valid=(c.items||[]).filter(x=>products().some(p=>p.id===x.productId));
  return '<div class="nza-campaign-card"><strong>'+esc(c.title)+'</strong><small>'+esc(c.from)+' → '+esc(c.to)+' · '+esc(c.reason)+' · '+valid.length+' productos</small><span>Campaña de prueba · Sin ventas reales</span><div>'+
  '<button type="button" class="btn secondary sm" data-load-campaign="'+esc(c.id)+'">Editar</button>'+
  '<button type="button" class="btn sm" data-preview-campaign="'+esc(c.id)+'">Previsualizar</button>'+ 
  '<button type="button" class="btn sm" data-apply-campaign="'+esc(c.id)+'">Aplicar en taller</button>'+ 
  (localStorage.getItem('nzer_admin_workshop_campaign_id')===c.id?'<button type="button" class="btn ghost sm" data-disable-campaign="'+esc(c.id)+'">Desactivar</button>':'')+
  '<button type="button" class="btn ghost sm" data-remove-campaign="'+esc(c.id)+'">Eliminar</button></div>'+
  '<small class="nza-campaign-publication">Aplica la campaña para probar los cambios en la tienda del taller. La página oficial permanece intacta.</small></div>';
 }).join(''):'<p class="nza-promo-disclaimer">Todavía no hay campañas guardadas. Crea la primera y después pulsa Vista previa para revisar los precios en NZER STORE.</p>';
}
function previewCampaign(id){
 const campaign=data().campaigns.find(c=>c.id===id);
 if(!campaign)return;
 localStorage.setItem('nzer_admin_preview_campaign_id',campaign.id);
 if(window.NZER_PREVIEW_REFRESH)window.NZER_PREVIEW_REFRESH();
 api.nav('vista-previa');
}

function applyCampaign(id){
 const d=data(),c=d.campaigns.find(x=>x.id===id);
 if(!c)return;
 if(!confirm('¿Aplicar '+c.title+' en NZER STORE · TALLER?\n\nVerás los precios promocionales funcionando en la tienda de pruebas. No se modifica la página oficial.'))return;
 localStorage.setItem('nzer_admin_workshop_campaign_id',id);
 localStorage.setItem('nzer_admin_preview_campaign_id',id);
 renderList();
 const note=$('#nzaCampaignSavedNotice');
 if(note){note.hidden=false;note.innerHTML='Campaña <strong>'+esc(c.title)+'</strong> aplicada en el TALLER. <button type="button" data-open-workshop="1">Abrir tienda del taller</button> · La página oficial no cambia.';}
 window.NZER_PREVIEW_REFRESH?.();
}
function disableCampaign(id){if(localStorage.getItem('nzer_admin_workshop_campaign_id')!==id)return;localStorage.removeItem('nzer_admin_workshop_campaign_id');renderList();const note=$('#nzaCampaignSavedNotice');if(note){note.hidden=false;note.textContent='Campaña desactivada en el taller. La tienda de pruebas vuelve a mostrar los precios regulares al recargar.';}window.NZER_PREVIEW_REFRESH?.();}
function openWorkshop(){window.open(new URL('../store/index.html?nzer_taller=1',location.href).href,'_blank','noopener');}
function load(id){
 const c=data().campaigns.find(x=>x.id===id);if(!c)return;
 editId=c.id;selected={};for(const x of c.items||[])if(products().some(p=>p.id===x.productId))selected[x.productId]=x.offerPrice;
 form.elements.title.value=c.title;form.elements.from.value=c.from;form.elements.to.value=c.to;form.elements.reason.value=c.reason;
 $('#nzaCampaignSegment').value='all';drawPicker();drawTotals();form.scrollIntoView({behavior:'smooth',block:'start'});
}
$('#nzaCampaignProducts')?.addEventListener('change',e=>{
 const id=e.target.dataset.pick;if(!id)return;
 if(e.target.checked){const p=products().find(x=>x.id===id);if(p)selected[id]=offerFromPercent(p,percentValue());}
 else delete selected[id];
 drawPicker();drawTotals();
});
$('#nzaCampaignProducts')?.addEventListener('input',e=>{
 const id=e.target.dataset.offer;if(!id)return;selected[id]=e.target.value;
 const parent=e.target.closest('.nza-promo-item'),p=products().find(x=>x.id===id);
 if(p&&parent){const raw=Number(e.target.value);const disc=raw>0&&raw<p.price?(p.price-raw)/p.price*100:0;
 parent.querySelector('.nza-promo-percent').textContent=disc>0?'−'+fmt(disc):'—';
 const c=Number(p.cost)||0;parent.querySelector('.nza-promo-margin').textContent='Margen bruto referencial: '+money(raw-c)+(c===0?' · costo no registrado':'');
 }
 drawTotals();
});
$('#nzaCampaignSearch')?.addEventListener('input',drawPicker);
$('#nzaCampaignSegment')?.addEventListener('change',()=>{if(editId&&Object.keys(selected).length&&!confirm('El nuevo criterio reemplazará la selección actual de la campaña que estás editando. ¿Continuar?')){ $('#nzaCampaignSegment').value='all';return;}selectGroup();});
$('#nzaApplyDiscount')?.addEventListener('click',applyBulkDiscount);
form.addEventListener('submit',e=>{
 e.preventDefault();const d=data(),title=form.elements.title.value.trim(),from=form.elements.from.value,to=form.elements.to.value,reason=form.elements.reason.value;
 if(!title||!from||!to||from>to){alert('Completa el nombre y un periodo de fechas válido.');return;}
 const rows=currentRows();if(!rows.length){alert('Selecciona al menos un producto.');return;}
 const items=[];
 for(const {p,price} of rows){
  if(!Number.isFinite(price)||price<=0||price>=Number(p.price)||Math.abs(Math.round(price*100)-price*100)>0.00001){alert('Revisa el precio promocional de '+p.name+'. Debe ser mayor a cero y menor al regular.');return;}
  if(Number(p.cost)>0&&price<Number(p.cost)&&!confirm('La promoción de '+p.name+' es inferior al costo registrado. ¿Guardar el borrador de todos modos?'))return;
  items.push({productId:p.id,storeId:p.storeId||'',offerPrice:price});
 }
 // Evitar campañas incompatibles sobre un mismo producto en fechas superpuestas.
 const overlap=d.campaigns.some(c=>c.id!==editId&&c.items?.some(x=>items.some(it=>it.productId===x.productId))&&from<=c.to&&to>=c.from);
 if(overlap){alert('Las fechas se superponen con otra campaña del mismo producto. Edita la campaña existente o cambia las fechas.');return;}
 const campaign={id:editId||'camp-'+Date.now(),title,from,to,reason,items,status:'Borrador',updatedAt:new Date().toISOString()};
 if(editId)d.campaigns=d.campaigns.map(c=>c.id===editId?campaign:c);else d.campaigns.push(campaign);
 api.save();editId=campaign.id;renderList();const note=$('#nzaCampaignSavedNotice');if(note){note.hidden=false;note.innerHTML='Campaña <strong>'+esc(campaign.title)+'</strong> guardada en taller. <button type="button" data-preview-campaign="'+esc(campaign.id)+'">Ver en tienda</button>. Todavía no se publicó.';note.scrollIntoView({behavior:'smooth',block:'nearest'});}
});
$('#nzaCampaignList')?.addEventListener('click',e=>{
 const id=e.target.dataset.loadCampaign;if(id){load(id);return;}
 const preview=e.target.dataset.previewCampaign;if(preview){previewCampaign(preview);return;}
  if(e.target.dataset.applyCampaign){applyCampaign(e.target.dataset.applyCampaign);return;}
  if(e.target.dataset.disableCampaign){disableCampaign(e.target.dataset.disableCampaign);return;}
  if(e.target.dataset.openWorkshop){openWorkshop();return;}
 const del=e.target.dataset.removeCampaign;if(!del)return;
 if(!confirm('¿Eliminar esta campaña de prueba?'))return;
 const d=data();d.campaigns=d.campaigns.filter(c=>c.id!==del);api.save();if(editId===del)reset();renderList();
});
$('#nzaCampaignSavedNotice')?.addEventListener('click',e=>{const id=e.target.dataset.previewCampaign;if(id)previewCampaign(id);if(e.target.dataset.openWorkshop)openWorkshop();});
$('#nzaCampaignClear')?.addEventListener('click',reset);
$('#nzaPromoGoPreview')?.addEventListener('click',()=>api.nav('vista-previa'));
window.addEventListener('nzer-admin-updated',renderList);
/* Ejemplo inicial exclusivo del taller; no modifica precios del catálogo público. */
{
 const d=data();
 if(!d.campaigns.length&&!d.campaignWorkshopSeeded){
  const a=products().find(p=>p.storeId==='magnet'),b=products().find(p=>p.storeId==='train');
  if(a&&b){
   d.campaigns.push({id:'camp-202611270001',title:'Navidad NZER · Taller',from:'2026-12-10',to:'2026-12-24',reason:'Fecha festiva',status:'Borrador',
     items:[{productId:a.id,storeId:a.storeId,offerPrice:69},{productId:b.id,storeId:b.storeId,offerPrice:45}],updatedAt:new Date().toISOString()});
  }
  d.campaignWorkshopSeeded=true;api.save();
 }
}
selectGroup();renderList();
})();