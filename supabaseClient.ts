
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbsrzebprlklebdoaznn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhic3J6ZWJwcmxrbGViZG9hem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NjE4MDIsImV4cCI6MjA4NzAzNzgwMn0.hAbVKwvFj1sAPaoyEVPrlMeumIpgbmqc7AdjvI9aPN4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-xbsrzebprlklebdoaznn-auth-token'
    }
});
