# Guía y Bitácora: Conexión de la API de Gemini vía Supabase Edge Functions

Este documento resume los hallazgos, problemas y soluciones encontradas durante la implementación de una llamada a la API de Google Gemini a través de una Edge Function de Supabase. El objetivo es servir como referencia para futuras implementaciones.

## 1. Resumen de la Arquitectura Final

- **Frontend:** Una aplicación React (Vite + TypeScript) con un panel de chat.
- **Gestión de Estado:** Zustand para manejar el estado del chat (mensajes, visibilidad, etc.).
- **Backend:** Una Supabase Edge Function (`smart-task`) que actúa como un proxy seguro para la API de Gemini.
- **Autenticación:** La clave de la API de Gemini se almacena como un secreto directamente en la Edge Function, **no** en el Vault de Supabase.

## 2. Proceso de Depuración y Hallazgos Clave

Durante la implementación, nos encontramos con una serie de problemas en cadena. La solución de cada uno nos llevó al siguiente, en un proceso de depuración clásico.

### Problema 1: Fallo de Conexión de la CLI de Supabase

- **Síntoma:** Los comandos de la CLI como `supabase link` o `supabase secrets set` fallaban con errores de `timeout`.
- **Diagnóstico:** Se utilizó el comando `ping aws-1-us-east-1.pooler.supabase.com` (el host de la base de datos) que también fallaba. Esto confirmó que el problema era de red local en la máquina del desarrollador, no un problema de Supabase.
- **Solución / Workaround:** Se abandonó el uso de la CLI y se procedió a gestionar la Edge Function (creación, despliegue, gestión de secretos) **directamente desde el panel web de Supabase**.

### Problema 2: La Función no se Invocaba (No había Logs)

- **Síntoma:** El frontend mostraba un error genérico, pero no aparecían nuevos logs en el panel de la Edge Function.
- **Diagnóstico:** Esto ocurre cuando la llamada `supabase.functions.invoke()` falla antes de llegar a la función. La causa siempre es un **nombre de función incorrecto** en el código del frontend.
- **Solución:** Verificar que el string del nombre de la función en el código (`invoke('mi-funcion', ...)` coincida **exactamente** con el nombre de la función en el panel de Supabase.

### Problema 3: Error `GEMINI_API_KEY no está definida`

- **Síntoma:** El log de la función mostraba este error explícito.
- **Diagnóstico:** El secreto de la API se había creado en el lugar incorrecto. Se creó en **Settings > Vault**, que es el gestor de secretos para la base de datos (Postgres), no para las Edge Functions.
- **Solución:** El secreto debe crearse en la sección específica de la función: **Edge Functions > (tu función) > Secrets**. Tras añadir el secreto en el lugar correcto, es crucial **redesplegar** la función.

### Problema 4: Error `models/gemini-pro is not found`

- **Síntoma:** El log de la función devolvía un error 404 de la propia API de Gemini.
- **Diagnóstico:** El nombre del modelo `gemini-pro` estaba obsoleto o no era el adecuado para la versión de la API (`v1beta`).
- **Solución:** Se actualizó la URL en el código de la función para apuntar a un modelo más reciente y estable: `gemini-1.5-flash-latest`.

### Problema 5: Error `Content with system role is not supported`

- **Síntoma:** La API de Gemini devolvía un error relacionado con el rol "system".
- **Diagnóstico:** A diferencia de otras APIs de lenguaje, la API de Gemini no acepta un mensaje con `role: 'system'` dentro del historial de la conversación (`contents`).
- **Solución:** La instrucción del sistema debe enviarse en un campo separado y a nivel superior en el cuerpo de la petición, llamado `system_instruction`.

## 3. Código Final y Funcional de la Edge Function

Este código incorpora todas las soluciones y representa la versión estable y correcta.

```typescript
// supabase/functions/smart-task/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
    
    const { messages } = await req.json();
    if (!messages) return new Response(JSON.stringify({ error: "No se proporcionaron mensajes." }), { status: 400, headers: { "Content-Type": "application/json" } });

    const systemPrompt = messages.find((msg: { role: string }) => msg.role === 'system');
    const conversationMessages = messages.filter((msg: { role: string }) => msg.role === 'user' || msg.role === 'assistant');

    const geminiRequestBody: any = {
        contents: conversationMessages.map((msg: { role: string, content: string }) => ({ 
            role: msg.role === 'assistant' ? 'model' : msg.role, 
            parts: [{ text: msg.content }] 
        })),
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
    };

    if (systemPrompt) {
        geminiRequestBody.system_instruction = {
            parts: [{ text: systemPrompt.content }]
        };
    }

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(geminiRequestBody) 
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Error en la API de Gemini: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    const assistantMessage = geminiData.candidates[0]?.content.parts[0]?.text || "No se recibió respuesta.";
    
    return new Response(JSON.stringify({ reply: assistantMessage }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
});
```

## 4. Consideraciones de Escalabilidad

- **Límites del Plan Gratuito:** El plan gratuito de la API de Gemini es insuficiente para producción (aprox. 1,500 peticiones/día). Es propenso a agotarse rápidamente, posiblemente por **límites de tasa por IP** compartida en la infraestructura de Supabase.
- **Solución:** La única solución robusta para un producto real es **habilitar la facturación (plan de pago)** en el proyecto de Google Cloud para acceder a cuotas de nivel de producción.
