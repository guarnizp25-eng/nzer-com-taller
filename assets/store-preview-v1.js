/* Solo se activa en NZER STORE con ?nzer_draft_preview=1.
   Carga la página REAL con la capa local de cambios pendientes de NZER ADMIN.
   No se permite realizar compras ni enviar pedidos. */
(()=>{
 'use strict';
 const params=new URLSearchParams(location.search);
 const workshop=params.get('nzer_taller')==='1',inspect=params.get('nzer_draft_preview')==='1';
 if(!workshop&&!inspect)return;
 const init=()=>{
  document.body.classList.add('nzer-draft-mode');
  const style=document.createElement('style');style.textContent=`
  body.nzer-draft-mode:before{content:"NZER STORE · TALLER DE PRUEBAS · SIN COMPRAS REALES";position:sticky;display:block;top:0;z-index:9999;background:#1b533a;color:white;font:900 12px Nunito,Arial,sans-serif;text-align:center;padding:10px}
  body.nzer-draft-mode [data-nzpromo-slide]:not(:first-child){display:none!important}
  body.nzer-draft-mode #nzpromoBanner [data-nzpromo-slide]:first-child{display:flex!important;opacity:1!important;transform:none!important;visibility:visible!important;pointer-events:auto!important}
  `;document.head.append(style);
  try{
   const draft=JSON.parse(localStorage.getItem('nzer_admin_catalog_v2')||'null');
   const campaigns=Array.isArray(draft?.campaigns)?draft.campaigns.filter(c=>Array.isArray(c.items)):[];
   const selected=localStorage.getItem(workshop?'nzer_admin_workshop_campaign_id':'nzer_admin_preview_campaign_id');
   const campaign=campaigns.find(c=>c.id===selected)||null;
   if(campaign){
    const slide=document.querySelector('#nzpromoBanner [data-nzpromo-slide]:first-child');
    if(slide){
     const title=slide.querySelector('h1,h2'),description=slide.querySelector('p'),discount=slide.querySelector('.nzpromo-disc strong');
     if(title)title.textContent=String(campaign.title||'Campaña en preparación').slice(0,80);
     if(description)description.textContent='Campaña de taller · '+String(campaign.from||'')+' al '+String(campaign.to||'')+' · Sin ventas reales';
     if(discount){const line=campaign.items.find(x=>{const p=draft.products?.find(p=>p.id===x.productId);return p&&p.price>x.offerPrice});const p=line&&draft.products?.find(p=>p.id===line.productId);discount.textContent=p?Math.round((p.price-line.offerPrice)/p.price*100)+'%':'OFERTA';}
    }
   }else if(!workshop&&draft&&draft.promo){
    const slide=document.querySelector('#nzpromoBanner [data-nzpromo-slide]:first-child');
    if(slide){
     const title=slide.querySelector('h1,h2'),description=slide.querySelector('p'),discount=slide.querySelector('.nzpromo-disc strong');
     if(title)title.textContent=String(draft.promo.title||'Campaña en preparación').slice(0,80);
     if(description)description.textContent='Promoción en revisión. Borrador no publicado en la tienda real.';
     if(discount)discount.textContent=(Number(draft.promo.discount)||0)+'%';
    }
   }
  }catch(e){console.warn('No se pudo leer la campaña de prueba',e)}
  document.addEventListener('click',e=>{
   const link=e.target.closest('a[href]');
   if(link){
    const dest=new URL(link.href,location.href);
    if(dest.origin===location.origin&&dest.pathname.includes('/nzer-com-taller/store/')&&!dest.pathname.includes('/carrito/')){
     dest.searchParams.set(workshop?'nzer_taller':'nzer_draft_preview','1');
     link.href=dest.href;
    }
   }
  },true);
  document.addEventListener('click',e=>{
   const button=e.target.closest('[data-add],[data-detail-add],[data-qty],[data-remove-item],#checkoutDemo,#nzcCheckoutContinue');
   if(button){e.preventDefault();e.stopImmediatePropagation();return;}
  },true);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
