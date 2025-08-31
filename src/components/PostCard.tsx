import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { CommunityPost } from '../types';
import { ThumbsUp, MessageCircle, Send, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: CommunityPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { userProfile, toggleLikePost, addComment, deletePost, deleteComment, updatePost } = useStore();
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(post.title);
    const [editedContent, setEditedContent] = useState(post.content);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const currentUser = userProfile;
    const user = post.author;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsActionMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    if (!user || !currentUser) return null;

    const handleLikeClick = async () => {
        await toggleLikePost(post.id, currentUser.id);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        await addComment(post.id, { userId: currentUser.id, content: comment });
        setComment('');
        setShowComments(true);
    };

    const handleDeletePost = async () => {
        setIsActionMenuOpen(false);
        if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            await deletePost(post.id);
        }
    };

    const handleEditClick = () => {
        setIsActionMenuOpen(false);
        setIsEditing(true);
    }

    const handleDeleteComment = async (commentId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            await deleteComment(commentId);
        }
    };

    const handleUpdatePost = async () => {
        if (!editedTitle.trim() || !editedContent.trim()) return;
        await updatePost(post.id, { title: editedTitle, content: editedContent });
        setIsEditing(false);
    };

    const isLiked = post.likedBy.includes(currentUser.id);

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <div className="p-5">
                <div className="flex items-start gap-3">
                    <Link to={`/app/profile/${user.id}`} className="flex-shrink-0">
                        {/* Avatar Fix: Container div creates the circle and is immune to global img styles */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <img 
                                src={user.avatar_url || '/assets/default-avatar.svg'} 
                                alt={user.full_name || 'Avatar de usuario'} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </Link>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <div>
                                <Link to={`/app/profile/${user.id}`}>
                                    <p className="font-bold text-gray-800 text-lg hover:underline">{user.full_name || 'Usuario Anónimo'}</p>
                                </Link>
                                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                            </div>
                            <div className="relative" ref={menuRef}>
                                {post.userId === currentUser.id && (
                                    <button onClick={() => setIsActionMenuOpen(!isActionMenuOpen)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full">
                                        <MoreHorizontal size={24} />
                                    </button>
                                )}
                                {isActionMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 border">
                                        <button onClick={handleEditClick} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Pencil size={16} />
                                            <span>Editar</span>
                                        </button>
                                        <button onClick={handleDeletePost} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            <Trash2 size={16} />
                                            <span>Eliminar</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="mt-4">
                                <input 
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xl font-bold mb-2"
                                />
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                                    rows={4}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => setIsEditing(false)} className="text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100">
                                        Cancelar
                                    </button>
                                    <button onClick={handleUpdatePost} className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2 mt-4">{post.title}</h3>
                                <p className="text-gray-700 text-base whitespace-pre-wrap leading-relaxed">{post.content}</p>
                            </div>
                        )}
                    </div>
                </div>

                {!isEditing && (
                    <>
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                            <div>{post.likes} Likes</div>
                            <div>{post.comments.length} Comentarios</div>
                        </div>
                    </>
                )}
            </div>

            {!isEditing && (
                <>
                    <div className="border-t border-gray-200">
                        <div className="flex justify-around">
                            <button 
                                onClick={handleLikeClick}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-base font-semibold transition-colors duration-200 ${isLiked ? 'text-purple-600' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <ThumbsUp className={`${isLiked ? 'fill-current' : ''}`} size={20} />
                                <span>Me gusta</span>
                            </button>
                            <button 
                                onClick={() => setShowComments(!showComments)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 text-base font-semibold text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                            >
                                <MessageCircle size={20} />
                                <span>Comentar</span>
                            </button>
                        </div>
                    </div>

                    {showComments && (
                        <div className="p-5 bg-gray-50 border-t border-gray-200">
                            <form onSubmit={handleCommentSubmit} className="flex items-start gap-2 mb-4">
                                <img src={currentUser.avatar_url || '/assets/default-avatar.svg'} alt={currentUser.full_name || 'Avatar de usuario'} className="w-9 h-9 rounded-full object-cover" />
                                <div className="flex-grow relative">
                                    <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Escribe un comentario..."
                                        className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50" disabled={!comment.trim()}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                            <div className="space-y-4">
                                {post.comments.map(comment => {
                                    const commentUser = comment.author;
                                    if (!commentUser) return null;
                                    return (
                                        <div key={comment.id} className="flex items-start gap-3 group">
                                            <Link to={`/app/profile/${commentUser.id}`}>
                                                <img src={commentUser.avatar_url || '/assets/default-avatar.svg'} alt={commentUser.full_name || 'Avatar de usuario'} className="w-9 h-9 rounded-full object-cover" />
                                            </Link>
                                            <div className="bg-gray-100 p-3 rounded-xl flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <Link to={`/app/profile/${commentUser.id}`}>
                                                        <p className="text-sm font-bold text-gray-800 hover:underline">{commentUser.full_name || 'Usuario Anónimo'}</p>
                                                    </Link>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                                                        {comment.userId === currentUser.id && (
                                                            <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};