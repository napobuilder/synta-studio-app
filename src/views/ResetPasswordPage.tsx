import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's an active session from the URL (e.g., after clicking reset link)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                // User is logged in via the reset link, can now update password
                setMessage('Listo para establecer tu nueva contraseña.');
            } else {
                setMessage('Por favor, usa el enlace de tu correo electrónico para restablecer la contraseña.');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setMessage(`Error al restablecer la contraseña: ${error.message}`);
        } else {
            setMessage('¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-12 h-12" style={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)', mask: 'url(https://i.imgur.com/vgnuj55.png) no-repeat center / contain', WebkitMask: 'url(https://i.imgur.com/vgnuj55.png) no-repeat center / contain' }} />
                    <span className="font-bold text-3xl text-gray-800">Synta Studio</span>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Establecer Nueva Contraseña</h1>
                    {message && <p className="text-gray-500 mb-4">{message}</p>}
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border border-gray-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                            {loading ? 'Guardando...' : 'Restablecer Contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
