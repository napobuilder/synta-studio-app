import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { PromptModal } from './components/PromptModal';
import Header from './components/Header';
import ChatPanel from './components/ChatPanel';
import { CartPanel } from './components/CartPanel';

export default function App() {
    const { isSidebarOpen, toggleSidebar } = useStore();

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleSidebar}></div>}

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 ease-in-out">
                <Header />
                
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet /> 
                </main>
            </div>

            <ChatPanel />

            <CartPanel />

            <PromptModal />
        </div>
    );
}