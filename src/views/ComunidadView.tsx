import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { PostCard } from '../components/PostCard';
import { Leaderboard } from '../components/Leaderboard';
import { CreatePostForm } from '../components/CreatePostForm';

export const ComunidadView: React.FC = () => {
    const { communityPosts, fetchCommunityData } = useStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchCommunityData();
            setLoading(false);
        };
        fetchData();
    }, [fetchCommunityData]);

    return (
        <div className="p-6 md:p-10 animate-fade-in h-full flex flex-col bg-gray-50">
            <div className="max-w-7xl mx-auto w-full">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Comunidad Synta</h1>
                    <p className="text-lg text-gray-600 mb-10">Conecta, comparte y crece con otros expertos en la construcción de ecosistemas digitales.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
                {/* Sidebar for Leaderboard */}
                <div className="lg:col-span-1 space-y-8">
                    <Leaderboard />
                </div>

                {/* Main Content Area for Posts */}
                <div className="lg:col-span-3">
                    <CreatePostForm />
                    <div className="space-y-6 mt-8">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : communityPosts.length > 0 ? (
                            communityPosts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center text-gray-500">
                                <p className="text-lg font-semibold mb-2">Aún no hay publicaciones.</p>
                                <p>¡Sé el primero en compartir algo!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};