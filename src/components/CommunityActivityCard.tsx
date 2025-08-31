import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';

export const CommunityActivityCard: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3"><MessageSquare className="w-5 h-5 text-green-500" /><h3 className="text-lg font-bold text-gray-800">Actividad Reciente</h3></div>
            <p className="text-gray-600 mb-4">Nuevo debate: "¿Cuál es tu herramienta de IA favorita para copywriting?"</p>
            <Link to="/app/comunidad" className="w-full flex items-center justify-center gap-2 text-green-600 font-semibold hover:text-green-800 transition-colors">Unirme a la conversación <ArrowRight className="w-4 h-4" /></Link>
        </div>
    );
};