import React, { useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { PromptCard } from '../components/PromptCard';
import { Search } from 'lucide-react';

export const SyntaLabView: React.FC = () => {
    // Obtenemos el estado y las acciones del store
    const { 
        prompts, 
        fetchPrompts, 
        searchTerm, 
        setSearchTerm, 
        activeCategory, 
        setActiveCategory 
    } = useStore();
    
    // useEffect para cargar los prompts desde la base de datos cuando el componente se monta
    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    const categories = useMemo(() => {
        if (!prompts) return ['Todos'];
        return ['Todos', ...new Set(prompts.map(p => p.category).filter(Boolean))];
    }, [prompts]);
    
    const filteredPrompts = useMemo(() => {
        if (!prompts) return [];
        return prompts.filter(prompt => {
            const matchesCategory = activeCategory === 'Todos' || prompt.category === activeCategory;
            const matchesSearch = searchTerm === '' || 
                                  prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
            return matchesCategory && matchesSearch;
        });
    }, [prompts, searchTerm, activeCategory]);

    return (
        <div className="p-6 md:p-10 animate-fade-in">
            <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Laboratorio de Prompts</h1>
                <p className="text-gray-500 text-lg mb-8">Un arsenal de herramientas para construir pensamiento estratégico. Busca, filtra y encuentra el prompt preciso para tu objetivo.</p>
            </div>
            
            <div className="sticky top-0 md:top-16 bg-gray-50/80 backdrop-blur-sm py-4 z-10">
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Buscar por título, descripción o etiqueta..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button 
                            key={category} 
                            onClick={() => setActiveCategory(category)} 
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === category ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredPrompts.length > 0 ? (
                    filteredPrompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)
                ) : (
                    <p className="md:col-span-3 text-center text-gray-500">No se encontraron prompts que coincidan con tu búsqueda.</p>
                )}
            </div>
        </div>
    );
};