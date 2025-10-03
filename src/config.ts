// Environment configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have valid Supabase credentials
const hasValidConfig = supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.includes('supabase.co') &&
  !supabaseUrl.includes('0ec90b57d6e95fcbda19832f'); // Old invalid URL

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  hasValidConfig,
  useMockData: !hasValidConfig,
};

// Make config globally available for vanilla JS modules
if (typeof window !== 'undefined') {
  (window as any).__APP_CONFIG__ = config;

  if (!hasValidConfig) {
    console.warn('⚠️ Using mock data - Supabase not configured. See README for setup instructions.');
  }
}
