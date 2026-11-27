/* NZER ADMIN — panel inicial basado únicamente en datos del catálogo local.
   No infiere ventas, costos reales, stock físico ni pagos. */
(()=>{
'use strict';
const api=window.NZER_ADMIN_MOCK;if(!api)return;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'S/ '+Number(n||0).toFixed(2);
function render(){
 const d=api.getData(),p=Array.isArray(d.products)?d.products:[];
 const units=p.reduce((n,x)=>n+(Number.isFinite(Number(x.stock))?Math.max(0,Number(x.stock)):0),0);
 const prepared=p.filter(x=>x.status==='Preparado').length;
 const pending=p.filter(x=>x.status==='Borrador').length;
 const root=$('#stats');if(root)root.innerHTML=[
  ['Productos registrados',p.length],['Unidades anotadas',units],['Preparados para revisión',prepared],['Borradores',pending]
 ].map(([label,num])=>'<div class="stat"><span>'+esc(label)+'</span><strong>'+esc(num)+'</strong></div>').join('');
 const cats=$('#nzaHomeCategories');
 if(cats){
  const counts=new Map();for(const x of p){const cat=x.category||'Sin categoría';counts.set(cat,(counts.get(cat)||0)+1)}
  const entries=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'es'));
  cats.innerHTML=entries.length?entries.map(([name,count])=>'<div class="nza-category-item"><div><strong>'+esc(name)+'</strong><span>'+count+' producto'+(count===1?'':'s')+'</span></div><div class="nza-category-bar"><i style="width:'+(p.length?count/p.length*100:0)+'%"></i></div></div>').join(''):'<p>No hay productos registrados.</p>';
 }
 const featured=$('#nzaHomeFeatured');
 if(featured)featured.innerHTML=p.slice(0,5).map(x=>'<div class="mini-product"><div class="product-name"><span class="thumb">'+(x.image?'<img src="'+esc(x.image)+'" alt="" loading="lazy">':'—')+'</span><span>'+esc(x.name)+'<small>'+esc(x.sku)+'</small></span></div><span>'+money(x.price)+'</span><span class="pill">'+esc(x.status)+'</span></div>').join('')||'<p>No hay productos registrados.</p>';
 const inv=$('#nzaHomeStock');
 if(inv){
  const withUnits=p.filter(x=>Number(x.stock)>0).length;
  inv.innerHTML='<div><span>Referencias registradas</span><b>'+p.length+'</b></div>'+
  '<div><span>Referencias con unidades anotadas</span><b>'+withUnits+'</b></div>'+
  '<div><span>Unidades anotadas</span><b>'+units+'</b></div>'+
  '<p class="nza-home-disclaimer">Los valores provienen de las ediciones de este navegador. No certifican existencias físicas.</p>';
 }
 const promo=$('#nzaHomePromo');
 if(promo){
  const rows=Array.isArray(d.campaigns)?d.campaigns:[];
  promo.innerHTML=rows.length?rows.slice().reverse().slice(0,3).map(c=>'<div class="nza-home-promo"><strong>'+esc(c.title)+'</strong><p>'+esc(c.from)+' al '+esc(c.to)+' · '+(c.items?.length||0)+' producto(s)</p><small>Borrador de taller · Sin publicar</small></div>').join(''):'<p class="nza-home-empty">No hay campañas guardadas.</p>';
 }
}
window.addEventListener('nzer-admin-updated',render);
document.querySelector('[data-section="inicio"]')?.addEventListener('click',render);
document.querySelectorAll('[data-go="inicio"]').forEach(b=>b.addEventListener('click',render));
render();
})();