export interface Prompt {
  id: number;
  category: string;
  title: string;
  description: string;
  tags: string[];
  prompt_text: string;
}

export interface Product {
  id: string;
  type: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  tags: string[];
  purchaseUrl: string;
}

export interface CommunityUser {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  level: number | null;
  points: number | null;
  title: string | null;
  email: string | null;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  title: string | null;
  email: string | null;
  level: number | null;
  points: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  userId: string;
  content: string;
  created_at: string;
  author: UserProfile;
}

export interface CommunityPost {
  id: number;
  user_id: string;
  userId: string;
  channel: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  created_at: string;
  author: UserProfile;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'status';
  content: string;
};

export interface Like {
    id: number;
    post_id: number;
    user_id: string;
}

// Tipos para el carrito de compras
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}