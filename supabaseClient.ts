
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xsuudajfwlpecsegkntf.supabase.co';
const supabaseAnonKey = 'sb_publishable_FhSBlvaJc-seW9sz50-U0w_rBTzRDSA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-xbsrzebprlklebdoaznn-auth-token'
    }
});
