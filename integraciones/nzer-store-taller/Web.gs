/**
 * Portal administrativo de pruebas para desplegar con acceso "Solo yo".
 * Ejecutar como "Usuario que accede a la aplicación".
 * IMPORTANTE: este portal no es el endpoint público del carrito.
 */
function doGet(e) {
  assertTallerOperator_();
  return HtmlService.createHtmlOutputFromFile('Admin')
    .setTitle('NZER STORE · TALLER | Pedidos')
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}
function assertTallerOperator_() {
  const allowed=PropertiesService.getScriptProperties().getProperty('NZER_TALLER_ADMIN_EMAIL');
  const actual=Session.getEffectiveUser().getEmail();
  if(!allowed||!actual||allowed.toLowerCase()!==actual.toLowerCase()){
    throw new Error('Acceso de pruebas no autorizado. Verifique NZER_TALLER_ADMIN_EMAIL.');
  }
}
function adminTallerOrders() {
  assertTallerOperator_();
  return tallerListOrders_().slice(-100).reverse().map(o=>({
    ...o,date:o.date instanceof Date?o.date.toISOString():String(o.date)
  }));
}
function adminTallerCatalog() {
  assertTallerOperator_();
  return [...tallerCatalog_(tallerDb_()).values()].map(p=>({
    id:p.id,sku:p.sku,name:p.name,
    available:p.stock-p.reserved,price:p.price
  }));
}
function adminTallerCreateOrder(payload) {
  assertTallerOperator_();
  // Solo pruebas autorizadas, no es un canal de compra pública.
  const items=Array.isArray(payload?.items)?payload.items:[];
  const key=Utilities.getUuid().replace(/-/g,'');
  return tallerCreateOrder_({
    idempotencyKey:key,channel:'FISICA',
    customerRef:'Cliente ficticio — TALLER',items
  });
}
function adminTallerChangeOrder(id,action,method){
  assertTallerOperator_();
  return tallerChangeOrder_(id,action,method||'EFECTIVO');
}
function adminTallerAudit(){
  assertTallerOperator_();
  return tallerAuditStock_();
}
