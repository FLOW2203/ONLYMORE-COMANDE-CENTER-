import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://isuzbpzwxcagtnbosgjl.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key-for-build'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
