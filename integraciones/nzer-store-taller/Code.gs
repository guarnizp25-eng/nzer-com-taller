/**
 * NZER STORE · TALLER — backend de integración preparado, NO desplegado.
 * Vincular exclusivamente con la hoja independiente de pruebas mediante
 * Script Properties: NZER_TALLER_SPREADSHEET_ID.
 *
 * No se publica doGet/doPost: los pedidos web se conectarán únicamente
 * después de definir autenticación, prevención de abuso y transporte seguro.
 * Ninguna función aquí cobra dinero ni escribe en NZER V1 oficial.
 */
const NZER_TALLER_TABS=Object.freeze({
 ORDERS:'PEDIDOS',LINES:'DETALLE_PEDIDOS',STOCK:'INVENTARIO',EVENTS:'EVENTOS'
});
function tallerDb_(){
 const id=PropertiesService.getScriptProperties().getProperty('NZER_TALLER_SPREADSHEET_ID');
 if(!id)throw Error('Configurar NZER_TALLER_SPREADSHEET_ID con la base exclusiva del Taller');
 return SpreadsheetApp.openById(id);
}
function tallerSheet_(db,name){
 const sh=db.getSheetByName(name);
 if(!sh)throw Error('Falta la pestaña '+name);
 return sh;
}
function tallerRows_(sh){
 const last=sh.getLastRow();
 return last>1?sh.getRange(2,1,last-1,sh.getLastColumn()).getValues():[];
}
function tallerMoney_(n){
 const x=Number(n);
 if(!Number.isFinite(x)||x<0)throw Error('Importe inválido');
 return Math.round((x+Number.EPSILON)*100)/100;
}
function tallerCatalog_(db){
 return new Map(tallerRows_(tallerSheet_(db,NZER_TALLER_TABS.STOCK))
  .filter(r=>r[0]).map(r=>[String(r[0]),{
    id:String(r[0]),sku:String(r[1]),name:String(r[2]),
    stock:Number(r[4]),reserved:Number(r[5]),price:Number(r[7])
  }]));
}
function tallerOrderIndex_(db,requestKey){
 return tallerRows_(tallerSheet_(db,NZER_TALLER_TABS.ORDERS))
  .find(r=>String(r[12])===requestKey);
}
/**
 * Solo llamada de servidor previamente autenticada. No invocar directamente
 * desde una página pública con secretos incrustados en JavaScript.
 * request={idempotencyKey,channel,customerRef,items:[{productId,qty}]}.
 * El precio se calcula siempre desde la hoja central, no desde el navegador.
 */
