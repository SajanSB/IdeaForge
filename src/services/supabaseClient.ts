import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Fallback to dummy credentials if variables are empty or have default placeholders
const supabaseUrl = !rawUrl || rawUrl === 'your_supabase_project_url' || !rawUrl.startsWith('http') 
  ? 'https://placeholder-project.supabase.co' 
  : rawUrl
const supabaseKey = !rawKey || rawKey === 'your_supabase_anon_key' 
  ? 'placeholder-anon-key' 
  : rawKey

export const supabase = createClient(supabaseUrl, supabaseKey)
