import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight } from 'lucide-react';

export const PromptOfTheWeekCard: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3"><Lightbulb className="w-5 h-5 text-purple-500" /><h3 className="text-lg font-bold text-gray-800">Prompt de la Semana</h3></div>
            <p className="text-gray-600 mb-4">The Epistemic Catalyst: Un prompt para desafiar tus sesgos cognitivos y fortalecer tus argumentos.</p>
            <Link to="/app/synta-lab" className="w-full flex items-center justify-center gap-2 text-purple-600 font-semibold hover:text-purple-800 transition-colors">Ir al Synta-Lab <ArrowRight className="w-4 h-4" /></Link>
        </div>
    );
};