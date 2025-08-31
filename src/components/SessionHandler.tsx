import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Este componente es el nuevo corazón de la autenticación.
 * Se sienta en la raíz de la aplicación y su única responsabilidad es
 * escuchar los cambios de estado de la sesión de Supabase y mantener
 * nuestro store de Zustand actualizado.
 */
const SessionHandler: React.FC = () => {
  const { setSession, fetchUserProfile, setAuthLoading } = useStore();

  useEffect(() => {
    console.log('[DEBUG] SessionHandler.tsx useEffect RUNS');
    setAuthLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log(`[DEBUG] onAuthStateChange FIRED! Event: ${event}`, session);
      
      setSession(session);

      if (session?.user) {
        console.log('[DEBUG] Session exists, fetching profile...');
        fetchUserProfile(session.user.id);
      }
      
      console.log('[DEBUG] Setting auth loading to FALSE');
      setAuthLoading(false);
    });

    return () => {
      console.log('[DEBUG] Unsubscribing from auth state change.');
      subscription.unsubscribe();
    };
  }, [setSession, fetchUserProfile, setAuthLoading]);

  // Simplemente renderiza las rutas hijas que React Router le provea.
  return <Outlet />;
};

export default SessionHandler;