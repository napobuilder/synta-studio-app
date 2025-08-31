# Guía de Implementación: Edge Function para Gemini

Este documento detalla los pasos para crear, desarrollar y desplegar una Supabase Edge Function que actúa como un proxy seguro para la API de Google Gemini. Esto corresponde a la **Acción 3.1** del `ROADMAP_CHAT_IA.md`.

## 1. Objetivo

Crear un endpoint de backend (`/functions/ask-gemini`) que reciba una conversación desde el frontend, la envíe de forma segura a la API de Gemini (adjuntando la clave de API secreta) y devuelva la respuesta de la IA al cliente.

## 2. Prerrequisitos

- Tener la [Supabase CLI](https://supabase.com/docs/guides/cli) instalada y configurada en el proyecto.
- Tener una clave de API de Google Gemini.

## 3. Pasos de Implementación

### Paso 3.1: Creación de la Función

Usa la Supabase CLI para crear el andamiaje de la nueva función. Abre tu terminal en la raíz del proyecto y ejecuta:

```bash
supabase functions new ask-gemini
```

Esto creará una nueva carpeta en `supabase/functions/ask-gemini` con un archivo `index.ts` dentro.

### Paso 3.2: Almacenamiento Seguro de la API Key

**NUNCA** escribas tu clave de API directamente en el código. La almacenaremos como un secreto en Supabase. Ejecuta el siguiente comando, reemplazando `tu_clave_aqui` con tu clave real:

```bash
supabase secrets set GEMINI_API_KEY tu_clave_aqui
```

Este secreto estará disponible como una variable de entorno dentro de la Edge Function.

### Paso 3.3: Código de la Edge Function (`index.ts`)

Reemplaza el contenido del archivo `supabase/functions/ask-gemini/index.ts` con el siguiente código. Este código está escrito para el entorno de Deno que usan las Edge Functions.

```typescript
// supabase/functions/ask-gemini/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// URL de la API de Gemini para el modelo v1
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;

// Función principal que se ejecuta al recibir una petición
serve(async (req) => {
  // 1. Manejo de CORS para permitir peticiones desde el navegador
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    // 2. Obtener la API Key de los secretos de Supabase
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
    }

    // 3. Extraer los mensajes del cuerpo de la petición del frontend
    const { messages } = await req.json();
    if (!messages) {
      return new Response(JSON.stringify({ error: "No se proporcionaron mensajes." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Formatear la petición para la API de Gemini
    const geminiRequestBody = {
      contents: messages.map((msg: { role: string, content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : msg.role,
        parts: [{ text: msg.content }],
      })),
      // Opcional: Configuraciones de seguridad y generación
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    };

    // 5. Realizar la llamada a la API de Gemini
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiRequestBody),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Error en la API de Gemini: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    const assistantMessage = geminiData.candidates[0]?.content.parts[0]?.text || "No se recibió respuesta.";

    // 6. Devolver la respuesta de la IA al frontend
    return new Response(JSON.stringify({ reply: assistantMessage }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
```

### Paso 3.4: Despliegue de la Función

Una vez que el código esté guardado, despliega la función a los servidores de Supabase con el siguiente comando:

```bash
supabase functions deploy ask-gemini --no-verify-jwt
```

La opción `--no-verify-jwt` es importante porque esta función será llamada por usuarios anónimos y autenticados, y no queremos que Supabase bloquee las peticiones por defecto.

---

Con esta guía, el plan para el backend del chat está claramente documentado y listo para ser ejecutado.
