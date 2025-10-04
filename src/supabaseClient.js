import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const hasValidConfig = !!(supabaseUrl && supabaseAnonKey);

if (hasValidConfig) {
  console.log('✅ Supabase client initialized:', supabaseUrl);
} else {
  console.warn('⚠️ No Supabase credentials - using mock data');
}

export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const hasSupabase = !!supabase;
