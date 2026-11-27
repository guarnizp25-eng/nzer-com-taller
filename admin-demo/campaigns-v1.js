/* NZER ADMIN · Campañas manuales de taller. Nunca publica ofertas comerciales. */
(()=>{'use strict';
const api=window.NZER_ADMIN_MOCK;if(!api)return;
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'S/ '+Number(n).toFixed(2),fmt=n=>Number(n).toFixed(1)+'%';
const form=$('#nzaCampaignForm');if(!form)return;
let editId=null,selected={};
const products=()=>api.getData().products||[];
const data=()=>{const d=api.getData();if(!Array.isArray(d.campaigns))d.campaigns=[];return d};
function reset(){editId=null;selected={};form.reset();drawPicker();drawTotals();}
function currentRows(){return products().filter(p=>selected[p.id]!==undefined).map(p=>({p,price:Number(selected[p.id])}));}
function drawTotals(){
 const entries=currentRows();const changed=entries.filter(({p,price})=>Number.isFinite(price)&&price>=0&&price<Number(p.price));
 $('#nzaCampaignTotals').textContent=entries.length?entries.length+' productos seleccionados · '+changed.length+' descuentos válidos (precio promocional menor al regular).':'Selecciona productos y establece su precio promocional.';
}
function drawPicker(){
 const root=$('#nzaCampaignProducts'),term=($('#nzaCampaignSearch')?.value||'').trim().toLocaleLowerCase('es');
 const list=products().filter(p=>!term||(p.name+' '+p.sku).toLocaleLowerCase('es').includes(term));
 root.innerHTML=list.map(p=>{
 const chosen=Object.prototype.hasOwnProperty.call(selected,p.id),regular=Number(p.price),price=chosen?selected[p.id]:'';
 const discount=chosen&&Number(price)>=0&&Number(price)<regular?((regular-Number(price))/regular*100):0;
 const cost=Number(p.cost)||0,margin=chosen?Number(price)-cost:0;
 return '<div class="nza-promo-item" data-id="'+esc(p.id)+'"><label class="nza-promo-check"><input type="checkbox" data-pick="'+esc(p.id)+'" '+(chosen?'checked':'')+'><span class="nza-promo-photo">'+(p.image?'<img src="'+esc(p.image)+'" alt="">':'—')+'</span><span class="nza-promo-name"><strong>'+esc(p.name)+'</strong><small>'+esc(p.sku)+'</small></span></label>'+
 '<div class="nza-promo-prices"><span>Regular <strong>'+money(regular)+'</strong></span><label>Promoción (S/)<input type="number" min="0.01" step=".01" data-offer="'+esc(p.id)+'" value="'+(chosen?esc(price):'')+'" placeholder="0.00" '+(!chosen?'disabled':'')+'></label><span class="nza-promo-percent">'+(discount>0?'−'+fmt(discount):'—')+'</span></div>'+
 (chosen?'<small class="nza-promo-margin">Margen bruto referencial: '+money(margin)+(cost===0?' · costo no registrado':'')+'</small>':'')+'</div>';
 }).join('')||'<p>No se encontraron productos.</p>';
}
function renderList(){
 const root=$('#nzaCampaignList'),list=data().campaigns;
 root.innerHTML=list.length?list.slice().reverse().map(c=>{
  const valid=(c.items||[]).filter(x=>products().some(p=>p.id===x.productId));
  return '<div class="nza-campaign-card"><strong>'+esc(c.title)+'</strong><small>'+esc(c.from)+' → '+esc(c.to)+' · '+esc(c.reason)+' · '+valid.length+' productos</small><span>Borrador no publicado</span><div><button type="button" class="btn secondary sm" data-load-campaign="'+esc(c.id)+'">Editar</button><button type="button" class="btn ghost sm" data-remove-campaign="'+esc(c.id)+'">Eliminar</button></div></div>';
 }).join(''):'<p class="nza-promo-disclaimer">Todavía no hay campañas guardadas. Crea la primera para ver los precios tachados en la vista previa.</p>';
}
function load(id){
 const c=data().campaigns.find(x=>x.id===id);if(!c)return;
 editId=c.id;selected={};for(const x of c.items||[])if(products().some(p=>p.id===x.productId))selected[x.productId]=x.offerPrice;
 form.elements.title.value=c.title;form.elements.from.value=c.from;form.elements.to.value=c.to;form.elements.reason.value=c.reason;
 drawPicker();drawTotals();form.scrollIntoView({behavior:'smooth',block:'start'});
}
$('#nzaCampaignProducts')?.addEventListener('change',e=>{
 const id=e.target.dataset.pick;if(!id)return;
 if(e.target.checked){const p=products().find(x=>x.id===id);if(p)selected[id]=Math.max(.01,Math.round(p.price*.9*100)/100);}
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
 api.save();editId=campaign.id;renderList();alert('Campaña guardada en borrador. Revísala en Vista previa; no se publicó ninguna oferta.');
});
$('#nzaCampaignList')?.addEventListener('click',e=>{
 const id=e.target.dataset.loadCampaign;if(id){load(id);return;}
 const del=e.target.dataset.removeCampaign;if(!del)return;
 if(!confirm('¿Eliminar esta campaña de prueba?'))return;
 const d=data();d.campaigns=d.campaigns.filter(c=>c.id!==del);api.save();if(editId===del)reset();renderList();
});
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
drawPicker();drawTotals();renderList();
})();