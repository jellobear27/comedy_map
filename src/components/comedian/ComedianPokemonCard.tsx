'use client'

import Link from 'next/link'
import {
  MapPin,
  Video,
  Mic,
  Zap,
  Sparkles,
  Clock,
  Award,
  Mail,
} from 'lucide-react'
import Button from '@/components/ui/Button'

export type ComedianPokemonCardProfile = {
  full_name: string | null
  bio: string | null
  city: string | null
  state: string | null
  profile_photo_url: string | null
  avatar_url: string | null
  email?: string | null
}

export type ComedianPokemonCardData = {
  username: string | null
  headline: string | null
  comedy_styles: string[]
  comedy_start_date?: string | null
  available_for_booking: boolean
  booking_rate?: string | null
  travel_radius?: string | null
  performance_types?: string[]
  video_clips?: { title: string; url: string; platform?: string }[]
  social_links?: Record<string, string>
}

type Mode = 'public' | 'dashboard'

export type ComedianPokemonCardProps = {
  profile: ComedianPokemonCardProfile
  comedian: ComedianPokemonCardData
  mode: Mode
}

const ACCENT = ['#7B2FF7', '#F72585', '#00F5D4', '#FFB627'] as const

export default function ComedianPokemonCard({
  profile,
  comedian,
  mode,
}: ComedianPokemonCardProps) {
  const comedyStyles = comedian.comedy_styles || []
  const performanceTypes = comedian.performance_types || []
  const videoClips = comedian.video_clips || []

  /** Whole years on stage from comedy_start_date; null if not set or invalid */
  const startDate = (() => {
    const raw = comedian.comedy_start_date
    if (raw == null || String(raw).trim() === '') return null
    const d = new Date(raw as string)
    return Number.isNaN(d.getTime()) ? null : d
  })()

  const yearsOnStage =
    startDate !== null
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
          )
        )
      : null

  const isBookable = Boolean(comedian.available_for_booking)

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#7B2FF7] via-[#F72585] via-[#00F5D4] to-[#7B2FF7] rounded-[2rem] opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />

      <div className="relative bg-gradient-to-br from-[#0D0016] via-[#1A0033] to-[#0D0016] rounded-[2rem] border border-[#7B2FF7]/30 overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-4 border-b border-[#7B2FF7]/20 bg-[#7B2FF7]/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#A0A0A0] font-medium uppercase tracking-wider text-sm">
            Stand-Up Comedian
          </span>
        </div>

        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 space-y-6">
              <div className="relative mx-auto lg:mx-0 w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FF7] via-[#F72585] to-[#00F5D4] rounded-2xl" />
                <div className="absolute inset-[3px] bg-[#0D0016] rounded-2xl overflow-hidden">
                  {profile.profile_photo_url || profile.avatar_url ? (
                    <img
                      src={profile.profile_photo_url || profile.avatar_url || ''}
                      alt={profile.full_name || 'Comedian'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#7B2FF7]/50 to-[#F72585]/50 flex items-center justify-center">
                      <span className="text-8xl font-bold text-white/80">
                        {profile.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#FFB627] animate-pulse" />
                <Sparkles
                  className="absolute -bottom-2 -left-2 w-4 h-4 text-[#00F5D4] animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>

              <div className="bg-[#0A0A0A]/50 rounded-xl p-4 border border-[#7B2FF7]/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B2FF7] mb-3">
                  Stats
                </h4>

                {yearsOnStage !== null ? (
                  <div className="mb-4 rounded-xl bg-gradient-to-br from-[#7B2FF7]/25 via-[#1A0033] to-[#00F5D4]/15 border border-[#00F5D4]/30 p-4 text-center shadow-[0_0_24px_rgba(0,245,212,0.12)]">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00F5D4] mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      Stage XP
                    </div>
                    {/* Solid text so the number always shows (gradient clip can look "invisible" in some browsers) */}
                    <div className="text-4xl sm:text-5xl font-black tabular-nums leading-none tracking-tight text-white [text-shadow:0_0_24px_rgba(0,245,212,0.35)]">
                      {yearsOnStage === 0 ? '<1' : yearsOnStage}
                    </div>
                    <p className="text-xs text-[#A0A0A0] mt-2">
                      {yearsOnStage === 0
                        ? 'under 1 year on stage'
                        : yearsOnStage === 1
                          ? 'year of comedy experience'
                          : 'years of comedy experience'}
                    </p>
                  </div>
                ) : mode === 'dashboard' ? (
                  <div className="mb-4 rounded-xl border border-dashed border-[#7B2FF7]/35 bg-[#7B2FF7]/5 px-3 py-3 text-center">
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Add the{' '}
                      <span className="text-white/90">year you started comedy</span> in{' '}
                      <Link
                        href="/dashboard/profile"
                        className="text-[#7B2FF7] hover:text-[#F72585] font-medium"
                      >
                        Edit Profile
                      </Link>{' '}
                      to show years of experience here.
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl border border-[#333] bg-[#111]/80 px-3 py-3 text-center">
                    <p className="text-xs text-[#666]">
                      Years on stage not listed
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Always-visible row so experience is never missing from the list */}
                  <div className="flex items-center justify-between pb-1 border-b border-[#7B2FF7]/15">
                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#00F5D4]" />
                      Years on stage
                    </span>
                    <span className="text-white font-bold tabular-nums">
                      {yearsOnStage !== null
                        ? yearsOnStage === 0
                          ? '<1'
                          : yearsOnStage
                        : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#F72585]" />
                      Clips
                    </span>
                    <span className="text-white font-bold">{videoClips.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#FFB627]" />
                      Styles
                    </span>
                    <span className="text-white font-bold">{comedyStyles.length}</span>
                  </div>
                  {(profile.city || profile.state) && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#7B2FF7] shrink-0" />
                        Base
                      </span>
                      <span className="text-white font-bold text-right text-sm">
                        {[profile.city, profile.state].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-6">
              <div>
                <h2 className="text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                  {profile.full_name || 'Your name'}
                </h2>
                {comedian.headline && (
                  <p className="text-xl text-[#A0A0A0] italic">&ldquo;{comedian.headline}&rdquo;</p>
                )}
              </div>

              {comedyStyles.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F72585] mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Signature Moves
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comedyStyles.map((style, index) => (
                      <span
                        key={style}
                        className="px-4 py-2 rounded-full font-semibold text-sm border"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT[index % 4]}20, transparent)`,
                          borderColor: `${ACCENT[index % 4]}40`,
                          color: ACCENT[index % 4],
                        }}
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.bio && (
                <div className="bg-[#0A0A0A]/50 rounded-xl p-6 border border-[#7B2FF7]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00F5D4] mb-3">
                    Origin Story
                  </h4>
                  <p className="text-[#E0E0E0] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}

              {!profile.bio && mode === 'dashboard' && (
                <div className="rounded-xl p-6 border border-dashed border-[#7B2FF7]/30 bg-[#7B2FF7]/5">
                  <p className="text-[#A0A0A0] text-sm">
                    Add your origin story in{' '}
                    <Link
                      href="/dashboard/profile"
                      className="text-[#7B2FF7] hover:text-[#F72585] font-medium"
                    >
                      Edit Profile
                    </Link>{' '}
                    so bookers know your voice.
                  </p>
                </div>
              )}

              {performanceTypes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFB627] mb-3">
                    Available For
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {performanceTypes.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 bg-[#FFB627]/10 border border-[#FFB627]/30 rounded-full text-[#FFB627] text-sm capitalize"
                      >
                        {type.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {mode === 'public' && isBookable && profile.email && (
          <div className="px-8 py-6 border-t border-[#7B2FF7]/20 bg-gradient-to-r from-[#7B2FF7]/10 via-[#F72585]/10 to-[#7B2FF7]/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {comedian.booking_rate && (
                  <p className="text-white">
                    <span className="text-[#A0A0A0]">Rate:</span>{' '}
                    <span className="font-bold text-[#00F5D4]">{comedian.booking_rate}</span>
                  </p>
                )}
                {comedian.travel_radius && (
                  <p className="text-sm text-[#A0A0A0]">
                    Travels: {comedian.travel_radius === 'local' && 'Local (50mi)'}
                    {comedian.travel_radius === 'regional' && 'Regional (250mi)'}
                    {comedian.travel_radius === 'national' && 'National'}
                    {comedian.travel_radius === 'international' && 'International'}
                  </p>
                )}
              </div>
              <a href={`mailto:${profile.email}`}>
                <Button className="bg-gradient-to-r from-[#7B2FF7] to-[#F72585] hover:opacity-90 px-8">
                  <Mail className="w-4 h-4 mr-2" />
                  Book This Legend
                </Button>
              </a>
            </div>
          </div>
        )}

        {mode === 'dashboard' && (
          <div
            className={
              isBookable
                ? 'px-8 py-6 border-t border-[#7B2FF7]/20 bg-gradient-to-r from-[#7B2FF7]/10 via-[#F72585]/10 to-[#7B2FF7]/10'
                : 'px-8 py-5 border-t border-[#7B2FF7]/20 bg-[#0A0A0A]/40'
            }
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {isBookable ? (
                <p className="text-sm text-[#A0A0A0] max-w-xl">
                  Booking details and &ldquo;Book this legend&rdquo; appear on your public card like this. Share
                  your link with bookers.
                </p>
              ) : (
                <p className="text-sm text-[#A0A0A0] max-w-xl">
                  Turn on <span className="text-white/90">Available for booking</span> in Edit Profile when you
                  want the mail button and rate to show for venues.
                </p>
              )}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {comedian.username && (
                  <Link href={`/comedians/${comedian.username}`} className="flex-1 min-w-[140px] sm:flex-none">
                    <Button variant="secondary" className="w-full">
                      View public card
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard/profile" className="flex-1 min-w-[140px] sm:flex-none">
                  <Button className="w-full bg-gradient-to-r from-[#7B2FF7] to-[#F72585]">
                    Edit highlights & stats
                  </Button>
                </Link>
              </div>
            </div>
            {isBookable && (comedian.booking_rate || comedian.travel_radius) && (
              <div className="mt-4 pt-4 border-t border-[#7B2FF7]/20 flex flex-wrap gap-6 text-sm">
                {comedian.booking_rate && (
                  <p className="text-white">
                    <span className="text-[#A0A0A0]">Rate:</span>{' '}
                    <span className="font-bold text-[#00F5D4]">{comedian.booking_rate}</span>
                  </p>
                )}
                {comedian.travel_radius && (
                  <p className="text-[#A0A0A0]">
                    Travel:{' '}
                    <span className="text-white font-medium">
                      {comedian.travel_radius === 'local' && 'Local (50mi)'}
                      {comedian.travel_radius === 'regional' && 'Regional (250mi)'}
                      {comedian.travel_radius === 'national' && 'National'}
                      {comedian.travel_radius === 'international' && 'International'}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
