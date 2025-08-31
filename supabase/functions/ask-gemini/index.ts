// supabase/functions/smart-task/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Tipos para la API de Gemini
interface Part {
  text: string;
}

interface Content {
  role: 'user' | 'model';
  parts: Part[];
}

interface SafetySetting {
  category: string;
  threshold: string;
}

interface SystemInstruction {
  parts: Part[];
}

interface GeminiRequestBody {
  contents: Content[];
  safetySettings: SafetySetting[];
  system_instruction?: SystemInstruction; // Opcional
}

interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" } });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
    
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "No se proporcionaron mensajes válidos." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const systemPrompt = messages.find((msg: RequestMessage) => msg.role === 'system');
    const conversationMessages = messages.filter((msg: RequestMessage) => msg.role === 'user' || msg.role === 'assistant');

    const geminiRequestBody: GeminiRequestBody = {
        contents: conversationMessages.map((msg: RequestMessage) => ({ 
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