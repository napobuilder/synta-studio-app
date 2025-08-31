
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const RegisterPage: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: '¡Registro exitoso! Revisa tu bandeja de entrada para verificar tu correo electrónico.' });
            // No redirigir inmediatamente para que el usuario pueda ver el mensaje.
            // setTimeout(() => navigate('/login'), 5000); 
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
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Crea tu Cuenta</h1>
                    <p className="text-gray-500 mb-6">Únete a la comunidad gratuita para Coaches y Marcas Personales.</p>
                    
                    {message && (
                        <div className={`p-4 mb-4 rounded-lg text-center ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre Completo"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full border border-gray-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            type="email"
                            placeholder="Tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                            type="password"
                            placeholder="Crea una contraseña (mín. 6 caracteres)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full border border-gray-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
                        </button>
                    </form>
                    <p className="text-sm text-gray-500 mt-6">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-semibold text-purple-600 hover:underline">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
