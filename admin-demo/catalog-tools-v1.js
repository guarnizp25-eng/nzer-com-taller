/* NZER ADMIN · Respaldo y restauración de catálogo de PRUEBA. No publica ni sincroniza datos. */
(()=>{
'use strict';
const api=window.NZER_ADMIN_MOCK;
const exportButton=document.getElementById('nzaExportCatalog');
const importButton=document.getElementById('nzaImportCatalog');
const picker=document.getElementById('nzaCatalogFile');
if(!api||!exportButton||!importButton||!picker)return;
const categories=new Set(['Construcción','Regalos','Juguetes NZER Kids','Carros','Madera didáctica','Otros']);
const statuses=new Set(['Borrador','Preparado']);
function validate(obj){
 if(!obj||typeof obj!=='object'||!Array.isArray(obj.products))throw Error('El archivo no contiene un catálogo NZER válido.');
 if(obj.products.length>1000)throw Error('El archivo supera los 1000 productos permitidos en esta prueba.');
 const ids=new Set(),skus=new Set();
 const products=obj.products.map((row,i)=>{
  if(!row||typeof row!=='object')throw Error('Producto '+(i+1)+' no válido.');
  const id=String(row.id||'').trim(),name=String(row.name||'').trim(),sku=String(row.sku||'').trim(),category=String(row.category||'').trim();
  if(!/^[a-zA-Z0-9_-]{1,60}$/.test(id)||!name||name.length>120||!sku||sku.length>60||!categories.has(category))throw Error('Revisa ID, nombre, SKU o categoría del producto '+(i+1)+'.');
  if(ids.has(id)||skus.has(sku.toUpperCase()))throw Error('Hay IDs o códigos SKU duplicados.');
  ids.add(id);skus.add(sku.toUpperCase());
  const price=Number(row.price),cost=Number(row.cost),stock=Number(row.stock);
  if(!Number.isFinite(price)||price<0||!Number.isFinite(cost)||cost<0||!Number.isSafeInteger(stock)||stock<0)throw Error('Precio, costo o stock no válido en '+sku+'.');
  if(!statuses.has(row.status))throw Error('Estado no válido en '+sku+'.');
  const image=String(row.image||'').trim(),description=String(row.description||'');
  const storeId=String(row.storeId||'');
  if(storeId&&(!/^[a-zA-Z0-9_-]{1,60}$/.test(storeId)))throw Error('Identificador de tienda inválido: '+sku+'.');
  if(image&&(!/^https:\/\//i.test(image)||image.length>2000))throw Error('La imagen debe tener una URL HTTPS válida: '+sku+'.');
  if(description.length>2000)throw Error('Descripción demasiado larga: '+sku+'.');
  return {id,...(storeId?{storeId}:{}),name,sku,category,cost,price,stock,status:row.status,image,description};
 });
 let promo=null;
 if(obj.promo!==null&&obj.promo!==undefined){
  if(typeof obj.promo!=='object'||Array.isArray(obj.promo))throw Error('La promoción tiene un formato inválido.');
  const p=obj.promo;
  const title=String(p.title||'').trim(),discount=Number(p.discount);
  const product=String(p.product||''),from=String(p.from||''),to=String(p.to||'');
  if(title.length>140||!Number.isFinite(discount)||discount<0||discount>100||product.length>120||!/^(|\d{4}-\d{2}-\d{2})$/.test(from)||!/^(|\d{4}-\d{2}-\d{2})$/.test(to)||from&&to&&from>to)throw Error('La promoción no pasó la validación.');
  promo={title,discount,product,from,to};
 }
 let inventoryMovements=[];
if(obj.inventoryLedgerVersion===1){
 if(!Array.isArray(obj.inventoryMovements)||obj.inventoryMovements.length>20000)throw Error('Historial de inventario ausente o demasiado grande.');
 const seen=new Set(),balances=new Map();
 inventoryMovements=obj.inventoryMovements.map((m,i)=>{
  if(!m||typeof m!=='object')throw Error('Movimiento inválido '+(i+1)+'.');
  const id=String(m.id||''),productId=String(m.productId||''),sku=String(m.sku||''),name=String(m.name||''),type=String(m.type||''),at=String(m.at||''),reason=String(m.reason||''),reference=String(m.reference||'');
  const delta=Number(m.delta),stockAfter=Number(m.stockAfter);
  if(!/^[a-zA-Z0-9_-]{1,110}$/.test(id)||seen.has(id)||!productId||productId.length>70||sku.length>60||name.length>120||!['entrada','salida','ajuste','apertura'].includes(type)||!Number.isFinite(Date.parse(at))||!Number.isSafeInteger(delta)||!Number.isSafeInteger(stockAfter)||stockAfter<0||stockAfter>1000000||!reason||reason.length>180||reference.length>80)throw Error('Movimiento de inventario inválido '+(i+1)+'.');
  const prev=balances.get(productId)||0;
  if(prev+delta!==stockAfter)throw Error('El saldo histórico no coincide en el movimiento '+(i+1)+'.');
  seen.add(id);balances.set(productId,stockAfter);
  return {id,productId,sku,name,type,at,delta,stockAfter,reason,reference};
 });
 for(const p of products)if((balances.get(p.id)||0)!==p.stock)throw Error('El stock de '+p.sku+' no coincide con su historial.');
}
let campaigns=[];
 if(obj.campaigns!==undefined){
  if(!Array.isArray(obj.campaigns)||obj.campaigns.length>200)throw Error('Campañas con formato incorrecto.');
  const campaignIds=new Set();
  campaigns=obj.campaigns.map(c=>{
   if(!c||typeof c!=='object'||!/^camp-[0-9]+$/.test(String(c.id))||campaignIds.has(c.id))throw Error('Identificador de campaña inválido.');
   campaignIds.add(c.id);
   if(typeof c.title!=='string'||!c.title.trim()||c.title.length>80||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(c.from)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(c.to)||c.from>c.to||!Array.isArray(c.items)||!c.items.length||c.items.length>1000||c.status!=='Borrador')throw Error('Campaña incompleta.');
   const itemIds=new Set();
   const items=c.items.map(x=>{const p=products.find(p=>p.id===x.productId),v=Number(x.offerPrice);
    if(!p||itemIds.has(x.productId)||!Number.isFinite(v)||v<=0||v>=p.price||Math.abs(Math.round(v*100)-v*100)>0.00001)throw Error('Precio de campaña no válido.');
    itemIds.add(x.productId);return {productId:p.id,storeId:p.storeId||'',offerPrice:v};
   });
   return {id:c.id,title:c.title.trim(),from:c.from,to:c.to,reason:String(c.reason||'Promoción especial').slice(0,80),items,status:'Borrador',updatedAt:String(c.updatedAt||'')};
  });
 }
 return {products,promo,campaigns,...(obj.inventoryLedgerVersion===1?{inventoryLedgerVersion:1,inventoryMovements}:{})};
}
exportButton.addEventListener('click',()=>{
 const current=api.getData();
 const payload={format:'nzer-admin-demo-catalog',version:1,exportedAt:new Date().toISOString(),products:current.products,promo:current.promo||null,inventoryLedgerVersion:current.inventoryLedgerVersion||0,inventoryMovements:current.inventoryMovements||[],campaigns:current.campaigns||[]};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='NZER-CATALOGO-RESPALDO-'+new Date().toISOString().slice(0,10)+'.json';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
importButton.addEventListener('click',()=>picker.click());
picker.addEventListener('change',async()=>{
 const file=picker.files&&picker.files[0];picker.value='';if(!file)return;
 if(file.size>2*1024*1024){alert('El respaldo supera el máximo de 2 MB.');return;}
 try{
  const raw=JSON.parse(await file.text());
  if(raw.format!=='nzer-admin-demo-catalog'||raw.version!==1)throw Error('Solo se admiten respaldos creados por NZER ADMIN.');
  const clean=validate(raw);
  if(!confirm('Restaurar '+clean.products.length+' productos y su promoción de prueba?\n\nReemplazará los datos de ESTE navegador. Antes puedes descargar un respaldo. No afecta la web pública.'))return;
  const current=api.getData();
  current.products=clean.products;current.promo=clean.promo;current.inventoryLedgerVersion=clean.inventoryLedgerVersion||0;current.inventoryMovements=clean.inventoryMovements||[];current.campaigns=clean.campaigns||[];
  api.save();
  api.nav('productos');
  alert('Respaldo restaurado en este navegador. Comprueba el catálogo y la vista previa. No se publicó nada.');
 }catch(err){alert('No se pudo importar el respaldo: '+(err&&err.message||'Archivo inválido'));}
});
})();
