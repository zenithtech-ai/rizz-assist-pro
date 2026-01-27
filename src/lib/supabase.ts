import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          plan: 'free' | 'silver' | 'gold';
          monthly_tokens: number;
          tokens_remaining: number;
          total_uses: number;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          last_active_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          plan?: 'free' | 'silver' | 'gold';
          monthly_tokens?: number;
          tokens_remaining?: number;
          total_uses?: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          last_active_at?: string | null;
        };
        Update: {
          plan?: 'free' | 'silver' | 'gold';
          monthly_tokens?: number;
          tokens_remaining?: number;
          total_uses?: number;
          updated_at?: string;
          is_active?: boolean;
          last_active_at?: string | null;
        };
      };
      api_logs: {
        Row: {
          id: string;
          user_id: string;
          feature_type: 'reply_generation' | 'profile_analysis' | 'opener_generation' | 'profile_optimization' | 'screenshot_reply';
          tokens_consumed: number;
          estimated_cost: number;
          input_tokens: number | null;
          output_tokens: number | null;
          model: string;
          success: boolean;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          feature_type: 'reply_generation' | 'profile_analysis' | 'opener_generation' | 'profile_optimization' | 'screenshot_reply';
          tokens_consumed: number;
          estimated_cost: number;
          input_tokens?: number | null;
          output_tokens?: number | null;
          model?: string;
          success?: boolean;
          error_message?: string | null;
          created_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          transaction_type: 'purchase' | 'admin_gift' | 'refund' | 'reset';
          amount: number;
          description: string | null;
          created_by_admin_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          transaction_type: 'purchase' | 'admin_gift' | 'refund' | 'reset';
          amount: number;
          description?: string | null;
          created_by_admin_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
