import { createClient } from '@supabase/supabase-js';

// Read configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Configuration Notice] VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are not configured.\n' +
    'The app will operate using resilient local mock storage fallback.'
  );
}

// Initialize Supabase client if configured, otherwise provide a safe stub
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase URL/Key missing') }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ maybeSingle: async () => ({ data: null, error: null }), order: () => ({ data: [], error: null }) }),
          order: () => ({ data: [], error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        insert: async () => ({ error: null }),
        upsert: async () => ({ error: null }),
        delete: () => ({ eq: async () => ({ error: null }), neq: async () => ({ error: null }) }),
        update: () => ({ eq: async () => ({ error: null }) }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: new Error('Storage unavailable in mock mode') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };
