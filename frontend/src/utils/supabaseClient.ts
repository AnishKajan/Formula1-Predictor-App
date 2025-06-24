// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Use CRA-compatible environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
