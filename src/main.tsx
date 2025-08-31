import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Componente Raíz para manejar la sesión
import SessionHandler from './components/SessionHandler.tsx';

// Vistas Públicas
import LandingPage from './views/LandingPage.tsx';
import LoginPage from './views/LoginPage.tsx';
import RegisterPage from './views/RegisterPage.tsx';
import DataMigration from './views/DataMigration.tsx';
import ForgotPasswordPage from './views/ForgotPasswordPage.tsx';
import ResetPasswordPage from './views/ResetPasswordPage.tsx';
import { WebsiteSalesView } from './views/WebsiteSalesView.tsx';

// Vistas Privadas (Dashboard)
import { InicioView } from './views/InicioView.tsx';
import { SyntaLabView } from './views/SyntaLabView.tsx';
import { ArsenalView } from './views/ArsenalView.tsx';

import { ComunidadView } from './views/ComunidadView.tsx';
import { AlohaAcademyView } from './views/AlohaAcademyView.tsx';
import { BuildEcosystemView } from './views/BuildEcosystemView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { MyProfileView } from './views/MyProfileView.tsx';

// Guardia de Autenticación
import AuthGuard from './components/AuthGuard.tsx';

const router = createBrowserRouter([
  {
    element: <SessionHandler />,
    children: [
      // Rutas públicas
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/data-migration',
        element: <DataMigration />,
      },
      {
        path: '/vender-website',
        element: <WebsiteSalesView />,
      },
      // Rutas de la aplicación protegida
      {
        path: '/app',
        element: <App />,
        children: [
          {
            element: <AuthGuard />,
            children: [
              { index: true, element: <InicioView /> },
              { path: 'synta-lab', element: <SyntaLabView /> },
              { path: 'arsenal', element: <ArsenalView /> },
              { path: 'arsenal/:productId', element: <WebsiteSalesView /> },
              { path: 'comunidad', element: <ComunidadView /> },
              { path: 'aloha-academy', element: <AlohaAcademyView /> },
              { path: 'build-ecosystem', element: <BuildEcosystemView /> },
              { path: 'profile/me', element: <MyProfileView /> },
              { path: 'profile/:userId', element: <ProfileView /> },
            ],
          },
        ],
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);