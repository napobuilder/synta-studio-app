# Roadmap: Implementación de Canales en la Comunidad

Este documento contiene la lógica y el código extraídos de la implementación inicial de la `ComunidadView` para ser reutilizados cuando la base de datos esté lista para soportar la funcionalidad de "Canales".

## Plan de Implementación Futuro

1.  **Base de Datos:**
    *   Añadir una columna `channel` (de tipo `text` o `varchar`) a la tabla `posts`.
    *   Considerar crear una tabla `channels` para gestionarlos de forma centralizada si se vuelven más complejos.

2.  **Backend (Store de Zustand):**
    *   Modificar `addPost` para que acepte y guarde el `channel` al crear una nueva publicación.
    *   Asegurarse de que `fetchCommunityData` obtiene el `channel` con cada post.

3.  **Frontend (Componentes de React):**
    *   Re-integrar la lógica de UI que se encuentra a continuación en `ComunidadView.tsx`.
    *   Asegurarse de que `CreatePostForm.tsx` pase el `activeChannel` a la función `addPost`.

## Código de Referencia

### Lógica de Estado y UI en `ComunidadView.tsx`

Este es el código que gestiona el estado del canal activo y renderiza la lista de canales y las publicaciones filtradas.

```tsx
// 1. Definición de estado y lista de canales
const [activeChannel, setActiveChannel] = useState('#wins');
const channels = ['#wins', '#feedback-loop', '#ask-the-studio', '#general'];

// 2. Lógica para filtrar los posts en el render
{communityPosts.filter(p => p.channel === activeChannel).length > 0 ? (
    communityPosts.filter(p => p.channel === activeChannel).map(post => (
        <PostCard key={post.id} post={post} />
    ))
) : (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center text-gray-500">
        <p className="text-lg font-semibold mb-2">No hay publicaciones en este canal aún.</p>
        <p>Sé el primero en compartir algo en #{activeChannel.substring(1)}.</p>
    </div>
)}

// 3. Componente de UI para la lista de canales (Sidebar)
<div className="lg:col-span-1 space-y-8">
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="font-bold text-xl text-gray-800 mb-4">Canales</h3>
        <ul className="space-y-2">
            {channels.map(channel => (
                <li key={channel}>
                    <button 
                        onClick={() => setActiveChannel(channel)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-in-out flex items-center group
                            ${activeChannel === channel 
                                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md' 
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <span className={`mr-2 ${activeChannel === channel ? 'text-white' : 'text-purple-500 group-hover:text-purple-600'}`}>#</span>
                        {channel.substring(1)}
                    </button>
                </li>
            ))}
        </ul>
    </div>
    <Leaderboard />
</div>

// 4. Pasar el canal activo al formulario de creación
<CreatePostForm activeChannel={activeChannel} />
```

### Lógica en `CreatePostForm.tsx`

El formulario debe aceptar la prop `activeChannel`.

```tsx
interface CreatePostFormProps {
    activeChannel: string;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ activeChannel }) => {
    // ... resto del componente
}
```
