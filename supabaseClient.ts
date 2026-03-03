
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xsuudajfwlpecsegkntf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdXVkYWpmd2xwZWNzZWdrbnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTM3ODQsImV4cCI6MjA4ODEyOTc4NH0.KTBrBlEznN3h_n3S5Uo1oIOqYKrQN3DMJlHVhx2gPEE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-xsuudajfwlpecsegkntf-auth-token'
    }
});
