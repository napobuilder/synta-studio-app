import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../supabaseClient';
import { X, Copy, Check } from 'lucide-react';

export const PromptModal: React.FC = () => {
    const { isModalOpen, selectedPrompt, closeModal, session } = useStore();
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            setIsCopied(false);
        }
    }, [isModalOpen]);

    if (!isModalOpen || !selectedPrompt) {
        return null;
    }

    const handleCopy = async () => {
        if (!selectedPrompt) return;

        // 1. Copiar al portapapeles (método moderno)
        try {
            await navigator.clipboard.writeText(selectedPrompt.prompt_text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err);
            // Podríamos mostrar una notificación de error aquí
            return; // Detener si la copia falla
        }

        // 2. Registrar el uso en la base de datos
        const userId = session?.user?.id;
        if (userId && selectedPrompt.id) {
            const { error } = await supabase
                .from('prompt_usage')
                .insert({ user_id: userId, prompt_id: selectedPrompt.id });

            if (error) {
                console.error('Error al registrar el uso del prompt:', error);
            } else {
                console.log('Uso del prompt registrado con éxito.');
                // Opcional: podríamos actualizar un contador en el estado global aquí
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in-fast" onClick={closeModal}>
            <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedPrompt.title}</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </header>
                <div className="p-6 overflow-y-auto"><pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap font-mono">{selectedPrompt.prompt_text}</pre></div>
                <footer className="p-6 border-t border-gray-200">
                    <button onClick={handleCopy} className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-colors ${isCopied ? 'bg-green-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-900'}`}>
                        {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {isCopied ? '¡Copiado!' : 'Copiar Prompt'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
