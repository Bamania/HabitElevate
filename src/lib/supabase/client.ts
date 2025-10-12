import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton instance to avoid multiple GoTrueClient warnings
let supabaseInstance: SupabaseClient | null = null

// For use in client components with singleton pattern
export const createSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        }
      }
    )
  }
  return supabaseInstance
}

// Export the default client (legacy support)
export const supabase = createSupabaseClient()
