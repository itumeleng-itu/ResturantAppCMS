import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (url, init) => {
      return fetch(url, init)
        .catch(error => {
          if (error instanceof TypeError) {
            // Re-throw with more context
            const networkError = new Error(
              `Network error: ${error.message}. ` +
              'Unable to reach Supabase. Check your internet connection and ensure the Supabase project is accessible.'
            );
            throw networkError;
          }
          throw error;
        });
    },
  },
});
