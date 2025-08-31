# Roadmap y Visión: El Dashboard Dinámico

Este documento describe la visión y la arquitectura para la refactorización del Dashboard (vista de Inicio) de Synta Studio, transformándolo en un centro de operaciones dinámico y accionable para el usuario.

## 1. Filosofía y Objetivos

El dashboard actual es una página de bienvenida estática. El objetivo es convertirlo en la página más útil y con mayor retención de la aplicación. Debe cumplir con cuatro principios clave:

- **Personalizado:** Saludar al usuario por su nombre y reflejar su estado actual.
- **Accionable:** Proveer puntos de partida claros hacia las secciones más importantes de la aplicación.
- **Informativo:** Mostrar contenido dinámico y relevante que haga que la aplicación se sienta "viva".
- **Orientado al Valor:** Recordar constantemente al usuario el valor que obtiene de la plataforma, incluyendo oportunidades de crecimiento (compras).

## 2. Arquitectura del Nuevo Dashboard

Se propone un layout moderno basado en componentes de tarjeta y una rejilla (grid) responsiva.

### Componente 1: Cabecera de Bienvenida
- **Propósito:** Personalización inmediata.
- **Contenido:**
  - Título `<h1>`: "Hola, [Nombre del Usuario]"
  - Subtítulo `<p>`: "Bienvenido de nuevo a tu centro de operaciones."

### Componente 2: Acciones Rápidas
- **Propósito:** Guiar al usuario y proveer un punto de partida claro.
- **Estructura:** Una fila con tres tarjetas de igual tamaño.
- **Contenido:**
  - **Tarjeta 1: Synta Lab.**
    - Icono: `FlaskConical`.
    - Título: "Laboratorio de Prompts".
    - CTA: Botón "Explorar Prompts".
  - **Tarjeta 2: Comunidad.**
    - Icono: `Users`.
    - Título: "Únete a la Conversación".
    - CTA: Botón "Ver Comunidad".
  - **Tarjeta 3: El Arsenal.**
    - Icono: `ShoppingCart` o `Rocket`.
    - Título: "Mejora tus Herramientas".
    - CTA: Botón "Visitar el Arsenal".

### Componente 3: Sección Dinámica (Dos Columnas)
- **Propósito:** Enganchar al usuario con contenido fresco y presentar oportunidades de compra.
- **Estructura:** Una rejilla de dos columnas.

- **Columna Izquierda (66% del ancho): "Actividad Reciente en la Comunidad"**
  - **Lógica:** Mostrará los 2-3 posts más recientes del foro.
  - **Contenido por item:** Título del post, nombre/avatar del autor, y un timestamp relativo (ej. "hace 5 minutos"). Cada item será un enlace directo al post.
  - **Objetivo:** Fomentar la participación mostrando que la comunidad está activa.

- **Columna Derecha (33% del ancho): "Herramienta Destacada"**
  - **Lógica:** Mostrará un producto/agente seleccionado del Arsenal (ej. el más nuevo o uno aleatorio).
  - **Contenido:** Una tarjeta visualmente destacada con la imagen del producto, título, descripción corta y un botón CTA "Ver en el Arsenal".
  - **Objetivo:** Impulsar las ventas de forma elegante y contextual.

## 3. Plan de Implementación

1.  **Reestructurar `InicioView.tsx`:** Modificar el archivo para implementar el nuevo layout de rejilla (grid).
2.  **Crear Sub-componentes:** Desarrollar los componentes necesarios para el dashboard si se requiere (ej. `FeaturedProductCard.tsx`, `RecentPostItem.tsx`).
3.  **Conectar al Estado (Zustand):** Obtener los datos necesarios del store (perfil del usuario, posts de la comunidad, productos del arsenal) para alimentar los componentes dinámicos.
