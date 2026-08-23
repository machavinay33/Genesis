import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaces a clear message in the browser console instead of a cryptic
  // "Invalid URL" error from inside the supabase-js client.
  console.error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'in your .env file (local) or in Netlify Site settings > Environment variables (production).'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
