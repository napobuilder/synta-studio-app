import React from 'react';
import { useStore } from '../store/useStore';
import type { Prompt } from '../types';
import { Eye, MessageSquare } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
    const { openModal, startNewChatWithPrompt, session } = useStore();
    const isChatDisabled = !session;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className="flex-grow">
                <p className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 mb-2 tracking-wide">{prompt.category}</p>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{prompt.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{prompt.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {prompt.tags.slice(0, 3).map(tag => (<span key={tag} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>))}
            </div>
            <div className="mt-6 flex items-center gap-3">
                <button onClick={() => openModal(prompt)} className="flex-1 bg-gray-800 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors hover:bg-gray-900 flex items-center justify-center gap-2">
                    <Eye size={16} />
                    <span>Ver</span>
                </button>
                <button 
                    onClick={() => startNewChatWithPrompt({ title: prompt.title, text: prompt.prompt_text })}
                    disabled={isChatDisabled}
                    className="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-center transition-colors hover:bg-purple-700 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={isChatDisabled ? "Inicia sesión para probar el chat" : "Probar con IA"}
                >
                    <MessageSquare size={16} />
                    <span>Probar</span>
                </button>
            </div>
        </div>
    );
};
