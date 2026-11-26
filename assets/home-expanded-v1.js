/* NZER Inicio: valoración local para copiar, sin envío ni almacenamiento de datos */
(()=>{
'use strict';
function setup(){
 const stars=[...document.querySelectorAll('[data-ne-star]')],message=document.getElementById('neReviewMessage'),button=document.getElementById('neCopyReview'),feedback=document.getElementById('neReviewFeedback');
 if(!stars.length||!button||!message)return;
 let rating=0;
 function paint(){
  stars.forEach((star,i)=>{star.textContent=i<rating?'★':'☆';star.setAttribute('aria-pressed',String(i+1===rating));});
 }
 stars.forEach((star,i)=>star.addEventListener('click',()=>{rating=i+1;paint();}));
 button.addEventListener('click',async()=>{
  if(!rating){feedback.textContent='Selecciona primero una calificación de 1 a 5 estrellas.';return;}
  const text=message.value.trim();
  if(text.length<10){feedback.textContent='Escribe un mensaje de al menos 10 caracteres.';return;}
  const output='Valoración de NZER Kids: '+rating+' de 5 estrellas\n\n'+text;
  try{await navigator.clipboard.writeText(output);feedback.textContent='Valoración copiada. Puedes enviarla a NZER por un canal oficial. No se publicó ni guardó en esta página.';}
  catch(e){feedback.textContent='Tu navegador no permitió copiar automáticamente. Selecciona el mensaje y cópialo manualmente; no se envió a NZER.';}
 });
 paint();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();