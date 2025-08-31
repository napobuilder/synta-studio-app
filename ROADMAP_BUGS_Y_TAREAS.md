# Roadmap de Bugs y Tareas Pendientes

Esta es una lista de las tareas y errores que debemos abordar en las próximas sesiones.

### 1. Arreglar Visibilidad de Perfiles (Políticas RLS) - **ALTA PRIORIDAD**
- **Problema:** Los usuarios no pueden ver los datos públicos de otros usuarios (nombre y avatar). Esto causa que se muestre "Usuario desconocido" y que el avatar por defecto no sea visible en los posts de otros, aunque sí se vea en la propia página de perfil.
- **Causa Raíz:** Las políticas de seguridad a nivel de fila (RLS) en la tabla `profiles` de Supabase son muy restrictivas y no permiten el acceso de lectura pública entre usuarios.
- **Solución:** Crear una política RLS que permita a cualquier usuario logueado (`authenticated`) leer los datos de la tabla `profiles`. Esto debería solucionar los tres síntomas (nombre, avatar y visibilidad) a la vez.

### 2. Finalizar Configuración de Google Sign-In
- **Problema:** La autenticación con Google no funciona porque falta la configuración en el dashboard de Supabase.
- **Solución:** El usuario debe añadir las credenciales (Client ID y Client Secret) de Google en la sección de Auth Providers en su proyecto de Supabase.
