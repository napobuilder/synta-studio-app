import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../supabaseClient';
import { UserCircle, LogOut, ChevronUp, Menu, ShoppingCart } from 'lucide-react';
import type { CartItem } from '../types';

const Header: React.FC = () => {
    const {
        userProfile,
        isUserMenuOpen,
        toggleUserMenu,
        toggleSidebar,
        cart,
        toggleCartPanel
    } = useStore();
    
    const menuRef = useRef<HTMLDivElement>(null);

    const cartItemCount = cart.reduce((count: number, item: CartItem) => count + item.quantity, 0);

    const handleLogout = async () => {
        toggleUserMenu(false);
        await supabase.auth.signOut();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                toggleUserMenu(false);
            }
        };
        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen, toggleUserMenu]);

    const userMenuLinkClass = "flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md";

    return (
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Botón de menú para móvil (lado izquierdo) */}
                    <div className="md:hidden">
                        <button onClick={toggleSidebar} className="text-gray-600 p-2 -ml-2">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Espaciador para empujar los iconos a la derecha */}
                    <div className="flex-1"></div>

                    {/* Iconos del lado derecho */}
                    <div className="flex items-center gap-4">
                        {/* Botón del Carrito */}
                        <button 
                            onClick={() => toggleCartPanel(true)}
                            className="relative text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* Menú de Usuario (lado derecho) */}
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => toggleUserMenu()} className="flex items-center gap-2 p-2 rounded-full text-left hover:bg-gray-100 transition-colors">
                                <img 
                                    src={userProfile?.avatar_url || '../assets/default-avatar.svg'} 
                                    alt="Avatar" 
                                    className="w-9 h-9 rounded-full object-cover bg-gray-200"
                                />
                                <div className="hidden md:flex md:items-center">
                                    <span className="font-semibold text-sm text-gray-800 truncate max-w-[150px]">{userProfile?.full_name || 'Usuario'}</span>
                                    <ChevronUp className={`ml-1 w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-0' : 'rotate-180'}`} />
                                </div>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
                                    <div className="px-4 py-2 border-b mb-2">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{userProfile?.full_name || 'Usuario'}</p>
                                        <p className="text-xs text-gray-500 truncate">{userProfile?.email || ''}</p>
                                    </div>
                                    <NavLink to="/app/profile/me" className={userMenuLinkClass} onClick={() => toggleUserMenu(false)}>
                                        <UserCircle className="w-5 h-5" />
                                        <span>Mi Perfil</span>
                                    </NavLink>
                                    <button onClick={handleLogout} className={`${userMenuLinkClass} w-full`}>
                                        <LogOut className="w-5 h-5" />
                                        <span>Salir</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;