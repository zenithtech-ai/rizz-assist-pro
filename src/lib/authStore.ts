import { create } from 'zustand';
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  plan: 'free' | 'silver' | 'gold';
  monthly_tokens: number;
  tokens_remaining: number;
  total_uses: number;
  is_active: boolean;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        // Fetch user data from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (userData) {
          set({ user: userData as User, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      set({ user: null, loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (data.user) {
        // Create user record in users table
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            plan: 'free',
            monthly_tokens: 3,
            tokens_remaining: 3,
            total_uses: 0,
            is_active: true,
          })
          .select()
          .single();

        if (newUser) {
          set({ user: newUser as User, loading: false });
        }
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userData) {
          set({ user: userData as User, loading: false });
        }
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({ user: null, loading: false });
    } catch (error) {
      console.error('Sign out failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  setUser: (user: User | null) => set({ user }),
}));
