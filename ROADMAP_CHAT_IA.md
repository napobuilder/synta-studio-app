# Roadmap y Arquitectura: Chat de Pruebas de IA

Este documento describe el plan para diseñar e implementar una funcionalidad de chat interactivo que permita a los usuarios probar prompts directamente dentro de Synta Studio.

## 1. Visión del Producto

El objetivo es transformar "Synta Lab" de una biblioteca de prompts estática a un "patio de juegos" interactivo. Los usuarios deben poder probar el comportamiento de un prompt con una IA (potenciada por la API de Gemini) sin salir de la aplicación, aumentando drásticamente el valor y la utilidad de la plataforma.

## 2. Experiencia de Usuario (UX)

La interfaz debe ser intuitiva, no intrusiva y potente. La solución propuesta es un **Panel de Chat Persistente y Ocultable**.

- **Disparador:** Un botón de acción flotante (FAB) se situará en una esquina de la pantalla (ej. inferior derecha), accesible desde cualquier vista de la aplicación.
- **Panel:** Al hacer clic en el FAB, un panel de chat se deslizará suavemente desde la derecha, ocupando una porción de la pantalla (ej. 30-40% del ancho) sin ocultar por completo el contenido principal. El usuario puede ocultarlo con un clic en un botón de "cerrar".
- **Flujo de Trabajo:**
  1. El usuario explora los prompts en `SyntaLabView`.
  2. Cada tarjeta de prompt tendrá un nuevo botón: **"Probar en el Lab"**.
  3. Al hacer clic, el panel de chat se abre (si estaba cerrado), la conversación anterior se borra, y el prompt seleccionado se usa como el **mensaje de sistema** para inicializar a la IA.
  4. El usuario interactúa con el agente ya "entrenado" para evaluar la calidad del prompt.

## 3. Arquitectura Técnica

La implementación será limpia, centralizada y segura, siguiendo las mejores prácticas.

- **Gestión de Estado (Zustand):** Se creará una nueva "slice" (sección) en el store `useStore.ts` para gestionar todo lo relacionado con el chat:
  - `isChatPanelOpen: boolean`: Controla la visibilidad del panel.
  - `chatMessages: Message[]`: Un array con el historial de la conversación actual (ej. `{ role: 'user' | 'assistant', content: string }`).
  - `toggleChatPanel()`: Acción para abrir/cerrar el panel.
  - `addChatMessage(message: Message)`: Acción para añadir un nuevo mensaje al historial.
  - `startNewChatWithPrompt(prompt: string)`: Acción que limpia el historial y añade el prompt del sistema como primer mensaje.

- **Componente de UI (`ChatPanel.tsx`):** Un único componente React que contendrá toda la lógica de la interfaz del chat (mostrar mensajes, campo de entrada, botón de envío). Se integrará una sola vez en el layout principal `App.tsx` para que sea persistente.

- **API Segura (Supabase Edge Function):** La comunicación con la API de Gemini se realizará a través de un intermediario seguro.
  - **NUNCA** se expondrá la clave de la API de Gemini en el código del frontend.
  - Se creará una Edge Function en Supabase (ej. `/functions/ask-gemini`).
  - El frontend enviará el historial de la conversación a esta función.
  - La Edge Function recibirá la petición, añadirá la clave de la API de forma segura, llamará a la API de Gemini y devolverá la respuesta al frontend.

---

## 4. Hoja de Ruta (Ladrillo por Ladrillo)

Se propone un desarrollo por fases para gestionar la complejidad.

### Fase 1: Construir la Interfaz (El Primer Ladrillo) - [COMPLETADO]
**Objetivo:** Crear el componente visual del chat, sin lógica de backend.
- **Acción 1.1:** Crear el archivo `src/components/ChatPanel.tsx`.
- **Acción 1.2:** Diseñar la estructura con Tailwind CSS: un contenedor principal, una cabecera (con título y botón de cerrar), un área de mensajes (que iterará sobre un array de mensajes de prueba) y un pie de página (con el `input` de texto y el botón de enviar).
- **Acción 1.3:** El componente será inicialmente estático y no funcional.

### Fase 2: Integración y Estado - [COMPLETADO]
**Objetivo:** Conectar el `ChatPanel` a la aplicación y gestionar su estado.
- **Acción 2.1:** Añadir los nuevos estados y acciones del chat a `useStore.ts`.
- **Acción 2.2:** Añadir el componente `<ChatPanel />` al layout de `App.tsx`.
- **Acción 2.3:** Usar el estado `isChatPanelOpen` para controlar la visibilidad del panel (ej. con clases de `transform` de Tailwind).
- **Acción 2.4:** Crear el botón flotante que llame a `toggleChatPanel`.
- **Acción 2.5:** Implementar el botón "Probar en el Lab" en `PromptCard.tsx` para que llame a `startNewChatWithPrompt`.

### Fase 3: Conexión a la IA
**Objetivo:** Darle vida al chat conectándolo a la API de Gemini.
- **Acción 3.1:** Crear, desarrollar y desplegar la Supabase Edge Function `ask-gemini`.
- **Acción 3.2:** Modificar `ChatPanel.tsx` para que, al enviar un mensaje, llame a esta Edge Function con el historial de la conversación.
- **Acción 3.3:** Al recibir la respuesta de la función, usar `addChatMessage` para añadir la respuesta del asistente a la interfaz.
