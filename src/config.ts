const supabaseUrl =
  import.meta.env.VITE_Bolt_Database_URL ||
  import.meta.env.VITE_SUPABASE_URL || '';

const supabaseAnonKey =
  import.meta.env.VITE_Bolt_Database_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const hasValidConfig = !!(supabaseUrl && supabaseAnonKey);

if (hasValidConfig) {
  console.log('✅ Database connected:', supabaseUrl);
} else {
  console.warn('⚠️ No database credentials found - using mock data');
}

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  hasValidConfig,
};

if (typeof window !== 'undefined') {
  (window as any).__APP_CONFIG__ = config;
}
