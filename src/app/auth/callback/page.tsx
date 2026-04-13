'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import type { EmailOtpType } from '@supabase/supabase-js'

function parseOtpType(raw: string | null): EmailOtpType {
  const allowed: EmailOtpType[] = [
    'signup',
    'invite',
    'magiclink',
    'recovery',
    'email_change',
    'email',
  ]
  if (raw && allowed.includes(raw as EmailOtpType)) return raw as EmailOtpType
  return 'signup'
}

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const run = async () => {
      const supabase = createClient()
      const next = searchParams.get('next') ?? '/dashboard'

      const errorParam = searchParams.get('error')
      const errorDesc = searchParams.get('error_description')
      if (errorParam) {
        const msg = errorDesc
          ? `${errorParam}: ${errorDesc}`
          : errorParam
        router.replace(`/login?error=${encodeURIComponent(msg)}`)
        return
      }

      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const typeRaw = searchParams.get('type')

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          router.replace(next)
          return
        }

        if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: parseOtpType(typeRaw),
          })
          if (error) throw error
          router.replace(next)
          return
        }

        // Implicit: tokens in URL hash (handled by @supabase/ssr client) or existing session
        const trySession = async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          return session
        }

        let session = await trySession()
        if (!session) {
          await new Promise((r) => setTimeout(r, 250))
          session = await trySession()
        }
        if (!session) {
          await new Promise((r) => setTimeout(r, 500))
          session = await trySession()
        }

        if (session) {
          router.replace(next)
        } else {
          router.replace(
            `/login?error=${encodeURIComponent(
              'Could not complete sign-in. Open the link from the same browser you used to sign up, or request a new confirmation email.'
            )}`
          )
        }
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : 'Could not authenticate. Please try again.'
        router.replace(`/login?error=${encodeURIComponent(msg)}`)
      }
    }

    void run()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505] px-4">
      <Loader2 className="w-10 h-10 text-[#7B2FF7] animate-spin" aria-hidden />
      <p className="text-[#A0A0A0] text-sm">Finishing sign-in…</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050505]">
          <Loader2 className="w-10 h-10 text-[#7B2FF7] animate-spin" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  )
}
