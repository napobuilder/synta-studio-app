import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Product } from '../types';
import { parseProductsFromMarkdown } from '../lib/markdownParser';
import { CheckCircle, ShoppingCart } from 'lucide-react';
// import { ArrowRight, Zap, ShieldCheck, BarChart, BrainCircuit, MessageSquare, XCircle } from 'lucide-react';

// const CTA_ID = 'cta-website-sales';

/*
const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg">
    <div className="text-blue-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </div>
);
*/

/*
const ComparisonRow = ({ feature, included }) => (
  <li className={`flex items-center justify-between py-3 px-4 rounded-lg ${included ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
    <span className="text-gray-300">{feature}</span>
    {included ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
  </li>
);
*/

/*
const FeatureCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-7 h-7 text-purple-400" />
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-300 font-light">{children}</p>
  </div>
);
*/

/*
const ComparisonRow: React.FC<{ feature: string; jamstack: boolean; wordpress: boolean }> = ({ feature, jamstack, wordpress }) => (
  <tr className="border-b border-white/10">
    <td className="py-4 font-semibold text-white">{feature}</td>
    <td className="py-4 text-center">{jamstack ? <CheckCircle className="w-6 h-6 text-green-400 mx-auto" /> : <span className="text-red-400">-</span>}</td>
    <td className="py-4 text-center">{wordpress ? <CheckCircle className="w-6 h-6 text-green-400 mx-auto" /> : <span className="text-red-400">-</span>}</td>
  </tr>
);
*/

export const WebsiteSalesView: React.FC = () => {
  const { addToCart, startNewChatWithPrompt, session } = useStore();
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isChatDisabled = !session;

  const salesPromptTemplate = {
    agent_persona: "Eres 'Synta', un Asesor Experto de Synta Studio. Tu tono es el de un especialista en marketing y sistemas de negocio: claro, competente y servicial. Tu objetivo es que el usuario se sienta informado y entienda el valor real del producto, sin presiones.",
    objective: "Tu meta principal es clarificar cualquier duda que el usuario tenga sobre el producto. Responde a sus preguntas de forma directa y precisa. Secundariamente, y solo si la conversación fluye hacia ello, conecta las características del producto con los beneficios que podría obtener el usuario.",
    opening_line: "¡Hola! Soy Synta. Veo que estás revisando este producto. ¿Hay alguna pregunta específica que tengas en mente o alguna característica sobre la que te gustaría saber más?",
    value_proposition: "Nuestra filosofía es que el poder no está en las herramientas aisladas, sino en el sistema que las une. Más que un producto, esto es una pieza de un ecosistema diseñado para que nuestros clientes conviertan su conocimiento en un negocio que crece de forma predecible.",
    pain_point_and_solution: "Muchos de nuestros clientes son expertos en su campo, pero se convierten en el cuello de botella de su propio crecimiento porque les falta el sistema para empaquetar y vender su conocimiento de forma automática. Nosotros resolvemos esa parte estructural para que su genialidad pueda escalar.",
    call_to_action: "Si la información te parece útil y quieres explorar más a fondo, te recomiendo nuestra 'Guía de los 5 Agujeros que Hacen Invisible a tu Negocio'. También podemos agendar una llamada corta para ver si esto encaja con tus objetivos. Sin ningún compromiso. ¿Qué prefieres?",
    closing_line: "Tú decides el siguiente paso. Aquí estoy para ayudarte si tienes más preguntas.",
    core_instruction: "MUY IMPORTANTE: No hagas suposiciones sobre las emociones o preocupaciones del usuario (ej: no digas 'entiendo que te preocupe el coste'). Simplemente responde a sus preguntas de forma directa. Si preguntan por el precio, da el precio y pregunta si quieren saber qué incluye. Deja que la conversación fluya con naturalidad."
  };

  const generateSystemPrompt = (product: Product) => {
    const template = salesPromptTemplate;
    return `**Personalidad del Agente:**\n${template.agent_persona}\n\n**Objetivo:**\n${template.objective}\n\n**Línea de Apertura (para iniciar la conversación):**\n${template.opening_line}\n\n**Propuesta de Valor:**\n${template.value_proposition}\n\n**Punto de Dolor y Solución:**\n${template.pain_point_and_solution}\n\n**Llamada a la Acción:**\n${template.call_to_action}\n\n**Línea de Cierre:**\n${template.closing_line}\n\n---\n\n**Contexto Adicional (Información del Producto que el usuario está viendo):**\n\nTítulo: ${product.title}\nDescripción: ${product.description}\nPrecio: ${product.price}\n\n---\n\n**Instrucción Final:**\nBasado en toda la información anterior, tu tarea es responder a las preguntas del usuario. Inicia la conversación con tu 'Línea de Apertura'. Adapta tu 'Propuesta de Valor' y 'Punto de Dolor y Solución' a las necesidades del usuario. Tu objetivo final es guiarlo hacia la 'Llamada a la Acción'. Mantén siempre tu 'Personalidad de Agente'.`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('/ARSENAL_PRODUCTOS.md');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        const allProducts = parseProductsFromMarkdown(markdown);
        const foundProduct = allProducts.find(p => p.id === productId);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error fetching or parsing product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen">
      {isLoading && (
        <div className="p-10 text-center">Cargando producto...</div>
      )}

      {!isLoading && !product && (
        <div className="p-10 text-center">Producto no encontrado o ID no válido.</div>
      )}

      {!isLoading && product && (
        <>
          {/* HERO SECTION */}
          <section className="relative min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-purple-900/80 to-gray-900 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 animate-fade-in-up">
                {product.title}
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10 animate-fade-in-up animation-delay-300">
                {product.description}
              </p>
              <div className="flex justify-center gap-4 animate-fade-in-up animation-delay-600">
                <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20">
                  Ver Opciones y Precio
                </button>
              </div>
            </div>
          </section>

          {/* CONTENT SPECIFIC TO PRODUCT - EXAMPLE */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Detalles del Producto</h2>
              <p className="text-lg text-gray-400 mb-12">Aquí iría una descripción más detallada y persuasiva sobre {product.title}, explicando sus beneficios y características únicas.</p>
              {/* Aquí se podrían renderizar más detalles del producto o componentes específicos basados en product.type o product.id */}
            </div>
          </section>

          {/* PRICING & CTA SECTION */}
          <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">El Paquete Completo: {product.title}</h2>
              <p className="text-lg text-gray-300 mb-10">Una inversión única para un activo digital de gran valor.</p>
              <div className="bg-white/10 border border-purple-500/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
                <p className="text-xl font-semibold text-purple-300">{product.type === 'servicio' ? 'Servicio Completo' : 'Producto Digital'}</p>
                <p className="text-6xl font-extrabold my-6">${product.price.toLocaleString()}<span className="text-2xl font-medium text-gray-400"> USD</span></p>
                <ul className="space-y-3 text-left mb-8">
                  {product.tags.map(tag => (
                     <li key={tag} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-400"/><span>{tag}</span></li>
                  ))}
                </ul>
                <button onClick={() => addToCart(product)} className="w-full bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-3">
                  <ShoppingCart className="w-6 h-6" />
                  Añadir al Carrito
                </button>
                <button 
                    onClick={() => startNewChatWithPrompt({
                        title: `Preguntas sobre: ${product.title}`,
                        text: generateSystemPrompt(product)
                    })}
                    disabled={isChatDisabled}
                    className="mt-6 text-purple-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isChatDisabled ? "Inicia sesión para chatear con el asistente" : "Pregúntale a nuestro asistente de IA"}
                >
                  ¿Tienes preguntas? Habla con mi asistente de IA ahora.
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
