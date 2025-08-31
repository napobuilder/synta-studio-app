import React from 'react';
import { useStore } from '../store/useStore';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard: React.FC = () => {
  const { session, isAuthLoading } = useStore();
  console.log('[DEBUG] AuthGuard rendering', { 
    isAuthLoading, 
    hasSession: !!session 
  });

  if (isAuthLoading) {
    console.log('[DEBUG] AuthGuard: Auth is loading, returning null.');
    return null;
  }

  if (!session) {
    console.log('[DEBUG] AuthGuard: No session, redirecting to /login.');
    return <Navigate to="/login" replace />;
  }

  console.log('[DEBUG] AuthGuard: Session found, rendering Outlet.');
  return <Outlet />;
};

export default AuthGuard;
