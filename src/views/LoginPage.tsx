import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore'; // Importar el store

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Añadido para manejar errores
    const navigate = useNavigate();
    const setSession = useStore((state) => state.setSession); // Obtener la acción para actualizar la sesión

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message); // Cambiado de alert a setError
        } else if (data.session) {
            setSession(data.session);
            navigate('/'); // Cambiado de /app a /
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin, // Corregido: Redirigir al origen
            },
        });

        if (error) {
            setError(error.message); // Cambiado de alert a setError
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-12 h-12" style={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)', mask: 'url(https://i.imgur.com/vgnuj55.png) no-repeat center / contain', WebkitMask: 'url(https://i.imgur.com/vgnuj55.png) no-repeat center / contain' }} />
                    <span className="font-bold text-3xl text-gray-800">Synta Studio</span>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Accede a Synta Lab</h1>
                    <p className="text-gray-500 mb-8">Únete a la comunidad gratuita para Coaches y Marcas Personales.</p>
                    
                    {error && <p className="text-red-500 mb-4">{error}</p>} {/* Visualizador de errores */}

                    <div className="space-y-4">
                        <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
                            Continuar con Google
                        </button>
                        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">o</span></div></div>
                        <form onSubmit={handleLogin} className="space-y-4">
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
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>
                    </div>
                    <p className="text-sm text-gray-500 mt-6">
                        <Link to="/forgot-password" className="font-semibold text-purple-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                        {' '}
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="font-semibold text-purple-600 hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;