import { createClient } from '@supabase/supabase-js';

// Get config from global variable set by config.ts
const getConfig = () => {
  if (window.__APP_CONFIG__) {
    return window.__APP_CONFIG__;
  }
  console.error('Config not loaded yet!');
  return { supabaseUrl: '', supabaseAnonKey: '', hasValidConfig: false };
};

const config = getConfig();

// Only create Supabase client if we have valid config
export const supabase = config.hasValidConfig
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

export const hasSupabase = !!supabase;
