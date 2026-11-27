# NZER STORE · TALLER — Integración central de pedidos

**Entorno exclusivo de pruebas**. No usar datos personales reales, cobros reales ni inventario operativo de NZER V1.

## Estado al 27 de noviembre de 2026

- **Creada** una base independiente de Google Sheets: `NZER STORE · TALLER — Base central de pedidos (PRUEBAS)`, con pestañas `PEDIDOS`, `DETALLE_PEDIDOS`, `INVENTARIO`, `EVENTOS` y `CONFIG`.
- **Cargados** 20 productos ficticios, 5 unidades iniciales por producto.
- **Código preparado en GitHub**: `integraciones/nzer-store-taller/Code.gs`.
- **NO desplegado** como servicio de Apps Script; no hay `doGet` ni `doPost`.
- El carrito y la bandeja de pedidos continúan usando `localStorage`: una misma máquina y origen web pueden compartir los datos de simulación, pero la base de Google Sheets todavía **no recibe** los pedidos.
- **Ningún cambio** al Apps Script NZER V1 oficial, su base real, la caja o BZLE.

## Módulos del servidor (no públicos)

- `tallerCreateOrder_(request)`: valida artículos y stock, calcula el precio desde la base central, crea un pedido pendiente, reserva unidades y emite evento.
- `tallerListOrders_()`: lectura para operador autorizado.
- `tallerChangeOrder_(id, action, paymentMethod)`: confirma un pago **ficticio**, cancela una reserva o marca entrega; modifica inventario simulado.
- `tallerAuditStock_()`: compara reservas con pedidos pendientes.

## Activación futura, sin tocar producción

1. Crear un proyecto Apps Script **de pruebas**, vinculado solamente a la base de pruebas indicada. No reutilizar la implementación de NZER V1.
2. Copiar el código del repositorio, configurar en Script Properties la clave `NZER_TALLER_SPREADSHEET_ID` con el ID exacto de la hoja de pruebas.
3. Ejecutar `tallerAuditStock_()`: debe devolver un arreglo vacío sobre el inventario de prueba inicial.
4. Probar `tallerCreateOrder_` con identificador idempotente único, dos SKU válidos y cantidades dentro del stock.
5. Probar reenvío de la misma clave, pago simulado, cancelación de otro pedido y entrega. Comprobar `PEDIDOS`, `DETALLE_PEDIDOS`, `INVENTARIO` y `EVENTOS`.
6. Diseñar e implementar un **intermediario de autenticación y autorización**: las lecturas administrativas y los cambios de pago no pueden ser invocados por visitantes. Los precios, cantidades, promociones y stock se recalculan siempre en el servidor.
7. Implementar limitación de frecuencia, antifraude, protección contra pedidos duplicados y conciliación/reparación de escrituras parciales. Google Sheets no es transaccional (sin garantías ACID).
8. Solo entonces exponer la ruta pública controlada de *crear pedido* y conectar el carrito de pruebas a esa ruta, con retroalimentación explícita de éxito/error.
9. Publicar una página Taller de pruebas y verificar desde dos dispositivos distintos. Nunca afirmar que funciona entre dispositivos sin completar esta verificación.
10. Mantener la página oficial y NZER V1 intactos hasta completar y aprobar las pruebas.

## Reglas comerciales obligatorias

- Generar pedido = reservar stock, **no registrar ingreso**.
- Pago confirmado por operador autorizado = registrar venta simulada y descontar stock físico de prueba.
- Cancelación de pedido pendiente = liberar reserva, sin ingreso.
- Entregado = no vuelve a descontar inventario ni ingresos.
- Idempotencia: el mismo intento no debe duplicar pedidos.
- No aceptar `total`, `precioUnitario` o descuentos provenientes del navegador como valores de autoridad.
- Antes de habilitar campañas digitales, centralizar precios promocionales activos y vigencias en el servidor. El código actual utiliza precio base y **no sincroniza campañas locales**.
- La compra de prueba no emite boleta ni factura tributaria.

## Limitaciones conocidas

El flujo de preparación escribe varias hojas de manera secuencial; un error a mitad de ejecución podría dejar una reserva inconsistente. Antes de exponer la conexión al público, añadir conciliación y reparaciones verificables, o migrar el procesamiento transaccional a un backend que admita operaciones atómicas. No usar este código todavía con pagos reales ni inventario físico real.

## Portal de administración listo para despliegue restringido (27/11/2026)

Se añadieron `Web.gs` y `Admin.html`. Son un **panel de operaciones ficticias** conectado a las funciones de `Code.gs` y solo accesible tras autenticación del operador. No se ha desplegado.

### Activación por el propietario de Google Apps Script

1. Abre [script.google.com](https://script.google.com/home/projects/create) con **la cuenta propietaria o con acceso de edición** a la hoja de pruebas.
2. Crea **un proyecto nuevo de pruebas** titulado `NZER STORE TALLER — API DE PRUEBAS`. Nunca modifiques NZER V1.
3. Copia el contenido completo de `Code.gs` y `Web.gs` desde esta carpeta en sendos archivos de tipo Script. Crea un archivo HTML de nombre exacto `Admin` y pega el contenido de `Admin.html`.
4. En **Configuración del proyecto → Propiedades de la secuencia de comandos**, añade:
   - `NZER_TALLER_SPREADSHEET_ID` = `13McrDS1mtJf73H0TeLY0oiuo6gOEmRSVaX34QFpwrbc`
   - `NZER_TALLER_ADMIN_EMAIL` = tu cuenta de Google autorizada que ejecutará la aplicación (no publicar aquí el email).
5. Guarda y ejecuta `adminTallerAudit` desde el editor para autorizar los permisos. Verifica que devuelva `[]` antes de continuar.
6. **Implementar → Nueva implementación → Aplicación web**, ejecutar como **Usuario que accede a la aplicación** y acceso **Solo yo**. Si esa opción de acceso no estuviera disponible o no se mantiene la autenticación, **NO publicar**.
7. Abre la URL `/exec` de la implementación iniciando sesión con la cuenta autorizada. Deberás ver la bandeja vacía y el inventario ficticio.
8. Desde el panel registra una venta de prueba. Comprueba que aparece en Google Sheets y que la auditoría sigue sin inconsistencias. Prueba el mismo enlace desde un segundo dispositivo con la misma cuenta autorizada.

### Qué NO activa aún este procedimiento

El carrito web público continúa almacenando sus pedidos en `localStorage`. Para admitir pedidos web desde usuarios anónimos se necesita un **servicio público separado que únicamente acepte la creación de pedidos**, con controles contra abuso, protección de datos y precios/campañas definidos por el servidor. No cambiar el portal de administración a "Cualquiera": expondría acciones de cambio de estados y pagos ficticios.

La aplicación de pruebas no está operativa hasta que el propietario termine el despliegue y se confirme el funcionamiento desde la URL.
