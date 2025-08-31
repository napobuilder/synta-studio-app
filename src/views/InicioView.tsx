import React from 'react';
import { useStore } from '../store/useStore';
import { NavLink } from 'react-router-dom';
import { FlaskConical, Users, ShoppingCart, ArrowRight } from 'lucide-react';

export const InicioView: React.FC = () => {
  const { userProfile, communityPosts } = useStore();
  
  // Tomamos los 3 posts más recientes para la sección de actividad
  const recentPosts = communityPosts.slice(0, 3);
  
  const quickActions = [
    { to: '/app/synta-lab', icon: FlaskConical, title: 'Laboratorio de Prompts', description: 'Explora y prueba prompts de IA.', cta: 'Entrar al Lab' },
    { to: '/app/comunidad', icon: Users, title: 'Únete a la Conversación', description: 'Comparte ideas y conecta con otros.', cta: 'Ver Comunidad' },
    { to: '/app/arsenal', icon: ShoppingCart, title: 'Mejora tus Herramientas', description: 'Adquiere agentes y servicios.', cta: 'Visitar Arsenal' },
  ];

  return (
    <div className="animate-fade-in space-y-10">
      {/* 1. Cabecera de Bienvenida */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Hola, {userProfile?.full_name?.split(' ')[0] || '...'}.</h1>
        <p className="text-gray-500 text-lg">Bienvenido de nuevo a tu centro de operaciones.</p>
      </div>

      {/* 2. Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map(action => (
          <NavLink key={action.to} to={action.to} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-purple-300 hover:-translate-y-1">
            <action.icon className="w-8 h-8 mb-4 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">{action.title}</h3>
            <p className="text-gray-500 text-sm flex-grow mb-4">{action.description}</p>
            <div className="font-semibold text-purple-600 flex items-center gap-2">
              {action.cta} <ArrowRight size={16} />
            </div>
          </NavLink>
        ))}
      </div>

      {/* 3. Sección de Actividad Reciente */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente en la Comunidad</h3>
        <div className="space-y-4">
          {recentPosts.length > 0 ? recentPosts.map(post => (
            <NavLink key={post.id} to={`/app/comunidad`} className="block p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="font-bold text-gray-800 truncate">{post.title}</p>
              <p className="text-sm text-gray-500">en el canal #{post.channel}</p>
            </NavLink>
          )) : (
            <p className="text-gray-500 text-center p-4">No hay actividad reciente. ¡Sé el primero en publicar!</p>
          )}
        </div>
      </div>
    </div>
  );
};