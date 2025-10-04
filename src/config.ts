const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_Bolt_Database_URL ||
  '';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_Bolt_Database_ANON_KEY ||
  '';

const hasValidConfig = !!(supabaseUrl && supabaseAnonKey);

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  hasValidConfig,
};

if (typeof window !== 'undefined') {
  (window as any).__APP_CONFIG__ = config;
}
