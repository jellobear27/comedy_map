'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  MapPin, BookOpen, MessageSquare,
  Users, ArrowRight, Plus, User,
  Mic, Edit, Loader2, Building2
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import {
  getAuthRoleHintFromClient,
  resolveAccountRoleWithHints,
  shouldPersistResolvedRole,
  isAdminProfileRole,
  type AccountRole,
} from '@/lib/account-role'
import ComedianPokemonCard from '@/components/comedian/ComedianPokemonCard'
import SuperfanTrainerCard from '@/components/superfan/SuperfanTrainerCard'

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  bio: string | null
  city: string | null
  state: string | null
  created_at: string
  profile_photo_url: string | null
  avatar_url: string | null
}

interface ComedianProfile {
  username: string | null
  headline: string | null
  comedy_styles: string[]
  comedy_start_date?: string | null
  available_for_booking: boolean
  booking_rate?: string | null
  travel_radius?: string | null
  performance_types?: string[]
  video_clips: { title: string; url: string; platform?: string }[]
  social_links?: Record<string, string>
}

interface SuperfanProfileRow {
  public_slug: string | null
  preferred_comedy_styles: string[]
  show_frequency: string | null
  favorite_local_names: string[]
  shows_attended: number
  membership_tier?: 'free' | 'premium'
  instagram_handle?: string | null
  show_instagram_on_card?: boolean
  card_like_count?: number
}

interface VenueProfileRow {
  venue_name: string
  contact_phone?: string | null
  website?: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [comedianProfile, setComedianProfile] = useState<ComedianProfile | null>(null)
  const [superfanProfile, setSuperfanProfile] = useState<SuperfanProfileRow | null>(null)
  const [venueProfile, setVenueProfile] = useState<VenueProfileRow | null>(null)
  const [accountRole, setAccountRole] = useState<AccountRole>('comedian')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    let userId: string | null = null
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      userId = user.id

      const authRoleHint = await getAuthRoleHintFromClient(supabase)

