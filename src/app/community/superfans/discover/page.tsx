'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Heart, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type DiscoverRow = {
  id: string
  full_name: string | null
  city: string | null
  state: string | null
  profile_photo_url: string | null
  avatar_url: string | null
  superfan_profiles: {
    public_slug: string | null
    card_like_count: number | null
    preferred_comedy_styles: string[] | null
    favorite_local_names: string[] | null
  } | null
}

export default function SuperfanDiscoverPage() {
  const [rows, setRows] = useState<DiscoverRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select(
          `
          id,
          full_name,
          city,
          state,
          profile_photo_url,
          avatar_url,
          superfan_profiles (
            public_slug,
            card_like_count,
            preferred_comedy_styles,
            favorite_local_names
          )
        `
        )
        .eq('role', 'superfan')
        .eq('is_public', true)

      if (cancelled) return

      if (error) {
        console.error(error)
        setRows([])
      } else {
        const filtered = ((data ?? []) as DiscoverRow[]).filter((r) => {
          const slug = r.superfan_profiles?.public_slug?.trim()
          return !!slug
        })
        filtered.sort((a, b) => {
          const ca = a.superfan_profiles?.card_like_count ?? 0
          const cb = b.superfan_profiles?.card_like_count ?? 0
          if (cb !== ca) return cb - ca
          return (a.full_name ?? '').localeCompare(b.full_name ?? '')
        })
        setRows(filtered)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen pb-16">
      <section className="relative py-14 lg:py-20 overflow-hidden border-b border-[#7B2FF7]/15">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[480px] h-[360px] bg-[#00F5D4]/12 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[280px] bg-[#F72585]/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-[#00F5D4] mb-3 uppercase tracking-wider">Superfans</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Browse public fan cards
          </h1>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto mb-8">
            Find people who love the same scenes and locals. Like cards to show love — connect on Instagram when
            someone opts in.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/community/superfans"
              className="text-sm text-[#A0A0A0] hover:text-white transition-colors"
            >
              ← Superfan Zone
            </Link>
            <Link href="/community/roast-me" className="text-sm text-[#F72585] hover:text-[#FF6B6B] transition-colors">
              Roast Me
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 text-[#00F5D4] animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-center text-[#A0A0A0] py-16">
            No public fan cards yet. Set a URL slug and turn on public profile in{' '}
            <Link href="/dashboard/profile" className="text-[#7B2FF7] hover:text-[#F72585]">
              Edit Profile
            </Link>
            .
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((r) => {
              const slug = r.superfan_profiles?.public_slug as string
              const photo = r.profile_photo_url || r.avatar_url
              const styles = r.superfan_profiles?.preferred_comedy_styles ?? []
              const locals = r.superfan_profiles?.favorite_local_names ?? []
              const likes = r.superfan_profiles?.card_like_count ?? 0
              const location = [r.city, r.state].filter(Boolean).join(', ')
              return (
                <Link
                  key={r.id}
                  href={`/superfans/${slug}`}
                  className="group rounded-2xl border border-[#7B2FF7]/25 bg-[#0a0a0c]/90 hover:border-[#00F5D4]/40 hover:bg-[#0f0f12] transition-all overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] relative bg-gradient-to-br from-[#7B2FF7]/30 to-[#F72585]/20">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/40">
                        {(r.full_name || '?').charAt(0)}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-xs text-white">
                      <Heart className="w-3.5 h-3.5 text-[#F72585]" />
                      {likes}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-white group-hover:text-[#00F5D4] transition-colors truncate">
                      {r.full_name || 'Fan'}
                    </h2>
                    {location && (
                      <p className="text-sm text-[#A0A0A0] flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {location}
                      </p>
                    )}
                    {styles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {styles.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-[#7B2FF7]/15 border border-[#7B2FF7]/35 text-[#C8C8C8]"
                          >
                            {s}
                          </span>
                        ))}
                        {styles.length > 3 && (
                          <span className="text-[11px] text-[#666]">+{styles.length - 3}</span>
                        )}
                      </div>
                    )}
                    {locals.length > 0 && (
                      <p className="text-xs text-[#666] mt-3 line-clamp-2">
                        Into: {locals.slice(0, 4).join(', ')}
                        {locals.length > 4 ? '…' : ''}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
