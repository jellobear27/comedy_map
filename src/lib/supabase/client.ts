import { createBrowserClient } from '@supabase/ssr'

// Check if URL is valid
function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false
  if (url.includes('your_supabase') || url.includes('your-project')) return false
  return true
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey.includes('your_')) {
    console.warn('⚠️ Supabase credentials not configured. Database features will be disabled.')
    
    // Create a chainable mock that returns itself for any method
    const createChainableMock = (): Record<string, unknown> => {
      const mockResult = { data: [], error: null }
      const chainable: Record<string, unknown> = {
        ...mockResult,
        select: () => chainable,
        eq: () => chainable,
        neq: () => chainable,
        in: () => chainable,
        order: () => chainable,
        limit: () => chainable,
        single: () => ({ data: null, error: null }),
        maybeSingle: () => ({ data: null, error: null }),
      }
      return chainable
    }
    
    // Return a mock client for development without Supabase
    return {
      auth: {
        signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
        signUp: async () => ({ error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => createChainableMock(),
        insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
        update: async () => ({ data: null, error: new Error('Supabase not configured') }),
        upsert: async () => ({ data: null, error: new Error('Supabase not configured') }),
        delete: async () => ({ data: null, error: new Error('Supabase not configured') }),
      }),
    } as unknown as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
