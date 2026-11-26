
/* Inicio NZER V5 — productos destacados enlazados a NZER STORE */
(function(){
'use strict';
const featuredIds=['woodblocks','truck','toolbox','ridecar','abacus','animals'];
const productUrl=id=>(document.body.classList.contains('nzer-store-unified')?'producto/':'store/producto/')+'index.html?id='+encodeURIComponent(id);
const cartIcon='<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.5 13.5h12.5l2-10H6"/></svg>';
function display(p){
return '<article class="n5-product">'+
'<a href="store/producto/index.html?id='+encodeURIComponent(p.id)+'" aria-label="Ver '+p.name+'">'+
'<div class="n5-product-image">'+productArtwork(p)+'<span class="n5-product-tag">REFERENCIAL</span></div></a>'+
'<div class="n5-product-body"><a href="store/producto/index.html?id='+encodeURIComponent(p.id)+'"><h3 class="n5-product-name">'+p.name+'</h3></a>'+
'<div class="n5-product-bottom"><span class="n5-product-price">S/ '+Number(p.price).toFixed(2)+'</span>'+
'<button class="n5-product-buy" type="button" data-n5-add="'+p.id+'" aria-label="Agregar '+p.name+' al carrito">'+cartIcon+'</button></div></div></article>';}
function renderOffers(){
 const root=document.getElementById('n5-offers');
 if(!root||typeof NZER_PRODUCTS==='undefined'||typeof demoDiscount!=='function')return;
 const products=NZER_PRODUCTS.filter(p=>demoDiscount(p)>0).sort((a,b)=>demoDiscount(b)-demoDiscount(a));
 root.innerHTML=products.map(p=>
  '<article class="n5-offer-card">'+
  '<a class="n5-offer-photo" href="store/producto/index.html?id='+encodeURIComponent(p.id)+'" aria-label="Conocer '+p.name+'">'+
  productArtwork(p)+'<span class="n5-offer-badge">−'+demoDiscount(p)+'%</span></a>'+
  '<div class="n5-offer-info"><span class="n5-offer-category">'+p.categoryLabel+'</span>'+
  '<a href="store/producto/index.html?id='+encodeURIComponent(p.id)+'"><h3>'+p.name+'</h3></a>'+
  '<div class="n5-offer-prices"><del>S/ '+p.price.toFixed(2)+'</del><strong>S/ '+demoPrice(p).toFixed(2)+'</strong></div>'+
  '<p>Precio promocional simulado</p>'+
  '<a class="n5-offer-link" href="store/producto/index.html?id='+encodeURIComponent(p.id)+'">Ver producto →</a>'+
  '</div></article>').join('');
}
function render(category){
const root=document.getElementById('n5-featured');if(!root)return;
if(typeof NZER_PRODUCTS==='undefined'||typeof art==='undefined')return;
let products=NZER_PRODUCTS.filter(p=>featuredIds.includes(p.id));
products.sort((a,b)=>featuredIds.indexOf(a.id)-featuredIds.indexOf(b.id));
if(category!=='all'){products=NZER_PRODUCTS.filter(p=>p.category===category).slice(0,6);}
root.innerHTML=products.map(display).join('')||'<p>No hay productos de esta categoría.</p>';
root.querySelectorAll('button[data-n5-add]').forEach(btn=>btn.addEventListener('click',()=>addToCart(btn.dataset.n5Add)));
}
function init(){
const root=document.getElementById('n5-featured');if(!root)return;
render('all');
renderOffers();
const train=document.getElementById('n5-train');
if(train&&typeof art!=='undefined')train.innerHTML=art.train||'';
document.querySelectorAll('[data-n5-category]').forEach(btn=>btn.addEventListener('click',()=>{
document.querySelectorAll('[data-n5-category]').forEach(el=>{const a=el===btn;el.classList.toggle('active',a);el.setAttribute('aria-pressed',String(a));});
render(btn.dataset.n5Category);
}));
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
})();