function tallerCreateOrder_(request){
 if(!request||!Array.isArray(request.items)||!request.items.length||request.items.length>30)
  throw Error('Pedido inválido');
 const key=String(request.idempotencyKey||'');
 if(!/^[a-zA-Z0-9_-]{12,100}$/.test(key))throw Error('Clave de idempotencia inválida');
 const channel=String(request.channel||'');
 if(!['WEB','FISICA'].includes(channel))throw Error('Canal inválido');
 const lock=LockService.getScriptLock();
 lock.waitLock(15000);
 try{
  const db=tallerDb_(),existing=tallerOrderIndex_(db,key);
  if(existing)return {id:String(existing[0]),status:String(existing[4]),duplicate:true};
  const catalog=tallerCatalog_(db);
  const aggregate=new Map();
  for(const raw of request.items){
   const id=String(raw.productId||''),qty=Number(raw.qty);
   if(!catalog.has(id)||!Number.isSafeInteger(qty)||qty<=0||qty>99)
    throw Error('Producto o cantidad inválidos');
   aggregate.set(id,(aggregate.get(id)||0)+qty);
  }
  const lines=[];
  let total=0;
  for(const [id,qty] of aggregate){
   const p=catalog.get(id);
   if(p.stock-p.reserved<qty)throw Error('No hay stock disponible de '+p.name);
   const unit=tallerMoney_(p.price),lineTotal=tallerMoney_(unit*qty);
   lines.push({id,qty,sku:p.sku,name:p.name,unit,total:lineTotal});total+=lineTotal;
  }
  total=tallerMoney_(total);
  const now=new Date();
  const orderId='NZER-'+channel+'-'+Utilities.getUuid().slice(0,12).toUpperCase();
  const orders=tallerSheet_(db,NZER_TALLER_TABS.ORDERS);
  const details=tallerSheet_(db,NZER_TALLER_TABS.LINES);
  const stockSheet=tallerSheet_(db,NZER_TALLER_TABS.STOCK);
  const stockRows=tallerRows_(stockSheet);
  // Los productos se reservan antes de exponer el pedido como pendiente.
  // Si hay error durante la escritura, se requiere conciliación manual del entorno de pruebas.
  for(const line of lines){
   const i=stockRows.findIndex(r=>String(r[0])===line.id);
   if(i<0)throw Error('Inventario inconsistente');
   const current=Number(stockRows[i][5]);
   stockSheet.getRange(i+2,6).setValue(current+line.qty);
   stockSheet.getRange(i+2,7).setValue(Number(stockRows[i][4])-current-line.qty);
  }
  const customerRef=String(request.customerRef||'Visitante ficticio').slice(0,70);
  orders.appendRow([orderId,now,channel,customerRef,'PENDIENTE','SIN_CONFIRMAR','',total,0,total,now,'TALLER',key]);
  lines.forEach((l,i)=>details.appendRow([orderId,i+1,l.id,l.sku,l.name,l.qty,l.unit,0,l.total]));
  tallerEvent_(db,orderId,'PEDIDO_CREADO','','PENDIENTE','Reserva ficticia');
  return {id:orderId,status:'PENDIENTE',total,duplicate:false};
 }finally{lock.releaseLock()}
}
function tallerEvent_(db,orderId,type,previous,next,detail){
 tallerSheet_(db,NZER_TALLER_TABS.EVENTS)
  .appendRow([Utilities.getUuid(),orderId,new Date(),type,previous,next,detail,'TALLER']);
}
/** Lectura restringida al personal autorizado desde el servidor. */
function tallerListOrders_(){
 const db=tallerDb_();
 return tallerRows_(tallerSheet_(db,NZER_TALLER_TABS.ORDERS))
  .filter(r=>r[0]).map(r=>({id:String(r[0]),date:r[1],channel:r[2],
   customerRef:r[3],status:r[4],paymentStatus:r[5],total:Number(r[9])}));
}
/**
 * La validación bancaria / de caja todavía NO está implementada.
 * No se expone una función pública para confirmar pagos.
 * El cambio de estado requiere control administrativo separado.
 */

/**
 * Solo para un operador autorizado en ejecución de servidor.
 * No publicar como función invocable desde una página abierta al público.
 * Datos de prueba: el pago es una confirmación SIMULADA, sin integración bancaria.
 *
 * Evento posible: CONFIRMAR_PAGO, CANCELAR, ENTREGAR.
 * La actualización de existencias conserva el registro de cada cambio.
 */
