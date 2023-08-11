import { createClient } from '@supabase/supabase-js'
import invariant from 'tiny-invariant'

const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.env
invariant(SUPABASE_URL, 'SUPABASE_URL env var not set')
invariant(SUPABASE_ANON_KEY, 'SUPABASE_ANON_KEY env var not set')

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})
