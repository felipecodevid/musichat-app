// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra; // compat
const supabaseUrl = extra?.SUPABASE_URL;
const supabaseKey = extra?.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase env vars (SUPABASE_URL / SUPABASE_KEY)");
}


export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storage: AsyncStorage },
});
