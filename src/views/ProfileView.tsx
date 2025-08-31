import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { AppState } from '../store/useStore';
import { PostCard } from '../components/PostCard';
import { supabase } from '../supabaseClient';
import type { UserProfile, CommunityPost } from '../types';

export const ProfileView: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const communityPosts = useStore((state: AppState) => state.communityPosts);
    const fetchCommunityData = useStore((state: AppState) => state.fetchCommunityData);

    // Efecto para cargar el perfil del usuario que se está viendo
    useEffect(() => {
        const fetchViewedProfile = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.error('Error fetching viewed profile:', error);
                    setViewedProfile(null);
                } else {
                    setViewedProfile(data);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchViewedProfile();
    }, [userId]); // <- Dependencia ÚNICA y CORRECTA: solo se ejecuta si el userId cambia

    // Efecto para cargar los posts de la comunidad, si no existen
    useEffect(() => {
        if (communityPosts.length === 0) {
            fetchCommunityData();
        }
    }, [communityPosts.length, fetchCommunityData]); // <- Dependencias correctas

    const userPosts = communityPosts.filter((p: CommunityPost) => p.userId === userId);

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Cargando perfil...</div>;
    }

    if (!viewedProfile) {
        return <div className="p-6 text-center text-red-500">No se pudo encontrar el perfil de este usuario.</div>;
    }

    return (
        <div className="p-6 md:p-10 animate-fade-in h-full bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-32" />
                <div className="p-8">
                    <div className="flex items-end -mt-20">
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg flex-shrink-0">
                            <img 
                                src={viewedProfile.avatar_url || '/assets/default-avatar.svg'} 
                                alt={viewedProfile.full_name || 'Avatar'} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold text-white text-shadow">{viewedProfile.full_name || 'Usuario Anónimo'}</h1>
                            <p className="text-md text-gray-200">{viewedProfile.title || 'Sin título'}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-around bg-gray-100 p-4 rounded-lg">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{viewedProfile.level || 0}</p>
                            <p className="text-sm text-gray-600">Nivel</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{viewedProfile.points || 0}</p>
                            <p className="text-sm text-gray-600">Puntos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{userPosts.length}</p>
                            <p className="text-sm text-gray-600">Publicaciones</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Publicaciones Recientes</h2>
                        {userPosts.length > 0 ? (
                            <div className="space-y-6">
                                {userPosts.map((post: CommunityPost) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">Este usuario aún no ha realizado ninguna publicación.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};