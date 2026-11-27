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
 return {products,promo};
}
exportButton.addEventListener('click',()=>{
 const current=api.getData();
 const payload={format:'nzer-admin-demo-catalog',version:1,exportedAt:new Date().toISOString(),products:current.products,promo:current.promo||null};
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
  current.products=clean.products;current.promo=clean.promo;
  api.save();
  api.nav('productos');
  alert('Respaldo restaurado en este navegador. Comprueba el catálogo y la vista previa. No se publicó nada.');
 }catch(err){alert('No se pudo importar el respaldo: '+(err&&err.message||'Archivo inválido'));}
});
})();
