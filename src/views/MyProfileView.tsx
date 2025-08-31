import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { PostCard } from '../components/PostCard';
import { Camera, Save, X } from 'lucide-react';
import type { CommunityPost } from '../types';

const DEFAULT_AVATAR_SVG_DATA_URI = "data:image/svg+xml,%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='avatar-gradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%237C3AED' /%3e%3cstop offset='100%25' stop-color='%233B82F6' /%3e%3c/linearGradient%3e%3c/defs%3e%3cpath d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z' fill='url(%23avatar-gradient)'/%3e%3cpath d='M12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6ZM12 20C10.18 20 8.55 19.23 7.3 17.99C7.35 15.99 10.69 14.9 12 14.9C13.31 14.9 16.65 15.99 16.7 17.99C15.45 19.23 13.82 20 12 20Z' fill='white'/%3e%3c/svg%3e";

// Helper function to resize and compress images before upload
const resizeAndCompressImage = (file: File, maxSize: number): Promise<File> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > height) {
                if (width > maxSize) {
                    height = Math.round(height * (maxSize / width));
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = Math.round(width * (maxSize / height));
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        return reject(new Error('Canvas to Blob conversion failed'));
                    }
                    const newFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(newFile);
                },
                'image/jpeg',
                0.9 // Good quality compression
            );
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
};

export const MyProfileView: React.FC = () => {
    const { userProfile, communityPosts, updateUserProfile, fetchCommunityData, uploadAvatar } = useStore();
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState(userProfile?.full_name || '');
    const [title, setTitle] = useState(userProfile?.title || '');
    const [avatar, setAvatar] = useState(userProfile?.avatar_url || DEFAULT_AVATAR_SVG_DATA_URI);
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        fetchCommunityData();
    }, [fetchCommunityData]);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.full_name || '');
            setTitle(userProfile.title || '');
            setAvatar(userProfile.avatar_url || DEFAULT_AVATAR_SVG_DATA_URI);
        }
    }, [userProfile]);

    if (!userProfile) {
        return <div className="p-6 text-center text-gray-600">Inicia sesión para ver tu perfil.</div>;
    }

    const userPosts = communityPosts.filter((p: CommunityPost) => p.userId === userProfile.id);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const originalFile = e.target.files[0];
                const resizedFile = await resizeAndCompressImage(originalFile, 512); // Resize to 512px max
                
                setNewAvatarFile(resizedFile); // This is now the small file
                setAvatar(URL.createObjectURL(resizedFile)); // Preview the small file
            } catch (error) {
                console.error("Error resizing image:", error);
                // Optionally, fall back to the original file if resizing fails
                setNewAvatarFile(e.target.files[0]);
                setAvatar(URL.createObjectURL(e.target.files[0]));
            }
        }
    };

    const handleSave = async () => {
        let avatar_url = userProfile.avatar_url;
        if (newAvatarFile) {
            const uploadedUrl = await uploadAvatar(userProfile.id, newAvatarFile);
            if (uploadedUrl) {
                avatar_url = uploadedUrl;
            } else {
                console.error("Error uploading avatar, using existing or default.");
                avatar_url = userProfile.avatar_url || DEFAULT_AVATAR_SVG_DATA_URI;
            }
        }
        await updateUserProfile(userProfile.id, { full_name: name, title, avatar_url });
        setIsEditing(false);
        setNewAvatarFile(null);
    };

    const handleCancel = () => {
        if (userProfile) {
            setName(userProfile.full_name || '');
            setTitle(userProfile.title || '');
            setAvatar(userProfile.avatar_url || DEFAULT_AVATAR_SVG_DATA_URI);
        }
        setIsEditing(false);
        setNewAvatarFile(null);
    };

    return (
        <div className="p-6 md:p-10 animate-fade-in h-full bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-32" />
                <div className="p-8">
                    <div className={`flex items-end ${isEditing ? 'pb-4 -mt-16' : '-mt-20'}`}>
                        <div className="relative w-28 h-28 flex-shrink-0">
                            <div
                                style={{
                                    backgroundImage: `url("${avatar}")`,
                                    backgroundSize: '120%'
                                }}
                                className="w-full h-full rounded-full bg-center border-4 border-white shadow-lg"
                                aria-label={name}
                                role="img"
                            ></div>
                            {isEditing && (
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-2 cursor-pointer hover:bg-gray-900 transition-colors">
                                    <Camera className="w-5 h-5" />
                                    <input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                </label>
                            )}
                        </div>
                        <div className="ml-4 flex-grow">
                            {isEditing ? (
                                <div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent text-3xl font-bold text-gray-800 border-b-2 border-gray-300 focus:border-purple-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-transparent text-lg text-gray-500 border-b-2 border-gray-300 focus:border-purple-500 outline-none mt-1"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{userProfile.full_name || 'Nombre no especificado'}</h1>
                                    <p className="text-lg text-gray-600">{userProfile.title || 'Título no especificado'}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 ml-4">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"><Save size={18}/> Guardar</button>
                                    <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors flex items-center gap-2"><X size={18}/> Cancelar</button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Editar Perfil</button>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-around bg-gray-100 p-4 rounded-lg">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{userProfile.level || 0}</p>
                            <p className="text-sm text-gray-600">Nivel</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{userProfile.points || 0}</p>
                            <p className="text-sm text-gray-600">Puntos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{userPosts.length}</p>
                            <p className="text-sm text-gray-600">Publicaciones</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Publicaciones</h2>
                        {userPosts.length > 0 ? (
                            <div className="space-y-6">
                                {userPosts.map((post: CommunityPost) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">Aún no has realizado ninguna publicación.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};