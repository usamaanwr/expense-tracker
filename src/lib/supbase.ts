import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonkey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
if (!supabaseUrl || !supabaseAnonkey) {
  throw new Error('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl,supabaseAnonkey)