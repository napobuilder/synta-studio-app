import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password', // This will be our new reset password page
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('¡Enlace de recuperación enviado! Revisa tu correo electrónico.');
            setEmail(''); // Clear email field
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
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Contraseña</h1>
                    <p className="text-gray-500 mb-8">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                            {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                        </button>
                    </form>
                    {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
                    <p className="text-sm text-gray-500 mt-6">
                        <Link to="/login" className="font-semibold text-purple-600 hover:underline">
                            Volver al inicio de sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
