import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kfaifzvagvxufoqxfjci.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYWlmenZhZ3Z4dWZvcXhmamNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MTM4NDksImV4cCI6MjA3MDk4OTg0OX0.bLWhL32KH3n4XC9Sdey3Sihm4pfkD558ua2NhHy19xk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