      const [
        { data: profileData, error: profileError },
        { data: comedianData },
        { data: superfanData },
        { data: venueData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('comedian_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('superfan_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('venue_profiles').select('*').eq('id', user.id).maybeSingle(),
      ])

      if (profileError) {
        console.error('Dashboard: profiles select error', profileError.message)
      }

      const resolvedRole = resolveAccountRoleWithHints(profileData?.role, authRoleHint, {
        hasSuperfanProfileRow: !!superfanData,
        hasVenueProfileRow: !!venueData,
        hasComedianProfileRow: !!comedianData,
      })

      if (profileData && shouldPersistResolvedRole(profileData.role, resolvedRole)) {
        await supabase
          .from('profiles')
          .update({ role: resolvedRole, updated_at: new Date().toISOString() })
          .eq('id', user.id)
      }

      setAccountRole(resolvedRole)

      if (profileData) {
        setProfile({
          ...profileData,
          email: user.email || '',
        })
        setIsAdmin(isAdminProfileRole(profileData.role))
      } else {
        // Create a basic profile from auth data
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          email: user.email || '',
          bio: null,
          city: null,
          state: null,
          created_at: user.created_at,
          profile_photo_url: null,
          avatar_url: null,
        })
      }

      if (comedianData) {
        setComedianProfile(comedianData)
      }
      if (superfanData) {
        setSuperfanProfile(superfanData as SuperfanProfileRow)
      }
      if (venueData) {
        setVenueProfile(venueData as VenueProfileRow)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      if (userId) {
        try {
          const supabase = createClient()
          const { data: roleRow, error: roleErr } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .maybeSingle()
          if (roleErr) {
            console.error('Dashboard: role select error', roleErr.message)
          }
          setIsAdmin(isAdminProfileRole(roleRow?.role))
        } catch {
          /* ignore */
        }
      }
      setIsLoading(false)
    }
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase()
    }
    return '?'
  }

  const formatMemberSince = () => {
    if (!profile?.created_at) return ''
    const date = new Date(profile.created_at)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getLocation = () => {
    const parts = [profile?.city, profile?.state].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : null
  }

  const isProfileComplete = () => {
    if (!profile?.full_name?.trim() || !profile?.city?.trim()) return false
    if (accountRole === 'comedian') {
      return !!(profile.bio?.trim() && comedianProfile?.username)
    }
    if (accountRole === 'superfan') {
      return !!profile.state?.trim()
    }
    if (accountRole === 'venue') {
      return !!(venueProfile?.venue_name?.trim())
    }
    return false
  }

  /** Admins keep the comedian hero (and moderator strip) even when UI role resolves to superfan/venue. */
  const showComedianHero = !!comedianProfile && (accountRole === 'comedian' || isAdmin)
  const showSuperfanHero = accountRole === 'superfan' && !!profile
  const showSuperfanDashboardHeader = showSuperfanHero

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7B2FF7] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 relative">
      {(showComedianHero || showSuperfanHero) && (
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-[#7B2FF7]/10 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#F72585]/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {!showComedianHero && !showSuperfanDashboardHeader && (
              <>
                {profile?.profile_photo_url || profile?.avatar_url ? (
                  <img
                    src={profile.profile_photo_url || profile.avatar_url || ''}
                    alt={profile.full_name || 'Profile'}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials()}
                  </div>
                )}
              </>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {showComedianHero || showSuperfanDashboardHeader
                  ? 'Dashboard'
                  : `Welcome${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋`}
              </h1>
              <p className="text-[#A0A0A0] text-sm sm:text-base">
                {showComedianHero || showSuperfanDashboardHeader ? (
                  <>Member since {formatMemberSince()}</>
                ) : (
                  <>
                    {getLocation() && (
                      <>
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {getLocation()} ·{' '}
                      </>
                    )}
                    Member since {formatMemberSince()}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/profile">
              <Button variant="secondary" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Link href="/open-mics">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Find Open Mics
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {!isProfileComplete() && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-[#7B2FF7]/20 to-[#F72585]/20 border-[#7B2FF7]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  {accountRole === 'comedian' && <>Complete your profile 🎤</>}
                  {accountRole === 'superfan' && <>Complete your fan profile</>}
                  {accountRole === 'venue' && <>Complete your venue profile 🏢</>}
                </h2>
                <p className="text-[#A0A0A0]">
                  {accountRole === 'comedian' && (
                    <>Add your bio, location, and comedy info to get discovered by venues and connect with other comedians.</>
                  )}
                  {accountRole === 'superfan' && (
                    <>
                      Add your <span className="text-white/90">home state</span> (and city) so your fan card
                      shows where you&apos;re based — then add comedy taste and a public link when you&apos;re
                      ready.
                    </>
                  )}
                  {accountRole === 'venue' && (
                    <>Add your venue name, location, and contact details so talent can reach you.</>
                  )}
                </p>
              </div>
              <Link href="/dashboard/profile">
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Complete Profile
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {showComedianHero && profile && comedianProfile && (
          <section className="mb-10 max-w-5xl mx-auto">
            <ComedianPokemonCard
              mode="dashboard"
              isNovaAdmin={isAdmin}
              profile={{
                full_name: profile.full_name,
                bio: profile.bio,
                city: profile.city,
                state: profile.state,
                profile_photo_url: profile.profile_photo_url,
                avatar_url: profile.avatar_url,
                email: profile.email,
              }}
              comedian={{
                username: comedianProfile.username,
                headline: comedianProfile.headline,
                comedy_styles: comedianProfile.comedy_styles ?? [],
                comedy_start_date: comedianProfile.comedy_start_date,
                available_for_booking: comedianProfile.available_for_booking,
                booking_rate: comedianProfile.booking_rate,
                travel_radius: comedianProfile.travel_radius,
                performance_types: comedianProfile.performance_types ?? [],
                video_clips: comedianProfile.video_clips ?? [],
                social_links: comedianProfile.social_links,
              }}
            />
          </section>
        )}

        {showSuperfanHero && (
          <section className="mb-10 max-w-5xl mx-auto">
            <SuperfanTrainerCard
              mode="dashboard"
              isNovaAdmin={isAdmin}
              profile={{
                full_name: profile.full_name,
                bio: profile.bio,
                city: profile.city,
                state: profile.state,
                profile_photo_url: profile.profile_photo_url,
                avatar_url: profile.avatar_url,
              }}
              superfan={{
                public_slug: superfanProfile?.public_slug ?? null,
                preferred_comedy_styles: superfanProfile?.preferred_comedy_styles ?? [],
                show_frequency: superfanProfile?.show_frequency ?? null,
                favorite_local_names: superfanProfile?.favorite_local_names ?? [],
                shows_attended: superfanProfile?.shows_attended ?? 0,
                membership_tier: superfanProfile?.membership_tier,
                instagram_handle: superfanProfile?.instagram_handle ?? null,
                show_instagram_on_card: !!superfanProfile?.show_instagram_on_card,
                card_like_count: superfanProfile?.card_like_count ?? 0,
              }}
            />
          </section>
        )}

        {accountRole === 'venue' && profile && (
          <section className="mb-10 max-w-5xl mx-auto">
            <Card className="p-8 border border-[#FFB627]/25 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FFB627]/15 flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-[#FFB627]" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#FFB627]">
                    Venue account
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    {venueProfile?.venue_name || 'Your venue'}
                  </h2>
                  <p className="text-[#A0A0A0] text-sm">
                    {getLocation() || 'Add your city and state in Edit Profile.'}
                  </p>
                  {(venueProfile?.contact_phone || venueProfile?.website) && (
                    <div className="flex flex-wrap gap-4 text-sm pt-2">
                      {venueProfile.contact_phone && (
                        <span className="text-[#E0E0E0]">{venueProfile.contact_phone}</span>
                      )}
                      {venueProfile.website && (
                        <a
                          href={venueProfile.website.startsWith('http') ? venueProfile.website : `https://${venueProfile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7B2FF7] hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <Link href="/dashboard/profile">
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit venue details
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7B2FF7]/10 flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#7B2FF7]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Saved Mics</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F72585]/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#F72585]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Courses</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" hover={false} className="p-4">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00F5D4]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#00F5D4]" />
                </div>
                <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Posts</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB627]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#FFB627]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Connections</p>
                </div>
              </div>
            </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Get Started */}
            <Card variant="gradient" hover={false}>
              <h2 className="text-lg font-semibold text-white mb-6">Get Started</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/open-mics" className="group">
                  <div className="p-4 rounded-xl bg-[#7B2FF7]/5 border border-[#7B2FF7]/10 hover:border-[#7B2FF7]/30 transition-colors">
                    <Mic className="w-8 h-8 text-[#7B2FF7] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#7B2FF7] transition-colors">Find Open Mics</h3>
                    <p className="text-sm text-[#A0A0A0]">Discover open mics near you</p>
                  </div>
                </Link>
                <Link href="/courses" className="group">
                  <div className="p-4 rounded-xl bg-[#F72585]/5 border border-[#F72585]/10 hover:border-[#F72585]/30 transition-colors">
                    <BookOpen className="w-8 h-8 text-[#F72585] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#F72585] transition-colors">Browse Courses</h3>
                    <p className="text-sm text-[#A0A0A0]">Learn from the pros</p>
              </div>
                </Link>
                <Link href="/community" className="group">
                  <div className="p-4 rounded-xl bg-[#00F5D4]/5 border border-[#00F5D4]/10 hover:border-[#00F5D4]/30 transition-colors">
                    <MessageSquare className="w-8 h-8 text-[#00F5D4] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#00F5D4] transition-colors">Join Community</h3>
                    <p className="text-sm text-[#A0A0A0]">Connect with comedians</p>
                      </div>
                </Link>
                <Link href="/for-venues/find-talent" className="group">
                  <div className="p-4 rounded-xl bg-[#FFB627]/5 border border-[#FFB627]/10 hover:border-[#FFB627]/30 transition-colors">
                    <Users className="w-8 h-8 text-[#FFB627] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#FFB627] transition-colors">Find Talent</h3>
                    <p className="text-sm text-[#A0A0A0]">Browse other comedians</p>
                  </div>
                </Link>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Video Clips */}
            {accountRole === 'comedian' && comedianProfile?.video_clips && comedianProfile.video_clips.length > 0 ? (
            <Card variant="glass" hover={false}>
                <h2 className="text-lg font-semibold text-white mb-4">Your Video Clips</h2>
                <div className="space-y-3">
                  {comedianProfile.video_clips.slice(0, 3).map((clip, index) => (
                    <a
                      key={index}
                      href={clip.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#7B2FF7]/20 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-[#7B2FF7]" />
                  </div>
                      <span className="text-sm text-white truncate">{clip.title}</span>
                    </a>
                  ))}
                </div>
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    Manage Clips
                  </Button>
                </Link>
            </Card>
            ) : accountRole === 'comedian' ? (
            <Card variant="glass" hover={false}>
                <h2 className="text-lg font-semibold text-white mb-4">Video Clips</h2>
                <p className="text-[#A0A0A0] text-sm mb-4">
                  Add links to your sets so venues can see your work!
                </p>
                <Link href="/dashboard/profile">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video Clips
                  </Button>
                </Link>
            </Card>
            ) : null}

            {/* Quick Links */}
            <Card variant="glass" hover={false}>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <User className="w-5 h-5 text-[#7B2FF7]" />
                  <span className="text-[#A0A0A0] hover:text-white">Edit Profile</span>
                </Link>
                <Link
                  href="/community"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-[#00F5D4]" />
                  <span className="text-[#A0A0A0] hover:text-white">Community Forum</span>
                </Link>
                <Link
                  href="/open-mics"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Mic className="w-5 h-5 text-[#F72585]" />
                  <span className="text-[#A0A0A0] hover:text-white">Find Open Mics</span>
                </Link>
                {accountRole === 'comedian' && comedianProfile?.username && (
                <Link
                    href={`/comedians/${comedianProfile.username}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                    <ArrowRight className="w-5 h-5 text-[#FFB627]" />
                    <span className="text-[#A0A0A0] hover:text-white">View Public Profile</span>
                </Link>
                )}
                {accountRole === 'superfan' && superfanProfile?.public_slug && (
                <Link
                    href={`/superfans/${superfanProfile.public_slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                    <ArrowRight className="w-5 h-5 text-[#00F5D4]" />
                    <span className="text-[#A0A0A0] hover:text-white">View public fan card</span>
                </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
