/* Contacto de prueba NZER. Una sola configuracion para todas las paginas. */
(function(){
 'use strict';
 const PHONE='51930829605'; // Numero temporal para pruebas. Cambiar aqui al oficial.
 const WA_PATH='https://wa.me/';
 const contexts={
  home:{name:'Inicio NZER',message:'Hola, estoy visitando la pagina principal de NZER y quisiera recibir informacion sobre sus servicios y productos.'},
  care:{name:'NZER CARE',message:'Hola, estoy interesado en NZER CARE. Quisiera conocer los horarios, las actividades y la disponibilidad de cupos.'},
  psico:{name:'PSICO NZER',message:'Hola, estoy consultando la seccion PSICO NZER. Quisiera informacion sobre la atencion y como solicitar una cita.'},
  desarrollo:{name:'Desarrollo Infantil',message:'Hola, estoy interesado en el programa de Desarrollo Infantil de NZER. Quisiera conocer las actividades, edades y horarios.'},
  store:{name:'NZER STORE',message:'Hola, estoy visitando NZER STORE y quisiera consultar sobre los juguetes y productos didacticos.'},
  producto:{name:'Producto NZER STORE',message:'Hola, estoy viendo un producto en NZER STORE y quisiera recibir informacion.'},
  carrito:{name:'Carrito NZER STORE',message:'Hola, estoy revisando mi carrito de demostracion en NZER STORE y quisiera consultar sobre los productos.'},
  aprende:{name:'Aprende',message:'Hola, estoy visitando la seccion Aprende de NZER y quisiera recibir informacion sobre los recursos para familias.'},
  nosotros:{name:'Nosotros',message:'Hola, quisiera conocer mas sobre NZER y sus servicios.'},
  contacto:{name:'Contacto NZER',message:'Hola, quisiera comunicarme con NZER para realizar una consulta.'}
 };
 const path=decodeURI(window.location.pathname).toLowerCase();
 let key='home';
 if(/\/store\/producto\/(?:index\.html)?$/.test(path))key='producto';
 else if(/\/store\/carrito\/(?:index\.html)?$/.test(path))key='carrito';
 else if(/\/store\/(?:index\.html)?$/.test(path))key='store';
 else if(/\/care\/(?:index\.html)?$/.test(path))key='care';
 else if(/\/psico\/(?:index\.html)?$/.test(path))key='psico';
 else if(/\/desarrollo-infantil\/(?:index\.html)?$/.test(path))key='desarrollo';
 else if(/\/aprende\/(?:index\.html)?$/.test(path))key='aprende';
 else if(/\/nosotros\/(?:index\.html)?$/.test(path))key='nosotros';
 else if(/\/contacto\/(?:index\.html)?$/.test(path))key='contacto';
 const context=contexts[key];
 let message=context.message;
 if(key==='producto'){
  const productId=new URLSearchParams(window.location.search).get('id');
  const catalog=typeof NZER_PRODUCTS!=='undefined'?NZER_PRODUCTS:[];
  const product=catalog.find(p=>p.id===productId);
  if(product){
    message='Hola, estoy viendo el producto "'+product.name+'" (precio referencial S/ '+Number(product.price).toFixed(2)+') en NZER STORE y quisiera consultar su disponibilidad y caracteristicas.';
  }
 }
 const link=WA_PATH+PHONE+'?text='+encodeURIComponent(message);
 let anchor=document.querySelector('.nzer-contact-float');
 if(!anchor){
  anchor=document.createElement('a');
  anchor.className='nzer-contact-float';
  anchor.innerHTML='<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.669.15-.198.297-.768.966-.941 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.29.174-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.515-5.276c.002-5.448 4.436-9.881 9.887-9.881a9.82 9.82 0 0 1 6.988 2.895 9.83 9.83 0 0 1 2.893 6.993c-.002 5.448-4.436 9.881-9.88 9.881m8.413-18.295A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.893c-.001 2.096.547 4.142 1.589 5.945L.057 24l6.304-1.654a11.9 11.9 0 0 0 5.684 1.448h.005c6.557 0 11.892-5.336 11.895-11.893a11.82 11.82 0 0 0-3.481-8.411"/></svg><span class="nzer-contact-tooltip">Consultar por WhatsApp</span>';
  document.body.appendChild(anchor);
 }
 anchor.href=link;
 anchor.target='_blank';
 anchor.rel='noopener noreferrer';
 anchor.setAttribute('aria-label','Consultar por WhatsApp sobre '+context.name+' (numero de pruebas)');
 anchor.title='WhatsApp · '+context.name;
})();
