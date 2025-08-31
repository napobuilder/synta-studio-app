import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Send } from 'lucide-react';

export const CreatePostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { addPost, userProfile } = useStore();
    const MAX_CHARS = 500;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !userProfile) return;

        await addPost({
            userId: userProfile.id,
            title: title,
            content: content,
        });

        setTitle('');
        setContent('');
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_CHARS) {
            setContent(e.target.value);
        }
    };

    const charsRemaining = MAX_CHARS - content.length;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Crear nueva publicación</h3>
            <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base text-gray-700 placeholder-gray-400 transition-all duration-200 mb-4"
                placeholder="Título de la publicación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y text-base text-gray-700 placeholder-gray-400 transition-all duration-200"
                rows={4}
                placeholder="Contenido de la publicación..."
                value={content}
                onChange={handleContentChange}
            ></textarea>
            <div className="flex justify-between items-center mt-3">
                <span className={`text-sm ${charsRemaining < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                    {charsRemaining} caracteres restantes
                </span>
                <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!title.trim() || !content.trim() || content.length > MAX_CHARS}
                >
                    <Send className="w-5 h-5" /> Publicar
                </button>
            </div>
        </form>
    );
};