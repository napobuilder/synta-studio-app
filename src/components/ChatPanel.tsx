import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase } from '../supabaseClient';
import { X, Send, Bot, User, MessageSquare, Info } from 'lucide-react';
import type { Message } from '../types';

const ChatPanel: React.FC = () => {
    const {
        isChatPanelOpen,
        toggleChatPanel,
        chatMessages,
        addChatMessage,
        activePromptTitle,
        activeSystemPrompt,
    } = useStore();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatMessages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        addChatMessage(userMessage);
        setInput('');
        setIsLoading(true);

        try {
            const systemMessage: Message | undefined = activeSystemPrompt ? { role: 'system', content: activeSystemPrompt } : undefined;
            
            const conversationMessages = chatMessages.filter((m: Message) => m.role !== 'status');

            const messageHistory = [
                ...(systemMessage ? [systemMessage] : []),
                ...conversationMessages,
                userMessage,
            ];

            const { data, error } = await supabase.functions.invoke('smart-task', {
                body: { messages: messageHistory },
            });

            if (error) {
                throw error;
            }

            const assistantResponse: Message = {
                role: 'assistant',
                content: data.reply || "No se recibió una respuesta válida.",
            };
            addChatMessage(assistantResponse);

        } catch (error: unknown) {
            console.error("Error al invocar la Edge Function:", error);

            let errorMessageContent = "Lo siento, ha ocurrido un error al contactar a la IA. Por favor, inténtalo de nuevo.";

            if (error instanceof Error && (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429'))) {
                errorMessageContent = "La IA está recibiendo muchas peticiones en este momento. Por favor, espera un momento antes de enviar otro mensaje.";
            }

            const errorMessage: Message = {
                role: 'assistant',
                content: errorMessageContent,
            };
            addChatMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage();
    };

    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {!isChatPanelOpen && (
                <button
                    onClick={() => toggleChatPanel(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-40"
                    aria-label="Abrir chat"
                >
                    <MessageSquare className="w-7 h-7" />
                </button>
            )}

            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isChatPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <Bot className="text-purple-600 w-6 h-6 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <h2 className="text-lg font-semibold text-gray-800 truncate">IA Prompt Lab</h2>
                            {activePromptTitle && (
                                <p className="text-xs text-gray-500 truncate" title={activePromptTitle}>Probando: {activePromptTitle}</p>
                            )}
                        </div>
                    </div>
                    <button onClick={() => toggleChatPanel(false)} className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0 ml-2">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </header>

                <main className="flex-1 p-4 space-y-6 overflow-y-auto bg-gray-50">
                    {chatMessages.map((msg: Message, index: number) => {
                        if (msg.role === 'status') {
                            return (
                                <div key={index} className="flex items-center justify-center gap-2 text-sm text-gray-500 my-4">
                                    <Info className="w-4 h-4" />
                                    <span>{msg.content}</span>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    <p className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`} style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t border-gray-200 flex-shrink-0">
                    <form onSubmit={handleFormSubmit}>
                        <div className="relative">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleTextareaKeyDown}
                                placeholder="Escribe tu mensaje..."
                                className="w-full h-12 p-3 pr-14 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default ChatPanel;