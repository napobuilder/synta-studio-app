import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import type { Prompt, CommunityPost, CommunityUser, UserProfile, Message, Product, CartItem, Comment, Like } from '../types';

export interface AppState {
  // Auth
  session: Session | null;
  isAuthLoading: boolean;
  setSession: (session: Session | null) => void;
  setAuthLoading: (isLoading: boolean) => void;
  userProfile: UserProfile | null;
  fetchUserProfile: (userId: string) => Promise<void>;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (userId: string, file: File) => Promise<string | null>;

  // UI
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isUserMenuOpen: boolean;
  toggleUserMenu: (isOpen?: boolean) => void;
  isCartPanelOpen: boolean;
  toggleCartPanel: (isOpen?: boolean) => void;

  // Community
  communityUsers: CommunityUser[];
  communityPosts: CommunityPost[];
  fetchCommunityData: () => Promise<void>;
  addPost: (post: { title: string; content: string; userId: string; }) => Promise<void>;
  updatePost: (postId: number, updates: { title: string; content: string; }) => Promise<void>;
  toggleLikePost: (postId: number, userId: string) => Promise<void>;
  addComment: (postId: number, comment: { content: string; userId: string; }) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;

  // SyntaLab
  prompts: Prompt[];
  fetchPrompts: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;

  // Prompt Modal
  selectedPrompt: Prompt | null;
  isModalOpen: boolean;
  openModal: (prompt: Prompt) => void;
  closeModal: () => void;

  // AI Chat Panel
  isChatPanelOpen: boolean;
  chatMessages: Message[];
  activeSystemPrompt: string | null;
  activePromptTitle: string | null;
  toggleChatPanel: (isOpen?: boolean) => void;
  addChatMessage: (message: Message) => void;
  startNewChatWithPrompt: (prompt: { title: string; text: string }) => void;

  // Shopping Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const stateCreator: StateCreator<AppState> = (set, get) => ({
  // Auth
  session: null,
  isAuthLoading: true,
  setSession: (session) => set({ session }),
  setAuthLoading: (isLoading) => set({ isAuthLoading: isLoading }),
  userProfile: null,
  fetchUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      set({ userProfile: null });
    } else {
      set({ userProfile: data });
    }
  },
  updateUserProfile: async (userId, updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating user profile:', error);
    } else {
      get().fetchUserProfile(userId);
      get().fetchCommunityData();
    }
  },
  uploadAvatar: async (userId, file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
    return publicUrl;
  },

  // UI
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isUserMenuOpen: false,
  toggleUserMenu: (isOpen) => set(state => ({ 
    isUserMenuOpen: typeof isOpen === 'boolean' ? isOpen : !state.isUserMenuOpen 
  })),
  isCartPanelOpen: false,
  toggleCartPanel: (isOpen) => set(state => ({ 
    isCartPanelOpen: typeof isOpen === 'boolean' ? isOpen : !state.isCartPanelOpen 
  })),

  // Community
  communityUsers: [],
  communityPosts: [],
  fetchCommunityData: async () => {
    const [postsResponse, usersResponse, commentsResponse, likesResponse] = await Promise.all([
      supabase.from('posts').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('comments').select('*'),
      supabase.from('likes').select('*')
    ]);

    if (postsResponse.error) console.error('Error fetching posts:', postsResponse.error);
    if (usersResponse.error) console.error('Error fetching users:', usersResponse.error);
    if (commentsResponse.error) console.error('Error fetching comments:', commentsResponse.error);
    if (likesResponse.error) console.error('Error fetching likes:', likesResponse.error);

    const usersMap = new Map((usersResponse.data || []).map((user: CommunityUser) => [user.id, user]));
    const defaultAuthor: CommunityUser = { id: 'unknown', full_name: 'Usuario Desconocido', avatar_url: '/assets/default-avatar.svg', username: 'desconocido', level: 0, points: 0, title: null, email: null };

    const posts = (postsResponse.data || []).map((post: CommunityPost) => {
      const author = usersMap.get(post.user_id) || defaultAuthor;
      
      const comments = (commentsResponse.data || [])
        .filter((comment: Comment) => comment.post_id === post.id)
        .map((comment: Comment) => ({
          ...comment,
          author: usersMap.get(comment.user_id) || defaultAuthor
        }));

      const likes = (likesResponse.data || []).filter((like: Like) => like.post_id === post.id);

      return {
        ...post,
        userId: post.userId,
        author,
        comments,
        likes: likes.length,
        likedBy: likes.map((like: Like) => like.user_id),
      };
    });

    set({ 
      communityPosts: posts as CommunityPost[],
      communityUsers: (usersResponse.data || []) as CommunityUser[],
    });
  },
  addPost: async (post) => {
    const { title, content, userId } = post;
    const { error } = await supabase.from('posts').insert({ title, content, user_id: userId });
    if (error) console.error('Error adding post:', error);
    else get().fetchCommunityData();
  },
  updatePost: async (postId, updates) => {
    const { error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId);

    if (error) {
      console.error('Error updating post:', error);
    } else {
      get().fetchCommunityData();
    }
  },
  toggleLikePost: async (postId, userId) => {
    const { data } = await supabase.from('likes').select('*').eq('post_id', postId).eq('user_id', userId);
    if (data && data.length > 0) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: userId });
    }
    get().fetchCommunityData();
  },
  addComment: async (postId, comment) => {
    const { error } = await supabase.from('comments').insert({ content: comment.content, user_id: comment.userId, post_id: postId });
    if (error) console.error('Error adding comment:', error);
    else get().fetchCommunityData();
  },
  deletePost: async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) console.error('Error deleting post:', error);
    else get().fetchCommunityData();
  },
  deleteComment: async (commentId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) console.error('Error deleting comment:', error);
    else get().fetchCommunityData();
  },

  // SyntaLab
  prompts: [],
  fetchPrompts: async () => {
    const { data, error } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching prompts:', error);
    } else {
      set({ prompts: data || [] });
    }
  },
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  activeCategory: 'Todos',
  setActiveCategory: (category) => set({ activeCategory: category }),

  // Prompt Modal
  selectedPrompt: null,
  isModalOpen: false,
  openModal: (prompt) => set({ isModalOpen: true, selectedPrompt: prompt }),
  closeModal: () => set({ isModalOpen: false, selectedPrompt: null }),

  // AI Chat Panel
  isChatPanelOpen: false,
  chatMessages: [],
  activeSystemPrompt: null,
  activePromptTitle: null,
  toggleChatPanel: (isOpen) => set(state => ({ 
    isChatPanelOpen: typeof isOpen === 'boolean' ? isOpen : !state.isChatPanelOpen,
    activePromptTitle: (typeof isOpen === 'boolean' && !isOpen) ? null : state.activePromptTitle
  })),
  addChatMessage: (message) => set(state => ({ 
    chatMessages: [...state.chatMessages, message] 
  })),
  startNewChatWithPrompt: (prompt) => set({
    activeSystemPrompt: prompt.text,
    activePromptTitle: prompt.title,
    chatMessages: [
      {
        role: 'status',
        content: `¡Prompt "${prompt.title}" cargado! El agente ahora está listo. Envíale tu primer mensaje.`
      }
    ],
    isChatPanelOpen: true,
  }),

  // Shopping Cart
  cart: [],
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.product.id === product.id);
    if (existingItem) {
      const updatedCart = state.cart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      return { cart: updatedCart };
    } else {
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.product.id !== productId)
  })),
  clearCart: () => set({ cart: [] }),
});

export const useStore = create(stateCreator);