import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

export const UpcomingSessionCard: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3"><Calendar className="w-5 h-5 text-blue-500" /><h3 className="text-lg font-bold text-gray-800">Próxima Sesión Grupal</h3></div>
            <p className="text-gray-600 mb-4">Q&A sobre Monetización de Contenido y Ecosistemas Digitales. ¡Prepara tus preguntas!</p>
            <Link to="/app/aloha-academy" className="w-full flex items-center justify-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">Ver Cursos <ArrowRight className="w-4 h-4" /></Link>
        </div>
    );
};