function tallerChangeOrder_(orderId,action,paymentMethod){
 const id=String(orderId||'');
 if(!/^NZER-(WEB|FISICA)-[A-Z0-9-]{8,40}$/.test(id))throw Error('ID de pedido inválido');
 if(!['CONFIRMAR_PAGO','CANCELAR','ENTREGAR'].includes(action))throw Error('Acción no permitida');
 const lock=LockService.getScriptLock();
 lock.waitLock(15000);
 try{
  const db=tallerDb_();
  const orders=tallerSheet_(db,NZER_TALLER_TABS.ORDERS);
  const details=tallerSheet_(db,NZER_TALLER_TABS.LINES);
  const stock=tallerSheet_(db,NZER_TALLER_TABS.STOCK);
  const orderRows=tallerRows_(orders),index=orderRows.findIndex(r=>String(r[0])===id);
  if(index<0)throw Error('Pedido no encontrado');
  const order=orderRows[index],before=String(order[4]);
  const permitted=(before==='PENDIENTE'&&['CONFIRMAR_PAGO','CANCELAR'].includes(action))
    ||(before==='PAGADO'&&action==='ENTREGAR');
  if(!permitted)throw Error('Transición no permitida desde '+before);
  const next=action==='CONFIRMAR_PAGO'?'PAGADO':action==='CANCELAR'?'CANCELADO':'ENTREGADO';
  const method=String(paymentMethod||'');
  if(action==='CONFIRMAR_PAGO'&&!['YAPE','PLIN','TRANSFERENCIA','EFECTIVO','TARJETA_SIMULADA'].includes(method))
   throw Error('Indica un medio de pago simulado');
  const lines=tallerRows_(details).filter(r=>String(r[0])===id);
  if(!lines.length)throw Error('Pedido sin detalle');
  const rows=tallerRows_(stock);
  const diff=new Map();
  for(const line of lines){
   const productId=String(line[2]),qty=Number(line[5]);
   if(!Number.isSafeInteger(qty)||qty<=0)throw Error('Detalle de pedido inválido');
   diff.set(productId,(diff.get(productId)||0)+qty);
  }
  const updates=[];
  if(action!=='ENTREGAR'){
   for(const [productId,qty] of diff){
    const row=rows.findIndex(r=>String(r[0])===productId);
    if(row<0)throw Error('Inventario sin producto '+productId);
    const physical=Number(rows[row][4]),reserved=Number(rows[row][5]);
    if(!Number.isSafeInteger(physical)||!Number.isSafeInteger(reserved)||reserved<qty)
      throw Error('Inventario reservado inconsistente: '+productId);
    if(action==='CONFIRMAR_PAGO'&&physical<qty)
      throw Error('Existencias insuficientes: '+productId);
    updates.push({row:row+2,physical:action==='CONFIRMAR_PAGO'?physical-qty:physical,
      reserved:reserved-qty});
   }
  }
  // Google Sheets no proporciona transacciones ACID. El bloqueo evita
  // ediciones concurrentes de este script; anomalías requieren conciliación.
  updates.forEach(u=>{
    stock.getRange(u.row,5,1,3).setValues([[u.physical,u.reserved,u.physical-u.reserved]]);
  });
  const fields=orders.getRange(index+2,5,1,7).getValues()[0];
  fields[0]=next; // estado
  if(action==='CONFIRMAR_PAGO'){fields[1]='CONFIRMADO_SIMULADO';fields[2]=method;}
  fields[6]=new Date(); // fecha actualizacion (col K)
  orders.getRange(index+2,5,1,7).setValues([fields]);
  tallerEvent_(db,id,action,before,next,'Solo simulación / sin movimiento de dinero');
  return {id,status:next,paymentStatus:fields[1],total:Number(order[9])};
 }finally{lock.releaseLock()}
}
/** Verificación de consistencia previa a cualquier futura publicación. */
function tallerAuditStock_(){
 const db=tallerDb_();
 const orders=tallerRows_(tallerSheet_(db,NZER_TALLER_TABS.ORDERS));
 const details=tallerRows_(tallerSheet_(db,NZER_TALLER_TABS.LINES));
 const pendingIds=new Set(orders.filter(r=>String(r[4])==='PENDIENTE').map(r=>String(r[0])));
 const reserved=new Map();
 details.filter(r=>pendingIds.has(String(r[0]))).forEach(r=>{
  const id=String(r[2]);reserved.set(id,(reserved.get(id)||0)+Number(r[5]));
 });
 return tallerRows_(tallerSheet_(db,NZER_TALLER_TABS.STOCK)).filter(r=>r[0])
  .map(r=>({id:String(r[0]),physical:Number(r[4]),reserved:Number(r[5]),
    expectedReserved:reserved.get(String(r[0]))||0,available:Number(r[6])}))
  .filter(r=>r.physical<0||r.reserved!==r.expectedReserved||
    r.available!==r.physical-r.reserved);
}
