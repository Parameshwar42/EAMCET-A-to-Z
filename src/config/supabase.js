import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbwncitkapkhkxodmysy.supabase.co';
const supabaseKey = 'sb_publishable_oGP2RFiHbK78IU_9B9IzFQ_EWjLpBDX';

export const supabase = createClient(supabaseUrl, supabaseKey);
