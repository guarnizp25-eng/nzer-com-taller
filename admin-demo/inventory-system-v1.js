/* NZER ADMIN · Inventario sistemático de PRUEBA.
   Cada saldo es una proyección de movimientos. Sin ventas, pagos ni respaldo en servidor. */
(()=>{
'use strict';
const api=window.NZER_ADMIN_MOCK;
if(!api)return;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validInt=n=>Number.isSafeInteger(n)&&n>=0&&n<=1000000;
const iso=()=>new Date().toISOString();
let active='';
function movements(data){if(!Array.isArray(data.inventoryMovements))data.inventoryMovements=[];return data.inventoryMovements;}
function balanceFor(data,id){return movements(data).reduce((sum,m)=>m.productId===id?sum+Number(m.delta||0):sum,0)}
function reconcile(data){
 if(!Array.isArray(data.products))return;
 const ledger=movements(data);
 for(const p of data.products){const stock=balanceFor(data,p.id);p.stock=validInt(stock)?stock:0;}
}
/* Datos exclusivamente para comprobar el sistema, no mercancía existente. */
const DEMO_STOCK=Object.freeze({
 magnet:12,builder:8,truck:16,excavator:5,toolbox:3,ridecar:10,track:6,garage:4,
 train:14,cubes:7,animals:11,abacus:9,balance:2,hammer:5,woodblocks:13,crane:0,
 activity:1,fruits:12,shapes:8,rainbow:6
});
function seedWorkshop(data){
 const ledger=movements(data);
 if(ledger.length||data.workshopSeedVersion===1)return false;
 const matched=data.products.filter(p=>Object.prototype.hasOwnProperty.call(DEMO_STOCK,p.storeId));
 if(matched.length!==20||data.products.length!==20||data.products.some(p=>Number(p.stock)!==0))return false;
 const now=Date.now();
 const add=(p,type,delta,after,reason,days,index)=>{
  ledger.push({id:'workshop-'+p.storeId+'-'+type+'-'+index,at:new Date(now-days*86400000+index*1000).toISOString(),
   productId:p.id,sku:p.sku,name:p.name,type,delta,stockAfter:after,reason,reference:'TALLER-NZER'});
 };
 matched.forEach((p,i)=>{
  const goal=DEMO_STOCK[p.storeId];
  const extra=p.storeId==='crane'?5:(p.storeId==='toolbox'?2:(p.storeId==='activity'?3:0));
  const opening=goal+extra;
  if(opening>0)add(p,'apertura',opening,opening,'Saldo inicial de simulación (no es inventario real)',6,i);
  if(extra>0)add(p,'salida',-extra,goal,'Salida de práctica para probar historial y descuento',2,i);
 });
 // Una entrada posterior muestra también el comportamiento de una reposición.
 const truck=matched.find(p=>p.storeId==='truck');
 if(truck){const initial=DEMO_STOCK.truck-4;
  const row=ledger.find(m=>m.productId===truck.id&&m.type==='apertura');
  if(row){row.delta=initial;row.stockAfter=initial;}
  add(truck,'entrada',4,DEMO_STOCK.truck,'Reposición de práctica',1,23);
 }
 data.workshopSeedVersion=1;
 return true;
}
function init(){
 const d=api.getData();const list=movements(d);
 if(d.inventoryLedgerVersion!==1){
  for(const p of d.products){
   const initial=Number(p.stock)||0;
   if(validInt(initial)&&initial>0&&!list.some(m=>m.productId===p.id)){
    list.push({id:'opening-'+p.id+'-'+Date.now(),at:iso(),productId:p.id,sku:p.sku,name:p.name,type:'apertura',delta:initial,stockAfter:initial,reason:'Saldo anterior migrado desde prototipo',reference:'Migración automática'});
   }
  }
  d.inventoryLedgerVersion=1;
  seedWorkshop(d);
  reconcile(d);
  api.save();
 }else{
  if(seedWorkshop(d)){reconcile(d);api.save();}
  else reconcile(d);
 }
}
function select(id){
 if(!api.getData().products.some(p=>p.id===id))return;
 active=id;
 const selector=$('#nzaInventoryProduct');
 if(selector)selector.value=id;
 updateCurrent();
 $('#nzaInventoryForm')?.querySelector('[name="quantity"]')?.focus();
}
function updateCurrent(){
 const d=api.getData(),selector=$('#nzaInventoryProduct'),id=selector?.value||active;
 const p=d.products.find(x=>x.id===id);
 const stock=$('#nzaInventoryCurrentStock');
 if(stock)stock.textContent=p?String(p.stock):'—';
 const typ=$('#nzaInventoryType')?.value;
 const label=$('#nzaInventoryQuantityLabel');
 if(label)label.textContent=typ==='ajuste'?'Stock contado físicamente (saldo objetivo)':'Cantidad de unidades';
}
function render(){
 const d=api.getData(),products=d.products||[],ledger=movements(d);
 const totals=$('#nzaInvStats');
 if(totals){
  const sum=products.reduce((n,p)=>n+(Number(p.stock)||0),0);
  const zero=products.filter(p=>p.stock===0).length,low=products.filter(p=>p.stock>0&&p.stock<=3).length;
  totals.innerHTML=[['Productos',products.length],['Unidades anotadas',sum],['Sin unidades',zero],['Stock bajo (1–3)',low]].map(([a,b])=>'<div class="stat"><span>'+esc(a)+'</span><strong>'+b+'</strong></div>').join('');
 }
 const selector=$('#nzaInventoryProduct');
 if(selector){
  const previous=active||selector.value;
  selector.innerHTML=products.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.sku)+' · '+esc(p.name)+'</option>').join('');
  active=products.some(p=>p.id===previous)?previous:(products[0]?.id||'');
  selector.value=active;
 }
 const term=($('#nzaInventorySearch')?.value||'').trim().toLocaleLowerCase('es');
 const filtered=products.filter(p=>!term||(p.name+' '+p.sku).toLocaleLowerCase('es').includes(term));
 const rows=$('#inventoryRows');
 if(rows)rows.innerHTML=filtered.map(p=>{
  const stock=Number(p.stock)||0;
  return '<tr><td>'+esc(p.name)+'</td><td>'+esc(p.sku)+'</td><td><strong>'+stock+'</strong></td><td><span class="pill '+(stock<=3?'low':'')+'">'+(stock===0?'Sin unidades':stock<=3?'Stock bajo':'Con unidades')+'</span></td><td><button type="button" class="btn secondary sm" data-stock="'+esc(p.id)+'">Registrar movimiento</button></td></tr>';
 }).join('')||'<tr><td colspan="5" class="empty">Sin productos coincidentes.</td></tr>';
 const history=$('#nzaInventoryHistoryRows');
 if(history){
  history.innerHTML=ledger.slice().reverse().slice(0,150).map(m=>{
   const date=new Date(m.at);
   const fmt=Number.isFinite(date.getTime())?date.toLocaleString('es-PE',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
   const qty=Number(m.delta);
   return '<tr><td>'+esc(fmt)+'</td><td>'+esc(m.name||m.sku||m.productId)+'<small style="display:block;color:#728078">'+esc(m.sku||'')+'</small></td><td>'+esc(({entrada:'Ingreso',salida:'Salida',ajuste:'Ajuste',apertura:'Apertura'})[m.type]||m.type)+'</td><td class="'+(qty<0?'nza-negative':'nza-positive')+'">'+(qty>0?'+':'')+qty+'</td><td>'+Number(m.stockAfter)+'</td><td>'+esc(m.reason||'')+(m.reference?' · '+esc(m.reference):'')+'</td></tr>';
  }).join('')||'<tr><td colspan="6" class="empty">Aún no hay movimientos registrados.</td></tr>';
 }
 updateCurrent();
}
function record(event){
 event.preventDefault();
 const d=api.getData(),f=event.currentTarget,id=f.elements.productId.value,type=f.elements.type.value;
 const p=d.products.find(row=>row.id===id);if(!p){alert('Selecciona un producto.');return}
 const quantity=Number(f.elements.quantity.value),reason=f.elements.reason.value.trim(),reference=f.elements.reference.value.trim();
 if(!validInt(quantity)||(type!=='ajuste'&&quantity===0)){alert('Ingresa una cantidad válida de unidades.');return}
 if(!reason){alert('Indica el motivo del movimiento.');return}
 const prev=balanceFor(d,id);
 const delta=type==='entrada'?quantity:type==='salida'?-quantity:type==='ajuste'?quantity-prev:NaN;
 if(!Number.isSafeInteger(delta)||prev+delta<0||prev+delta>1000000){alert('No hay unidades suficientes o se excedió el límite de registro.');return}
 if(delta===0){alert('El conteo coincide con el saldo actual; no hay movimiento que registrar.');return}
 const after=prev+delta;
 if(!confirm('Registrar '+({entrada:'INGRESO',salida:'SALIDA',ajuste:'AJUSTE'})[type]+' de '+p.name+'\nVariación: '+(delta>0?'+':'')+delta+' unidades\nSaldo: '+prev+' → '+after+'\nMotivo: '+reason+'\n\nSolo afectará el prototipo local.'))return;
 const entry={id:'mov-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),at:iso(),productId:id,sku:p.sku,name:p.name,type,delta,stockAfter:after,reason,reference};
 movements(d).push(entry);
 api.save();
 f.elements.quantity.value='';f.elements.reason.value='';f.elements.reference.value='';
 active=id;render();
}
window.NZER_INVENTORY={reconcile,render,select,balanceFor};
init();
$('#nzaInventoryForm')?.addEventListener('submit',record);
$('#nzaInventoryProduct')?.addEventListener('change',e=>{active=e.target.value;updateCurrent()});
$('#nzaInventoryType')?.addEventListener('change',updateCurrent);
$('#nzaInventorySearch')?.addEventListener('input',render);
window.addEventListener('nzer-admin-updated',render);
render();
})();