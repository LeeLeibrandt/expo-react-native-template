export type Json = boolean | null | number | string | Json[] | { [key: string]: Json | undefined };

export interface Database {
  public: {
    Enums: {
      subscription_tier: 'free' | 'pro' | 'team';
    };
    Functions: Record<string, never>;
    Tables: {
      profiles: {
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          subscription_tier?: Database['public']['Enums']['subscription_tier'] | null;
          updated_at?: string | null;
        };
        Relationships: [];
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          subscription_tier: Database['public']['Enums']['subscription_tier'] | null;
          updated_at: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          subscription_tier?: Database['public']['Enums']['subscription_tier'] | null;
          updated_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
  };
}
