'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, Mic, Building2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Logo from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase/client'

type UserRole = 'comedian' | 'venue'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get('role') as UserRole || 'comedian'
  
  const [role, setRole] = useState<UserRole>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<'google' | 'github' | null>(null)
  const [error, setError] = useState('')

  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    setIsOAuthLoading(provider)
    setError('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Pass the role so we can use it after OAuth
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsOAuthLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Get the current URL for the callback
      const redirectUrl = `${window.location.origin}/auth/callback`
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (signUpError) throw signUpError
      
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        // User already exists
        setError('An account with this email already exists. Please sign in instead.')
      } else if (data?.user && !data?.session) {
        // Email confirmation required
        setShowConfirmation(true)
      } else if (data?.session) {
        // Email confirmation not required, user is logged in
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Show confirmation message
  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00F5D4]/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#7B2FF7]/20 rounded-full blur-[128px]" />
        </div>
        
        <div className="relative w-full max-w-md text-center">
          <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#00F5D4]/20 rounded-3xl p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#00F5D4]/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#00F5D4]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-[#A0A0A0] mb-6">
              We sent a confirmation link to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-sm text-[#A0A0A0] mb-6">
              Click the link in the email to verify your account and get started.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F72585]/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#7B2FF7]/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo size={40} />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7B2FF7] via-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
              NovaActa
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-3xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Create Your Account
          </h1>
          <p className="text-[#A0A0A0] text-center mb-8">
            Join the comedy revolution
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole('comedian')}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300 text-center
                ${role === 'comedian'
                  ? 'border-[#7B2FF7] bg-[#7B2FF7]/10'
                  : 'border-[#7B2FF7]/20 hover:border-[#7B2FF7]/50'
                }
              `}
            >
              <Mic className={`w-8 h-8 mx-auto mb-2 ${role === 'comedian' ? 'text-[#7B2FF7]' : 'text-[#A0A0A0]'}`} />
              <span className={`font-medium ${role === 'comedian' ? 'text-white' : 'text-[#A0A0A0]'}`}>
                Comedian
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole('venue')}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300 text-center
                ${role === 'venue'
                  ? 'border-[#F72585] bg-[#F72585]/10'
                  : 'border-[#7B2FF7]/20 hover:border-[#7B2FF7]/50'
                }
              `}
            >
              <Building2 className={`w-8 h-8 mx-auto mb-2 ${role === 'venue' ? 'text-[#F72585]' : 'text-[#A0A0A0]'}`} />
              <span className={`font-medium ${role === 'venue' ? 'text-white' : 'text-[#A0A0A0]'}`}>
                Venue
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-[#FF6B6B] text-sm">
                {error}
              </div>
            )}

            <Input
              id="fullName"
              type="text"
              label={role === 'venue' ? 'Venue Name' : 'Full Name'}
              placeholder={role === 'venue' ? 'The Comedy Club' : 'John Doe'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-[#A0A0A0] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-sm text-[#A0A0A0]">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#7B2FF7] hover:text-[#F72585] transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#7B2FF7] hover:text-[#F72585] transition-colors">
                Privacy Policy
              </Link>
            </div>

            <Button 
              type="submit" 
              className={`w-full ${role === 'venue' ? 'bg-gradient-to-r from-[#F72585] to-[#FFB627]' : ''}`} 
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#7B2FF7]/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1A0033]/40 text-[#A0A0A0]">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button 
                variant="secondary" 
                type="button"
                onClick={() => handleOAuthSignUp('google')}
                disabled={isOAuthLoading !== null}
                isLoading={isOAuthLoading === 'google'}
              >
                {isOAuthLoading !== 'google' && (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Google
              </Button>
              <Button 
                variant="secondary" 
                type="button"
                onClick={() => handleOAuthSignUp('github')}
                disabled={isOAuthLoading !== null}
                isLoading={isOAuthLoading === 'github'}
              >
                {isOAuthLoading !== 'github' && (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                GitHub
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[#A0A0A0]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#7B2FF7] hover:text-[#F72585] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B2FF7]"></div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}

