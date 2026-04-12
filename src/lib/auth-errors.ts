/**
 * Maps Supabase/auth errors to user-facing copy. Network failures often surface as TypeError: Failed to fetch.
 */
export function getAuthErrorMessage(err: unknown): string {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    return (
      'Could not reach the sign-in service. Check your internet connection, try turning off ad blockers ' +
      'for this site, and confirm NEXT_PUBLIC_SUPABASE_URL in .env.local matches your Supabase project URL ' +
      '(Dashboard → Settings → API).'
    )
  }
  if (err instanceof Error) return err.message
  return 'An error occurred'
}
