import { NextResponse } from 'next/server'

/**
 * Some Supabase email templates or dashboard configs use /auth/confirm instead of /auth/callback.
 * Preserve query string (e.g. ?code= for PKCE). Hash fragments are not sent to the server; users
 * with hash-only redirects should use /auth/callback directly.
 */
export async function GET(request: Request) {
  const u = new URL(request.url)
  u.pathname = '/auth/callback'
  return NextResponse.redirect(u)
}
