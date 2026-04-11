import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bjjvmmetdudztqmitjmr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zLmpQquTB3WXrAo7Tjl8kg_P7B-2pkr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
