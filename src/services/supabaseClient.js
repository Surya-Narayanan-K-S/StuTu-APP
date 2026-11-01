import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cwyhjdtcciywcpdoeawt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lDLbfOyuT2cp9A4Vv0ajng_9XRj9M4T';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
