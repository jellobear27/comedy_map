'use client'

import Link from 'next/link'
import {
  MapPin,
  Heart,
  Sparkles,
  Ticket,
  Users,
  Zap,
  Award,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { SUPERFAN_SHOW_FREQUENCY } from '@/types'

export type SuperfanTrainerProfile = {
  full_name: string | null
  bio: string | null
  city: string | null
  state: string | null
  profile_photo_url: string | null
  avatar_url: string | null
}

export type SuperfanTrainerData = {
  public_slug: string | null
  preferred_comedy_styles: string[]
  show_frequency: string | null
  favorite_local_names: string[]
  shows_attended: number
  membership_tier?: 'free' | 'premium'
}

type Mode = 'public' | 'dashboard'

export type SuperfanTrainerCardProps = {
  profile: SuperfanTrainerProfile
  superfan: SuperfanTrainerData
  mode: Mode
}

/** Match ComedianPokemonCard accent chips */
const ACCENT = ['#7B2FF7', '#F72585', '#00F5D4', '#FFB627'] as const

function frequencyLabel(value: string | null): string | null {
  if (!value) return null
  return SUPERFAN_SHOW_FREQUENCY.find((o) => o.value === value)?.label ?? value
}

export default function SuperfanTrainerCard({
  profile,
  superfan,
  mode,
}: SuperfanTrainerCardProps) {
  const styles = superfan.preferred_comedy_styles || []
  const locals = superfan.favorite_local_names || []
  const freq = frequencyLabel(superfan.show_frequency)
  const shows = superfan.shows_attended ?? 0
  const stateDisplay = profile.state?.trim() || null
  const homeLine = [profile.city, profile.state].filter(Boolean).join(', ')

  const hasTaste = styles.length > 0

  return (
    <div className="relative group">
      {/* Same outer glow as ComedianPokemonCard */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#7B2FF7] via-[#F72585] via-[#00F5D4] to-[#7B2FF7] rounded-[2rem] opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />

      <div className="relative bg-gradient-to-br from-[#0D0016] via-[#1A0033] to-[#0D0016] rounded-[2rem] border border-[#7B2FF7]/30 overflow-hidden">
        <div className="flex items-center gap-3 px-8 py-4 border-b border-[#7B2FF7]/20 bg-[#7B2FF7]/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-white fill-white/20" />
          </div>
          <span className="text-[#A0A0A0] font-medium uppercase tracking-wider text-sm">
            Comedy Superfan
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
                      alt={profile.full_name || 'Superfan'}
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

                {stateDisplay ? (
                  <div className="mb-4 rounded-xl bg-gradient-to-br from-[#7B2FF7]/25 via-[#1A0033] to-[#00F5D4]/15 border border-[#00F5D4]/30 p-4 text-center shadow-[0_0_24px_rgba(0,245,212,0.12)]">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00F5D4] mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      Home state
                    </div>
                    <div className="text-4xl sm:text-5xl font-black tabular-nums leading-none tracking-tight text-white [text-shadow:0_0_24px_rgba(123,47,247,0.35)]">
                      {stateDisplay}
                    </div>
                    {profile.city && (
                      <p className="text-xs text-[#A0A0A0] mt-2">{profile.city}</p>
                    )}
                  </div>
                ) : mode === 'dashboard' ? (
                  <div className="mb-4 rounded-xl border border-dashed border-[#7B2FF7]/35 bg-[#7B2FF7]/5 px-3 py-3 text-center">
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Add your{' '}
                      <span className="text-white/90">home state</span> in{' '}
                      <Link
                        href="/dashboard/profile"
                        className="text-[#7B2FF7] hover:text-[#F72585] font-medium"
                      >
                        Edit Profile
                      </Link>{' '}
                      so your card shows where you catch shows.
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl border border-[#333] bg-[#111]/80 px-3 py-3 text-center">
                    <p className="text-xs text-[#666]">Home state not listed</p>
                  </div>
                )}

                {freq ? (
                  <div className="mb-4 rounded-xl border border-[#F72585]/25 bg-[#F72585]/5 px-3 py-3 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#F72585] mb-1">
                      Outings
                    </div>
                    <p className="text-lg font-bold text-white">{freq}</p>
                  </div>
                ) : mode === 'dashboard' ? (
                  <div className="mb-4 rounded-xl border border-dashed border-[#F72585]/30 bg-[#F72585]/5 px-3 py-2 text-center">
                    <p className="text-xs text-[#A0A0A0]">
                      Set{' '}
                      <span className="text-white/90">how often you go out</span> in{' '}
                      <Link href="/dashboard/profile" className="text-[#F72585] font-medium">
                        Edit Profile
                      </Link>
                      .
                    </p>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-[#7B2FF7]/15">
                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#F72585]" />
                      Shows logged
                    </span>
                    <span className="text-white font-bold tabular-nums">{shows}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#FFB627]" />
                      Taste tags
                    </span>
                    <span className="text-white font-bold">{styles.length}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#7B2FF7] shrink-0" />
                      Home base
                    </span>
                    <span className="text-white font-bold text-right text-sm">
                      {homeLine || '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-6">
              <div>
                <h2 className="text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                  {profile.full_name || 'Fan'}
                </h2>
                {freq && (
                  <p className="text-xl text-[#A0A0A0] italic">&ldquo;{freq}&rdquo;</p>
                )}
                {superfan.membership_tier === 'premium' && (
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#FFB627] mt-2">
                    Premium supporter
                  </p>
                )}
              </div>

              {hasTaste ? (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F72585] mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Comedy taste
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {styles.map((style, index) => (
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
              ) : mode === 'dashboard' ? (
                <div className="rounded-xl border border-dashed border-[#F72585]/35 bg-[#F72585]/5 px-4 py-4">
                  <p className="text-sm text-[#A0A0A0]">
                    Pick the{' '}
                    <span className="text-white/90">kinds of comedy you love</span> in{' '}
                    <Link href="/dashboard/profile" className="text-[#F72585] font-medium">
                      Edit Profile
                    </Link>
                    .
                  </p>
                </div>
              ) : null}

              {locals.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFB627] mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Local favorites
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {locals.map((name) => (
                      <span
                        key={name}
                        className="px-3 py-1 bg-[#FFB627]/10 border border-[#FFB627]/30 rounded-full text-[#FFB627] text-sm capitalize"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.bio && (
                <div className="bg-[#0A0A0A]/50 rounded-xl p-6 border border-[#7B2FF7]/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00F5D4] mb-3">
                    About
                  </h4>
                  <p className="text-[#E0E0E0] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}

              {!profile.bio && mode === 'dashboard' && (
                <div className="rounded-xl p-6 border border-dashed border-[#7B2FF7]/30 bg-[#7B2FF7]/5">
                  <p className="text-[#A0A0A0] text-sm">
                    Add a short bio in{' '}
                    <Link
                      href="/dashboard/profile"
                      className="text-[#7B2FF7] hover:text-[#F72585] font-medium"
                    >
                      Edit Profile
                    </Link>{' '}
                    — tell folks what you love about live comedy.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {mode === 'dashboard' && (
          <div className="px-8 py-6 border-t border-[#7B2FF7]/20 bg-gradient-to-r from-[#7B2FF7]/10 via-[#F72585]/10 to-[#7B2FF7]/10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <p className="text-sm text-[#A0A0A0] max-w-xl">
                {superfan.public_slug
                  ? 'Share your fan card — same layout as performer cards, tuned for fans.'
                  : 'Set a public URL slug in Edit Profile to share this card.'}
              </p>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {superfan.public_slug && (
                  <Link href={`/superfans/${superfan.public_slug}`} className="flex-1 min-w-[140px] sm:flex-none">
                    <Button variant="secondary" className="w-full">
                      View public card
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard/profile" className="flex-1 min-w-[140px] sm:flex-none">
                  <Button className="w-full bg-gradient-to-r from-[#7B2FF7] to-[#F72585]">
                    Edit fan card
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
