import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Helper to add timeout to promises
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), ms)
  })
  return Promise.race([promise, timeout])
}

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Skip Supabase if credentials are not configured or are placeholder values
  if (
    !supabaseUrl || 
    !supabaseAnonKey || 
    !supabaseUrl.startsWith('http') ||
    supabaseUrl.includes('your_supabase')
  ) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Add 3 second timeout to prevent Supabase connection issues from blocking requests
  try {
    await withTimeout(supabase.auth.getUser(), 3000)
  } catch {
    // Silently continue if Supabase fails - don't block the request
    console.warn('Supabase auth check timed out or failed')
  }

  return supabaseResponse
}
