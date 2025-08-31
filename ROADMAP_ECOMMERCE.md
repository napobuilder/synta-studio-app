# Roadmap y Arquitectura del Módulo E-Commerce (El Arsenal)

Este documento describe el plan y la arquitectura para implementar la funcionalidad de compra y venta de productos digitales en la sección "El Arsenal".

## 1. El Plano Arquitectónico

Un sistema de compras robusto se compone de tres partes interconectadas:

### a. El Frontend (Lo que el usuario ve)
- **Páginas de Detalle de Producto:** Vistas individuales y dedicadas para cada producto o curso, con descripciones completas, imágenes/videos y un llamado a la acción claro (ej. "Añadir al Carrito").
- **El Carrito de Compras:** Un estado global, gestionado con Zustand, que persiste la selección de productos del usuario a través de la aplicación.
- **El Flujo de Checkout:** La secuencia de pasos donde el usuario revisa su carrito y procede al pago. Aquí es donde se integran los botones y APIs de las pasarelas de pago.

### b. El Backend (La Lógica de Negocio Segura)
- **Base de Datos (Supabase):** Es fundamental mover la lógica de negocio a una base de datos segura. Necesitaremos las siguientes tablas:
  - `products`: Almacena la información canónica de cada producto (ID, nombre, descripción, precio, imagen, etc.). El precio que se usa para cobrar se lee de aquí, **nunca** del frontend.
  - `orders`: Guarda un registro inmutable de cada transacción (ID de orden, `user_id` del comprador, monto total, estado del pago, `transaction_id` de la pasarela).
  - `order_items`: Una tabla que relaciona las órdenes con los productos (`order_id`, `product_id`, cantidad, precio al momento de la compra).
- **Seguridad y Fulfilment:** La entrega del producto digital (ej. añadir un registro a una tabla `user_courses`) **solo** debe ocurrir después de una confirmación de pago exitosa recibida por el backend.

### c. Las Pasarelas de Pago (PayPal, Binance Pay)
- **Integración Client-Side:** Sus SDKs/botones se usan en el frontend para iniciar el proceso de pago.
- **Webhooks (Server-Side):** Son el mecanismo de confirmación. Cuando un pago se completa, la pasarela envía una notificación (un webhook) a un endpoint seguro en nuestro backend (una Supabase Edge Function). Este webhook es la única fuente de verdad para confirmar un pago. Al recibirlo, el backend crea la orden en la base de datos y entrega el producto.

---

## 2. La Hoja de Ruta (Paso a Paso)

### Paso 1: Páginas de Detalle de Producto (El Primer Ladrillo)
**Objetivo:** Permitir que cada producto tenga su propia URL y página dedicada.
- **Acción 1.1:** Modificar `main.tsx` para añadir una ruta dinámica: `/app/arsenal/:productId`.
- **Acción 1.2:** Crear un nuevo componente de vista: `src/views/ProductDetailView.tsx`.
- **Acción 1.3:** En `ProductDetailView`, leer el `:productId` de los parámetros de la URL, usarlo para buscar la información del producto (inicialmente de los datos mock, luego de la DB) y mostrarla.
- **Acción 1.4:** Modificar el componente `ArsenalCard.tsx` para que cada tarjeta de producto enlace a su nueva ruta de detalle.

### Paso 2: El Carrito de Compras (Estado Global)
**Objetivo:** Permitir que los usuarios añadan y gestionen productos en un carrito.
- **Acción 2.1:** Extender el store de Zustand (`useStore.ts`) para incluir el estado del carrito: `cart: []`.
- **Acción 2.2:** Añadir las acciones correspondientes al store: `addToCart`, `removeFromCart`, `updateItemQuantity`, `clearCart`.

### Paso 3: La Interfaz del Carrito
**Objetivo:** Crear los componentes de UI para interactuar con el carrito.
- **Acción 3.1:** Implementar el botón "Añadir al Carrito" en `ProductDetailView.tsx` y `ArsenalCard.tsx`.
- **Acción 3.2:** Crear un componente `CartView.tsx` (puede ser una página completa o un panel lateral) que muestre los items del carrito, permita ajustar cantidades y muestre el subtotal.

### Paso 4: Migración al Backend (Supabase)
**Objetivo:** Mover la gestión de productos a la base de datos.
- **Acción 4.1:** Usar el dashboard de Supabase para crear las tablas `products`, `orders`, y `order_items`.
- **Acción 4.2:** Poblar la tabla `products` con tus productos actuales.
- **Acción 4.3:** Modificar la aplicación para que lea la lista de productos y los detalles desde Supabase en lugar de los archivos mock.

### Paso 5: Integración de Pagos y Webhooks (El Paso Final)
**Objetivo:** Implementar el flujo de pago y la confirmación segura de órdenes.
- **Acción 5.1:** Crear una Supabase Edge Function que sirva como endpoint para los webhooks de PayPal y Binance.
- **Acción 5.2:** En el frontend, integrar los SDKs de PayPal/Binance en el flujo de checkout. Al confirmar el pago, se debe pasar el ID de la orden a la pasarela.
- **Acción 5.3:** En la Edge Function (webhook), al recibir una notificación de pago exitoso, verificar su autenticidad, buscar la orden correspondiente y actualizar su estado a "completada".
- **Acción 5.4:** En la misma función, ejecutar la lógica de "fulfilment" para entregar el producto al usuario.
