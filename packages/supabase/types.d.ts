interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

interface Window {
  ENV: Record<string, any>
}