import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Home, FlaskConical, Users, GraduationCap, Building, ShoppingCart } from 'lucide-react';

export const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useStore();

    const navItems = [
        { to: '/app', icon: Home, label: 'Inicio' },
        { to: '/app/synta-lab', icon: FlaskConical, label: 'Synta Lab' },
        { to: '/app/arsenal', icon: ShoppingCart, label: 'El Arsenal' },
        { to: '/app/comunidad', icon: Users, label: 'Comunidad' },
        { to: '/app/aloha-academy', icon: GraduationCap, label: 'Cursos (Aloha Academy)' },
    ];
    const serviceItem = { to: '/app/build-ecosystem', icon: Building, label: 'Construir mi Ecosistema' };

    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
            isActive ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
        }`;

    return (
        <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col`}>
            <div className="flex items-center justify-center h-20 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8" style={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)', mask: 'url(https://i.imgur.com/vgnuj55.png) no-repeat center / contain', WebkitMask: 'url(https://i.imgur.com/vgnuj55.png) no-repeat center / contain' }} />
                    <span className="font-bold text-xl text-gray-800">Synta Studio</span>
                </div>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} end className={navLinkClass} onClick={handleNavClick}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <NavLink to={serviceItem.to} className={navLinkClass} onClick={handleNavClick}>
                    <serviceItem.icon className="w-5 h-5" />
                    <span className="font-medium">{serviceItem.label}</span>
                </NavLink>
            </div>
        </aside>
    );
};