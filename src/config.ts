// Supabase configuration
const supabaseUrl = import.meta.env.VITE_Bolt_Database_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_Bolt_Database_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  hasValidConfig: true,
  useMockData: false,
};

// Make config globally available for vanilla JS modules
if (typeof window !== 'undefined') {
  (window as any).__APP_CONFIG__ = config;
}
