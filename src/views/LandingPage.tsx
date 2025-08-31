import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const LandingPage: React.FC = () => {
    const { session, isAuthLoading } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthLoading) return;
        if (session) {
            navigate('/app', { replace: true });
        }
    }, [session, isAuthLoading, navigate]);

    const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/login');
    };

    if (isAuthLoading || session) {
        return null;
    }

    return (
        <main>
            <section className="hero">
                <div className="container mx-auto px-6 max-w-3xl text-center pt-40 pb-20 min-h-[80vh] flex flex-col justify-center items-center">
                    <p className="hero-subtitle text-lg font-semibold text-gray-600 mb-2">Para Coaches, Consultores y Marcas Personales.</p>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 text-transparent bg-clip-text mb-4">Tienes el Conocimiento. <br />Nosotros Construimos el Sistema que lo Vende.</h1>
                    <p className="text-lg text-gray-700 mb-8 max-w-prose mx-auto">
                        Deja de vender tu tiempo y empieza a escalar tu impacto. Synta Lab es la comunidad gratuita donde aprendes a construir el ecosistema de ventas que tu experiencia merece.
                    </p>
                    <a href="#" onClick={handleCtaClick} className="cta-button relative overflow-hidden inline-block text-xl font-semibold text-white py-4 px-8 rounded-full border-none cursor-pointer bg-gradient-to-r from-purple-700 to-blue-600 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 z-10">Acceder a Synta Lab (Gratis)</a>
                    <p className="supporting-text text-sm text-gray-500 mt-4">Únete a nuestra comunidad y obtén acceso instantáneo a un arsenal de prompts y estrategias de conversión.</p>
                </div>
            </section>

            <section className="social-proof-section py-10 bg-white border-t border-b border-gray-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h4 className="social-proof-title text-sm font-semibold text-gray-600 uppercase tracking-wider mb-8">Confían en nuestra metodología marcas que facturan miles</h4>
                    <div className="logo-marquee w-full overflow-hidden relative">
                        <div className="logo-track flex w-fit animate-marquee will-change-transform">
                            <div className="logo-item flex-shrink-0 w-48 md:w-64 mx-10 flex items-center justify-center"><img src="https://alohaacademy.app/aloha-logo.png" alt="Logo de Aloha Academy" className="max-w-[150px] max-h-10 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100" /></div>
                            <div className="logo-item flex-shrink-0 w-48 md:w-64 mx-10 flex items-center justify-center"><img src="https://voiceacademy-temporal.netlify.app/voice-academy-logo.png" alt="Logo de Voice Academy" className="max-w-[150px] max-h-10 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100" /></div>
                            <div className="logo-item flex-shrink-0 w-48 md:w-64 mx-10 flex items-center justify-center"><span className="logo-item-text text-2xl font-bold text-gray-700 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100">Carlos Loggiodice</span></div>
                            <div className="logo-item flex-shrink-0 w-48 md:w-64 mx-10 flex items-center justify-center"><img src="https://alohaacademy.app/aloha-logo.png" alt="Logo de Aloha Academy" className="max-w-[150px] max-h-10 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100" /></div>
                            <div className="logo-item flex-shrink-0 w-48 md:w-64 mx-10 flex items-center justify-center"><img src="https://voiceacademy-temporal.netlify.app/voice-academy-logo.png" alt="Logo de Voice Academy" className="max-w-[150px] max-h-10 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100" /></div>
                            <div className="logo-item flex-shrink-0 w-48 md:w-64 mx-10 flex items-center justify-center"><span className="logo-item-text text-2xl font-bold text-gray-700 grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100">Carlos Loggiodice</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="problem-section py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Si eres un experto, probablemente odias "vender".</h2>
                    <p className="text-lg text-gray-700 mb-8 max-w-prose mx-auto">
                        Tu genialidad está en lo que haces, no en perseguir clientes. Pero la realidad es que sin un sistema predecible para atraer y convertir, tu negocio depende de la suerte, las referencias y un esfuerzo agotador en redes sociales.
                    </p>
                    <div className="problem-card bg-white p-8 rounded-xl border border-gray-200 mt-8">
                        <h3 className="text-2xl font-bold text-purple-700 mb-4">El verdadero problema no es tu oferta, es tu arquitectura.</h3>
                        <p className="text-base text-gray-700 max-w-full mx-auto">Una web bonita no es un sistema. Un perfil de Instagram no es un embudo. Estás operando con piezas sueltas en lugar de tener una máquina de conversión diseñada con un único propósito: transformar extraños interesados en clientes de alto valor.</p>
                    </div>
                </div>
            </section>

            <section className="solution-section py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-6 max-w-6xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Un Vistazo al Interior de Synta Studio</h2>
                    <p className="text-lg text-gray-700 mb-12 max-w-prose mx-auto">
                        Al unirte a Synta Lab, no solo entras a una comunidad, accedes al centro de operaciones completo. Esto es lo que te espera dentro:
                    </p>
                    <div className="lab-features grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
                        <div className="feature-item bg-white p-6 rounded-xl border border-gray-200 transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg">
                            <div className="icon text-purple-700 text-3xl mb-4 h-8 flex items-center"><i className="fa-solid fa-flask"></i></div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">El Laboratorio de Prompts</h4>
                            <p className="text-base text-gray-700 m-0 max-w-full">Accede a nuestro arsenal de prompts gratuitos para refinar tu estrategia y acelerar tu creación de contenido.</p>
                        </div>
                        <div className="feature-item bg-white p-6 rounded-xl border border-gray-200 transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg">
                            <div className="icon text-purple-700 text-3xl mb-4 h-8 flex items-center"><i className="fa-solid fa-shopping-cart"></i></div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">El Arsenal</h4>
                            <p className="text-base text-gray-700 m-0 max-w-full">¿Necesitas más poder? Adquiere Agentes de IA y servicios estratégicos para obtener resultados más rápidos.</p>
                        </div>
                        <div className="feature-item bg-white p-6 rounded-xl border border-gray-200 transition-transform duration-300 hover:translate-y-[-5px] hover:shadow-lg">
                            <div className="icon text-purple-700 text-3xl mb-4 h-8 flex items-center"><i className="fa-solid fa-users"></i></div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">La Comunidad</h4>
                            <p className="text-base text-gray-700 m-0 max-w-full">Conecta con otros expertos, comparte tus victorias y resuelve dudas en un entorno de colaboración.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="manifesto-section py-20">
                <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16 items-center text-left">
                    <img src="https://i.imgur.com/c4nlsC2.png" alt="Napoleon Baca, fundador de Synta Studio" className="manifesto-photo w-full max-w-[220px] rounded-full shadow-lg justify-self-center" />
                    <div className="manifesto-content">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-left">Del estudio de grabación al estudio de marketing.</h2>
                        <p className="text-lg text-gray-700 mb-4">Mi carrera ha sido una obsesión dual: producir música que ha llegado a millones y, en silencio, construir sistemas de marketing digital con mi esposa. Eran dos mundos paralelos hasta que encontré la conexión: **la disciplina de un productor musical es idéntica a la de la de un arquitecto de sistemas.**</p>
                        <p className="text-lg text-gray-700 mb-4">La IA se convirtió en mi "consola de mezcla", la herramienta que me permitió aplicar la misma estructura, armonía y atención al detalle de una canción a la construcción de un embudo de ventas. Entendí que mi trabajo nunca fue solo sobre música o código. Siempre se ha tratado de construir lo mismo: <strong>ecosistemas narrativos</strong>.</p>
                        <p className="text-lg text-gray-700">Synta Studio es eso. El lugar donde uso mi disciplina de productor para crear sistemas digitales que cuentan una historia coherente, armónica y, lo más importante, que convierten. Te invito a mi laboratorio para que empieces a construir el tuyo.</p>
                    </div>
                </div>
            </section>

            <section className="final-cta-section py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Tu Próximo Cliente está a un Sistema de Distancia.</h2>
                    <p className="text-lg text-gray-400 mb-8 max-w-prose mx-auto">
                        El primer paso no es una gran inversión, es una decisión. La decisión de dejar de improvisar y empezar a construir. Únete a Synta Lab y da ese primer paso hoy.
                    </p>
                    <a href="#" onClick={handleCtaClick} className="cta-button relative overflow-hidden inline-block text-xl font-semibold text-white py-4 px-8 rounded-full border-none cursor-pointer bg-gradient-to-r from-purple-700 to-blue-600 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 z-10">Quiero mi Acceso Gratuito a Synta Lab</a>
                </div>
            </section>
        </main>
    );
};

export default LandingPage;