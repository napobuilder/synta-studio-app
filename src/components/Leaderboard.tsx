import React from 'react';
import { useStore } from '../store/useStore';
import { Award, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Leaderboard: React.FC = () => {
    const { communityUsers } = useStore();

    // Filtra usuarios que no tienen puntos o son nulos y ordena de mayor a menor
    const sortedUsers = [...communityUsers]
        .filter(user => user && user.points != null)
        .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <Award className="w-7 h-7 text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-800">Top Miembros</h3>
            </div>
            <ul className="space-y-5">
                {sortedUsers.slice(0, 5).map((user, index) => (
                    <li key={user.id} className="flex items-center gap-4 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-50">
                        <span className="font-extrabold text-lg text-gray-600 w-6 text-center">
                            {index === 0 && <Crown className="w-6 h-6 text-yellow-500 inline-block mr-1 -mt-1" />}
                            {index > 0 && `${index + 1}.`}
                        </span>
                        <Link to={`/app/profile/${user.id}`} className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                <img 
                                    src={user.avatar_url || ''} 
                                    alt={user.full_name || 'Avatar'} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </Link>
                        <div className="flex-1">
                            <Link to={`/app/profile/${user.id}`}>
                                <p className="font-semibold text-base text-gray-800 hover:underline">{user.full_name || 'Usuario Anónimo'}</p>
                            </Link>
                            <p className="text-xs text-gray-500">{user.title || 'Miembro'} - Nivel {user.level || 1}</p>
                        </div>
                        <span className="font-bold text-purple-600 text-base">{user.points || 0} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};