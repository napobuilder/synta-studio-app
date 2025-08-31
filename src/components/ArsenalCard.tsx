import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { Zap, Bot, Briefcase, Package, MessageSquareText, Gift, Download, ArrowRight } from 'lucide-react';

interface ArsenalCardProps {
  product: Product;
}

const typeInfo: { [key: string]: { icon: React.ElementType, label: string, color: string } } = {
    'servicio': { icon: Briefcase, label: 'Servicio', color: 'bg-blue-500' },
    'agente-ia': { icon: Bot, label: 'Agente IA', color: 'bg-purple-500' },
    'kit': { icon: Package, label: 'Kit', color: 'bg-green-500' },
    'prompt-de-pago': { icon: MessageSquareText, label: 'Prompt', color: 'bg-orange-500' },
    'recurso-gratuito': { icon: Gift, label: 'Gratis', color: 'bg-teal-500' },
    'unknown': { icon: Zap, label: 'Producto', color: 'bg-gray-500' },
};

export const ArsenalCard: React.FC<ArsenalCardProps> = ({ product }) => {
    const { icon: Icon, label, color } = typeInfo[product.type] || typeInfo.unknown;
    const isFree = product.type === 'recurso-gratuito';

    return (
        <div className="relative flex flex-col rounded-2xl bg-gradient-to-br from-purple-700 via-purple-800 to-blue-800 text-white shadow-2xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50">
            <div className="h-80 overflow-hidden bg-black/10 flex items-center justify-center">
                <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className={`${product.tags.includes('portada') ? 'object-contain max-w-full max-h-full' : 'object-cover w-full h-full'} group-hover:scale-110 transition-transform duration-500 ease-in-out`}
                />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className={`absolute top-4 right-4 text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 tracking-tight">{product.title}</h3>
                <p className="text-purple-200 text-sm mb-4 flex-grow font-light">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 my-4">
                    {product.tags.map(tag => (
                        <span key={tag} className="bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">{tag}</span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-baseline gap-2">
                        {!isFree ? (
                            <>
                                <span className="text-4xl font-extrabold tracking-tighter">${product.price}</span>
                                {product.originalPrice && (
                                    <del className="text-2xl font-bold text-purple-300/70">${product.originalPrice}</del>
                                )}
                            </>
                        ) : (
                            <span className="text-2xl font-bold">Gratis</span>
                        )}
                    </div>
                    {isFree ? (
                        <a 
                            href={product.purchaseUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="bg-white text-purple-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-purple-200 hover:scale-110 shadow-lg"
                        >
                            <Download className="w-4 h-4" />
                            <span>Descargar</span>
                        </a>
                    ) : (
                        <Link 
                            to={`/app/arsenal/${product.id}`}
                            className="bg-white text-purple-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-purple-200 hover:scale-110 shadow-lg"
                        >
                            <span>Saber Más</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};