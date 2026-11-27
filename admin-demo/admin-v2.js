/* NZER ADMIN V2 — Interacciones visuales; nunca conecta con datos comerciales reales. */
(()=>{
'use strict';
const api=window.NZER_ADMIN_MOCK;if(!api)return;
const $=s=>document.querySelector(s);
const money=n=>'S/ '+Number(n||0).toFixed(2);
const esc=t=>String(t??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
let selected=null,chartMode='ingresos';
const sym=(p)=>p.category==='Regalos'?'🎁':p.category==='Carros'?'🚛':p.category==='Juguetes NZER Kids'?'🧸':p.category==='Madera didáctica'?'🧮':'🧩';
const card=(name,n,i=0)=>'<div class="stat"><span class="stat-icon">'+['▣','▤','◇','▱'][i]+'</span><span>'+esc(name)+'</span><strong>'+esc(n)+'</strong><span class="stat-sub">Datos de muestra</span></div>';
function chart(){
 const root=$('#nzaChart');if(!root)return;
 // Curvas visuales normalizadas. Datos deliberadamente ilustrativos, sin meses de venta real.
 const a=[42,68,53,36,46,51,38,47,41,53,56,48];
 const b=[29,39,47,37,35,38,44,36,48,58,49,32];
 const x=i=>38+i*48,y=v=>180-v*1.65;
 const points=arr=>arr.map((v,i)=>x(i)+','+y(v)).join(' ');
 const guide=[50,90,130,170].map(v=>'<line x1="32" y1="'+v+'" x2="583" y2="'+v+'" stroke="#e8e0d6" stroke-width="1"/>').join('');
 const circles=(vals,c)=>vals.map((v,i)=>'<circle cx="'+x(i)+'" cy="'+y(v)+'" r="3.2" fill="#fff" stroke="'+c+'" stroke-width="2"/>').join('');
 const labels=['D','E','F','M','A','M','J','J','A','S','O','N'].map((n,i)=>'<text x="'+x(i)+'" y="220" font-size="10" fill="#897b6e" text-anchor="middle">'+n+'</text>').join('');
 root.innerHTML='<svg class="spark-chart" viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Representación de ejemplo, sin ventas reales">'+guide+'<polyline points="'+points(chartMode==='pedidos'?a.map(v=>v*.68):a)+'" fill="none" stroke="#13813f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+circles(chartMode==='pedidos'?a.map(v=>v*.68):a,'#13813f')+'<polyline points="'+points(b)+'" fill="none" stroke="#f57a18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+circles(b,'#f57a18')+labels+'<text x="42" y="13" font-size="10" fill="#9a7b63">GRÁFICO ILUSTRATIVO · NO SON VENTAS REGISTRADAS</text></svg>';
}
document.querySelectorAll('[data-chart]').forEach(b=>b.addEventListener('click',()=>{chartMode=b.dataset.chart;document.querySelectorAll('[data-chart]').forEach(el=>el.classList.toggle('active',el===b));chart();}));
function refresh(){
 const d=api.getData(),p=d.products,total=p.reduce((a,x)=>a+x.stock,0),low=p.filter(x=>x.stock>0&&x.stock<=3).length,none=p.filter(x=>x.stock===0).length;
 const s=$('#stats');if(s)s.innerHTML=[['Productos de prueba',p.length],['Stock de prueba',total],['Preparados',p.filter(x=>x.status==='Preparado').length],['Pedidos reales',0]].map((x,i)=>card(...x,i)).join('');
 const ps=$('#nzaProdStats');if(ps)ps.innerHTML=[['Productos totales',p.length],['Unidades disponibles',total],['Preparados',p.filter(x=>x.status==='Preparado').length],['Borradores',p.filter(x=>x.status==='Borrador').length]].map((x,i)=>card(...x,i)).join('');
 const os=$('#nzaOrderStats');if(os)os.innerHTML=[['Pedidos nuevos',0],['Por confirmar',0],['Campañas de prueba',d.promo?1:0],['Clientes registrados',0]].map((x,i)=>card(...x,i)).join('');
 const feat=$('#nzaFeatured');if(feat)feat.innerHTML=p.slice(0,3).map(x=>'<div class="mini-product"><div class="product-name"><span class="thumb">'+sym(x)+'</span><span>'+esc(x.name)+'<small>'+esc(x.sku)+'</small></span></div><span>'+money(x.price)+'</span><span class="pill">'+x.stock+'</span></div>').join('')||'<div class="empty">Sin productos registrados</div>';
 const st=$('#nzaStock');if(st){const ok=p.filter(x=>x.stock>3).length,n=p.length||1;st.innerHTML='<div>✔ Disponibles <b>'+ok+'</b></div><div>⚠ Stock bajo <b>'+low+'</b></div><div>✕ Agotados <b>'+none+'</b></div><div class="stockbar"><span style="width:'+(ok/n*100)+'%"></span><b style="width:'+(low/n*100)+'%"></b><i style="width:'+(none/n*100)+'%"></i></div>';}
 const promos=$('#nzaPromoList');if(promos)promos.innerHTML='<div class="promo-tile"><div class="promo-art">🎁 Regalos NZER</div><div><strong>Campaña visual</strong><small>Diseño ilustrativo</small></div></div><div class="promo-tile"><div class="promo-art">🧸 Aprender jugando</div><div><strong>'+esc(d.promo?.title||'Nueva promoción')+'</strong><small>'+(d.promo?'Guardada como prueba':'Pendiente de configurar')+'</small></div></div>';
 const header=$('#nzaOrderPromoTitle');if(header)header.textContent=d.promo?.title||'Regalos para descubrir y aprender';
 if(selected){const item=p.find(x=>x.id===selected);if(item){const panel=$('#nzaQuickEdit');if(panel&&document.activeElement!==panel.querySelector('[name="name"]')){fillEditor(item)}}else{selected=null;fillEditor(p[0])}}
 else if(p.length){fillEditor(p[0])}
 chart();
}
function fillEditor(p){
 const form=$('#nzaQuickEdit'),preview=$('#nzaPreviewImage');if(!form)return;
 if(!p){selected=null;form.reset();form.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=true);preview.textContent='📦';return}
 selected=p.id;form.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=false);
 for(const k of ['name','sku','category','price','stock','status','image','description'])if(form.elements[k])form.elements[k].value=p[k]??'';
 preview.innerHTML=p.image?'<img src="'+esc(p.image)+'" alt="Vista previa del producto" referrerpolicy="no-referrer">':sym(p);
 $('#nzaEditorHint').textContent='Producto de prueba · '+p.sku+' · sin publicación real.';
}
window.NZER_ADMIN_MOCK_EDITOR=fillEditor;
const f=$('#nzaQuickEdit');
f?.addEventListener('submit',e=>{
 e.preventDefault();const d=api.getData(),p=d.products.find(x=>x.id===selected);if(!p)return;const elems=f.elements;
 const stock=Number(elems.stock.value),price=Number(elems.price.value);
 if(!Number.isInteger(stock)||stock<0||!Number.isFinite(price)||price<0){alert('Revisa el precio y el stock.');return}
 p.name=elems.name.value.trim();p.category=elems.category.value;p.price=price;p.stock=stock;p.status=elems.status.value;p.image=elems.image.value.trim();p.description=elems.description.value.trim();if(!p.name){alert('Debes indicar el nombre.');return}
 api.save();$('#nzaEditorHint').textContent='Cambios guardados solo en este navegador.';
});
$('#nzaDuplicate')?.addEventListener('click',()=>{
 const d=api.getData(),p=d.products.find(x=>x.id===selected);if(!p)return;
 const base=p.sku+'-COPIA',sku=base+'-'+String(Date.now()).slice(-5);
 const cp={...p,id:'mock-'+Date.now(),sku,name:p.name+' (copia)',status:'Borrador'};
 d.products.push(cp);selected=cp.id;api.save();fillEditor(cp);
});
$('#nzaQuickNew')?.addEventListener('click',()=>api.openProduct());
$('#nzaStatusFilter')?.addEventListener('change',function(){
 const rows=$('#productRows')?.querySelectorAll('tr')||[];
 rows.forEach(row=>{const text=row.textContent||'';row.hidden=!!this.value&&!text.includes(this.value);});
});
// Prevent stale selection after changes and update the derived panels.
window.addEventListener('nzer-admin-updated',refresh);
$('#productSearch')?.addEventListener('input',()=>{if($('#nzaStatusFilter'))$('#nzaStatusFilter').value=''});
$('#categoryFilter')?.addEventListener('change',()=>{if($('#nzaStatusFilter'))$('#nzaStatusFilter').value=''});
refresh();
})();
