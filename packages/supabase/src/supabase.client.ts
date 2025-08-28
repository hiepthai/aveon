import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

export function createSupabaseClient(): SupabaseClient | null {
  if (supabase) {
    return supabase;
  }

  const supabaseUrl = window.ENV?.SUPABASE_URL;
  const supabaseAnonKey = window.ENV?.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Supabase client requires an environment environment variable.',
    );
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);

  return supabase;
}
