import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zjykkdiztiqddqnobrpc.supabase.co' // Tu URL de Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeWtrZGl6dGlxZGRxbm9icnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTQyMzQsImV4cCI6MjA3MTkzMDIzNH0.qk-LsXibQAzn3VeDDTKcav2ZL3mhJivl2hxtRXFcFU4' // Tu clave anónima pública

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})