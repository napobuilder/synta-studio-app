# Guía y Plantilla de Autenticación Robusta

Este documento describe la arquitectura y el flujo de autenticación implementados en esta aplicación. Sirve como una guía de mejores prácticas para futuros proyectos que usen React, React Router, Supabase y Zustand.

## 1. Filosofía Principal: Flujo de Datos Unidireccional y Basado en Estado

La regla de oro de esta arquitectura es: **La UI es siempre un reflejo del estado de la sesión, nunca al revés.**

- **NO** navegamos manualmente después de un login o logout. (`navigate('/app')`)
- **SÍ** cambiamos el estado de la sesión (`session: null`).
- La UI **reacciona** a ese cambio de estado y muestra la página correcta (el Dashboard o el Login).

Esto evita "race conditions" (condiciones de carrera) y asegura que la aplicación siempre sepa con certeza si el usuario está autenticado o no.

## 2. Arquitectura de Componentes

La lógica está separada en cuatro componentes clave con responsabilidades únicas:

### a. `SessionHandler.tsx` (El Oyente Global)
- **Ubicación:** Es el componente raíz de TODA la aplicación en `main.tsx`.
- **Responsabilidad:** Su único trabajo es ejecutar un `useEffect` que se suscribe a `supabase.auth.onAuthStateChange`. Escucha cualquier cambio (login, logout, sesión inicial desde localStorage) y actualiza el store de Zustand. No renderiza nada visible, solo `<Outlet />` para sus hijos.

### b. `useStore.ts` (La Única Fuente de Verdad)
- **Responsabilidad:** Contiene el estado global de la aplicación. Para la autenticación, las piezas clave son:
  - `session: Session | null;`: Almacena el objeto de sesión del usuario.
  - `isAuthLoading: boolean;`: Un booleano que es `true` solo mientras `SessionHandler` está verificando la sesión inicial. Es crucial para prevenir parpadeos o redirecciones prematuras.

### c. `AuthGuard.tsx` (El Guardián de Rutas)
- **Ubicación:** Envuelve todas las rutas protegidas en `main.tsx`.
- **Responsabilidad:**
  1. Lee `session` y `isAuthLoading` del store.
  2. Si `isAuthLoading` es `true`, devuelve `null` (o un spinner) para esperar a que termine la verificación.
  3. Si `isAuthLoading` es `false` y **no hay** `session`, redirige a `/login`.
  4. Si `isAuthLoading` es `false` y **sí hay** `session`, renderiza `<Outlet />` para dar acceso a la ruta protegida.

### d. `LoginPage.tsx` / Botón de Logout (Los Disparadores de Eventos)
- **Responsabilidad:** Son los únicos lugares que interactúan con las funciones de `supabase.auth`. 
- `LoginPage`: Llama a `supabase.auth.signInWithPassword()` y no hace nada más. No navega. No actualiza el estado. Solo dispara el evento.
- `Botón de Logout`: Llama a `supabase.auth.signOut()` y no hace nada más.

## 3. Flujo de Datos Detallado

**Flujo de Login:**
1.  Usuario rellena el formulario en `LoginPage`.
2.  `onClick` llama a `supabase.auth.signInWithPassword()`.
3.  Supabase se autentica y guarda la sesión en `localStorage`.
4.  El evento `SIGNED_IN` se dispara.
5.  `SessionHandler` (que siempre está escuchando) lo captura.
6.  `SessionHandler` llama a `setSession(newSession)` y `setAuthLoading(false)` en el store.
7.  `AuthGuard` reacciona al cambio en el store, ve que hay una sesión y renderiza la ruta protegida.

**Flujo de Carga de Página (con sesión persistente):**
1.  Usuario entra a `/app`.
2.  `SessionHandler` se monta. `isAuthLoading` es `true`.
3.  `AuthGuard` se monta, ve que `isAuthLoading` es `true` y devuelve `null` (pantalla en blanco).
4.  Supabase lee la sesión de `localStorage`.
5.  El evento `INITIAL_SESSION` se dispara.
6.  `SessionHandler` captura el evento y actualiza el store con la sesión.
7.  `AuthGuard` reacciona al cambio, ve que hay sesión y renderiza la ruta protegida.

## 4. Guía de Implementación Rápida (Para un Proyecto Nuevo)

1.  **Configura Supabase:** Crea tu `supabaseClient.ts`.
2.  **Configura Zustand:** Crea tu `useStore.ts` con `session` y `isAuthLoading`.
3.  **Crea `SessionHandler.tsx`:** Copia y pega el componente. Será el mismo.
4.  **Crea `AuthGuard.tsx`:** Copia y pega el componente. Será el mismo.
5.  **Estructura `main.tsx`:**
    ```tsx
    const router = createBrowserRouter([
      {
        element: <SessionHandler />,
        children: [
          // Rutas públicas
          { path: '/', element: <LandingPage /> },
          { path: '/login', element: <LoginPage /> },

          // Rutas protegidas
          {
            element: <AuthGuard />,
            children: [
              { path: '/app', element: <AppLayout /> },
              // ... otras rutas protegidas
            ]
          }
        ]
      }
    ]);
    ```
6.  **Implementa el Login/Logout:** Asegúrate de que los componentes de Login y Logout solo llamen a las funciones de `supabase.auth` y no contengan ninguna otra lógica.
