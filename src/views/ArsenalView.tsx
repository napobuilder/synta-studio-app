import React, { useState, useEffect } from 'react';
import { parseProductsFromMarkdown } from '../lib/markdownParser';
import type { Product } from '../types';
import { ArsenalCard } from '../components/ArsenalCard';
import { Bot, Briefcase, Package, MessageSquareText, Gift } from 'lucide-react';

export const ArsenalView: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/ARSENAL_PRODUCTOS.md');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const markdown = await response.text();
                const parsedProducts = parseProductsFromMarkdown(markdown);
                setProducts(parsedProducts);
            } catch (error) {
                console.error("Error fetching or parsing arsenal products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const agents = products.filter(p => p.type === 'agente-ia');
    const services = products.filter(p => p.type === 'servicio');
    const kits = products.filter(p => p.type === 'kit');
    const prompts = products.filter(p => p.type === 'prompt-de-pago');
    const freebies = products.filter(p => p.type === 'recurso-gratuito');

    if (isLoading) {
        return <div className="p-10 text-center">Cargando el arsenal...</div>;
    }

    return (
        <div className="p-6 md:p-10 animate-fade-in">
            <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">El Arsenal</h1>
                <p className="text-gray-500 text-lg mb-12">Herramientas y servicios estratégicos para acelerar tu crecimiento. Pasa de la teoría a la acción con soluciones listas para implementar.</p>
            </div>
            
            {services.length > 0 && (
                <section id="services" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">Servicios Estratégicos</h2>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-gray-500 mb-8">Cuando necesitas un experto que lo haga por ti. Estos son nuestros servicios fundamentales para construir los cimientos de tu ecosistema de ventas.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(product => <ArsenalCard key={product.id} product={product} />)}
                    </div>
                </section>
            )}

            {agents.length > 0 && (
                <section id="agents" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Bot className="w-8 h-8 text-purple-600" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">Agentes de IA</h2>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-gray-500 mb-8">"Instala" estas herramientas de pensamiento en tu IA para obtener habilidades sobrehumanas en áreas clave de tu negocio.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {agents.map(product => <ArsenalCard key={product.id} product={product} />)}
                    </div>
                </section>
            )}

            {kits.length > 0 && (
                <section id="kits" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="w-8 h-8 text-green-600" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">Kits de Implementación</h2>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-gray-500 mb-8">Paquetes de recursos listos para usar que combinan estrategia, herramientas y plantillas para un resultado rápido.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {kits.map(product => <ArsenalCard key={product.id} product={product} />)}
                    </div>
                </section>
            )}

            {prompts.length > 0 && (
                <section id="prompts" className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquareText className="w-8 h-8 text-orange-600" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">Prompts de Pago</h2>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-gray-500 mb-8">Instrucciones de ingeniería avanzada para guiar a la IA hacia resultados de alta calidad en tareas específicas de marketing y ventas.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {prompts.map(product => <ArsenalCard key={product.id} product={product} />)}
                    </div>
                </section>
            )}

            {freebies.length > 0 && (
                 <section id="freebies">
                    <div className="flex items-center gap-3 mb-6">
                        <Gift className="w-8 h-8 text-teal-600" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">Recursos Gratuitos para la Comunidad</h2>
                    </div>
                    <div className="max-w-3xl">
                        <p className="text-gray-500 mb-8">Valor que puedes implementar hoy mismo. Un regalo de nuestra parte para ayudarte a acelerar tus resultados.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {freebies.map(product => <ArsenalCard key={product.id} product={product} />)}
                    </div>
                </section>
            )}
        </div>
    );
};