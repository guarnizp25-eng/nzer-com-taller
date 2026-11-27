/* NZER STORE · Catálogo único de DEMOSTRACIÓN. Datos ficticios, no inventario ni precios confirmados. */
(()=>{'use strict';
const base=[
  {
    "id": "magnet",
    "name": "Bloques magnéticos 42 piezas",
    "category": "construccion",
    "categoryLabel": "Construcción",
    "price": 89,
    "desc": "Juego de estructuras magnéticas con formas y colores.",
    "bg": "#eef6ff",
    "tag": "MAGNÉTICOS",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "builder",
    "name": "Set constructor creativo",
    "category": "construccion",
    "categoryLabel": "Construcción",
    "price": 59,
    "desc": "Piezas de armado para imaginar vehículos y figuras.",
    "bg": "#fff3dc",
    "tag": "CREATIVIDAD",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "truck",
    "name": "Camión volquete infantil",
    "category": "carros",
    "categoryLabel": "Carros",
    "price": 49,
    "desc": "Camión de juguete para explorar movimiento y coordinación.",
    "bg": "#fff0d8",
    "tag": "EN MOVIMIENTO",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "excavator",
    "name": "Retroexcavadora de juguete",
    "category": "carros",
    "categoryLabel": "Carros",
    "price": 55,
    "desc": "Máquina de construcción para aventuras imaginarias.",
    "bg": "#eef9dc",
    "tag": "OBRAS Y JUEGO",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "toolbox",
    "name": "Caja de herramientas junior",
    "category": "construccion",
    "categoryLabel": "Construcción",
    "price": 39,
    "desc": "Kit ilustrativo de herramientas infantiles de juego.",
    "bg": "#fff0e2",
    "tag": "CONSTRUYE",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "ridecar",
    "name": "Carro de empuje clásico",
    "category": "carros",
    "categoryLabel": "Carros",
    "price": 35,
    "desc": "Vehículo de juguete de estilo clásico.",
    "bg": "#fff0e6",
    "tag": "CLÁSICO",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "track",
    "name": "Pista de autos de madera",
    "category": "carros",
    "categoryLabel": "Carros",
    "price": 79,
    "desc": "Circuito de madera para deslizar autos pequeños.",
    "bg": "#e5f8ee",
    "tag": "CARRERAS",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "garage",
    "name": "Garaje didáctico de autos",
    "category": "carros",
    "categoryLabel": "Carros",
    "price": 84,
    "desc": "Garaje de varios niveles para juego de vehículos.",
    "bg": "#eaf4ff",
    "tag": "AVENTURAS",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "train",
    "name": "Tren de madera clásico",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 56,
    "desc": "Tren ilustrativo con vagones de colores.",
    "bg": "#fff3dc",
    "tag": "JUEGO SIMBÓLICO",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "cubes",
    "name": "Cubos apilables de madera",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 42,
    "desc": "Cubos de colores para apilar y organizar.",
    "bg": "#f0f8dd",
    "tag": "APILAR",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "animals",
    "name": "Rompecabezas de animales",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 29,
    "desc": "Tablero para asociar animales y sus formas.",
    "bg": "#eff9e5",
    "tag": "DESCUBRIR",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "abacus",
    "name": "Ábaco didáctico",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 37,
    "desc": "Cuentas de colores para explorar cantidades.",
    "bg": "#fff4da",
    "tag": "CONTAR",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "balance",
    "name": "Torre de equilibrio",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 33,
    "desc": "Piezas coloridas para practicar el equilibrio.",
    "bg": "#ebfaff",
    "tag": "EQUILIBRIO",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "hammer",
    "name": "Banco de martillo de madera",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 48,
    "desc": "Banco de encaje y coordinación manual.",
    "bg": "#f7f0e1",
    "tag": "COORDINACIÓN",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "woodblocks",
    "name": "Bloques de madera 100 piezas",
    "category": "construccion",
    "categoryLabel": "Construcción",
    "price": 69,
    "desc": "Juego ilustrativo de bloques para construir.",
    "bg": "#f0f9e8",
    "tag": "CONSTRUCCIÓN",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "crane",
    "name": "Carro constructor 6 en 1",
    "category": "construccion",
    "categoryLabel": "Construcción",
    "price": 64,
    "desc": "Vehículo de construcción de juguete.",
    "bg": "#fff0de",
    "tag": "VEHÍCULOS",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "activity",
    "name": "Mesa de actividades de madera",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 129,
    "desc": "Mesa con actividades ilustrativas de motricidad.",
    "bg": "#ebf9ee",
    "tag": "MOTRICIDAD",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "fruits",
    "name": "Frutas de madera para cortar",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 34,
    "desc": "Frutas ilustrativas para juego simbólico.",
    "bg": "#fff2dd",
    "tag": "JUEGO SIMBÓLICO",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "shapes",
    "name": "Clasificador geométrico",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 31,
    "desc": "Formas geométricas coloridas y tablero de encaje.",
    "bg": "#e9f6fe",
    "tag": "FORMAS",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  },
  {
    "id": "rainbow",
    "name": "Arcoíris apilable de madera",
    "category": "madera",
    "categoryLabel": "Madera didáctica",
    "price": 27,
    "desc": "Arcos de colores para construir y combinar.",
    "bg": "#f9f1e6",
    "tag": "COLORES",
    "ages": "Verificar edad recomendada y advertencias del fabricante"
  }
];
const scriptURL=document.currentScript?.src||document.baseURI;
window.NZER_CATALOG_PRODUCTS=base.map(p=>({...p,
 image:new URL('productos-originales/'+encodeURIComponent(p.id)+'.webp',scriptURL).href,
 sku:({'magnet':'NZ-BM-042','abacus':'NZ-AB-001'})[p.id]||'NZ-DEMO-'+p.id.toUpperCase()
}));
})();
