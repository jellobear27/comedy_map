'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Mic, ArrowRight } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { FEATURES } from '@/config/features'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface OpenMicRow {
  id: string
  name: string
  venue_name?: string | null
  address: string
  city: string
  state: string
  day_of_week: number
  start_time: string
}

export default function HomeMicFinder() {
  const router = useRouter()
  const [mics, setMics] = useState<OpenMicRow[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [fetchError, setFetchError] = useState<'unconfigured' | 'query' | null>(null)
  const [queryErrorMessage, setQueryErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setFetchError('unconfigured')
      setQueryErrorMessage(null)
      setMics([])
      setLoading(false)
      return
    }

    const supabase = createClient()

    const load = async () => {
      setFetchError(null)
      setQueryErrorMessage(null)
      const { data, error } = await supabase
        .from('open_mics')
        .select('id,name,address,city,state,day_of_week,start_time,is_active')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })

      if (error) {
        setFetchError('query')
        setQueryErrorMessage(error.message)
        setMics([])
      } else {
        setMics((data as OpenMicRow[]) ?? [])
      }
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('home_open_mics')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'open_mics' },
        () => {
          void load()
        }
      )
      .subscribe()

    const onVis = () => {
      if (document.visibilityState === 'visible') void load()
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      void supabase.removeChannel(channel)
    }
  }, [])

  const stats = useMemo(() => {
    const cityKeys = new Set(mics.map((m) => `${m.city}|${m.state}`))
    const states = new Set(mics.map((m) => m.state).filter(Boolean))
    return {
      listings: mics.length,
      cities: cityKeys.size,
      states: states.size,
    }
  }, [mics])

  const matchingMics = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mics
    return mics.filter((mic) => {
      return (
        mic.name.toLowerCase().includes(q) ||
        mic.city.toLowerCase().includes(q) ||
        !!(mic.venue_name && mic.venue_name.toLowerCase().includes(q)) ||
        mic.address.toLowerCase().includes(q)
      )
    })
  }, [mics, query])

  const previewRows = matchingMics.slice(0, 3)
  const searchHref =
    query.trim().length > 0
      ? `/open-mics?q=${encodeURIComponent(query.trim())}`
      : '/open-mics'

  return (
    <div id="mic-search" className="w-full max-w-2xl mx-auto space-y-5">
      {!loading && !fetchError && (
        <p className="text-sm text-[#A0A0A0]">
          <span className="text-white font-semibold">{stats.listings}</span> open mic
          {stats.listings === 1 ? '' : 's'} ·{' '}
          <span className="text-white font-semibold">{stats.cities}</span>{' '}
          {stats.cities === 1 ? 'city' : 'cities'} ·{' '}
          <span className="text-white font-semibold">{stats.states}</span>{' '}
          {stats.states === 1 ? 'state' : 'states'}
          <span className="text-[#787878] hidden sm:inline"> — live data</span>
        </p>
      )}
      {!loading && fetchError === 'unconfigured' && (
        <p className="text-sm text-amber-200/90 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          Live listings aren&apos;t connected in this environment. Add{' '}
          <code className="text-xs text-amber-100/90">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="text-xs text-amber-100/90">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{' '}
          <code className="text-xs text-amber-100/90">.env.local</code>, then restart{' '}
          <code className="text-xs text-amber-100/90">npm run dev</code>.
        </p>
      )}
      {!loading && fetchError === 'query' && (
        <p className="text-sm text-red-300/95 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3">
          Couldn&apos;t load open mics: {queryErrorMessage ?? 'Unknown error'}
          <span className="block mt-2 text-xs text-red-200/70">
            If the error says a column is missing, open the Supabase SQL Editor and run the statements in{' '}
            <code className="text-red-100/80">supabase/migrations/001_add_open_mic_fields.sql</code> (safe to re-run). Also
            confirm RLS allows public read on active mics and your anon key is for this project.
          </span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-stretch">
        <div className="flex-1">
          <Input
            placeholder="City, ZIP, venue, or mic name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push(searchHref)
            }}
            icon={<Search className="w-5 h-5" />}
            aria-label="Find open mics anywhere in the United States"
          />
        </div>
        <Button
          size="lg"
          type="button"
          className="w-full sm:w-auto sm:self-stretch min-h-[48px] px-8"
          onClick={() => router.push(searchHref)}
        >
          Find open mics in the U.S.
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <Card variant="glass" hover={false} className="border border-[#7B2FF7]/25 text-left">
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-lg font-semibold text-white">
            {query.trim() ? 'Matching mics' : 'Recent listings'}
          </p>
          {!loading && query.trim() !== '' && (
            <Badge variant="success">{matchingMics.length} match{matchingMics.length === 1 ? '' : 'es'}</Badge>
          )}
        </div>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5" />
            ))}
          </div>
        )}

        {!loading && previewRows.length === 0 && (
          <div className="space-y-4 py-1">
            <p className="text-[#A0A0A0] text-sm">
              {fetchError === 'unconfigured'
                ? 'This preview fills in once the app is pointed at your Supabase project (see the note above).'
                : fetchError === 'query'
                  ? 'Fix the load issue above to show listings in this preview.'
                  : query.trim()
                    ? 'No listings match that search—try another keyword or browse all open mics.'
                    : 'Nothing to show in this preview box yet—open the full directory or submit a mic we\'re missing.'}
            </p>
            {FEATURES.submitOpenMic && fetchError !== 'unconfigured' && (
              <p className="text-sm">
                <Link
                  href="/submit-open-mic#open-mic-form"
                  className="font-medium text-[#00F5D4] hover:text-[#33f7de] underline underline-offset-2"
                >
                  Add or fix a listing
                </Link>
              </p>
            )}
          </div>
        )}

        {!loading &&
          previewRows.map((mic, i) => (
            <div
              key={mic.id}
              className={`flex items-center justify-between gap-4 py-4 ${i !== previewRows.length - 1 ? 'border-b border-[#7B2FF7]/20' : ''}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-[#7B2FF7]/30 to-[#F72585]/30 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-[#F72585]" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">{mic.name}</div>
                  <div className="text-sm text-[#A0A0A0] truncate flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {mic.city}, {mic.state}
                      {mic.venue_name ? ` · ${mic.venue_name}` : ''}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm text-white">{DAYS[mic.day_of_week] ?? '—'}</div>
                <div className="text-xs text-[#A0A0A0]">{mic.start_time}</div>
              </div>
            </div>
          ))}

        {!loading && mics.length > 0 && (
          <div className="pt-4 mt-2 border-t border-[#7B2FF7]/20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={searchHref}
              className="inline-flex items-center text-sm font-medium text-[#7B2FF7] hover:text-[#F72585] transition-colors"
            >
              See all results
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            {FEATURES.submitOpenMic && (
              <Link
                href="/submit-open-mic#listing-changes"
                className="text-sm font-medium text-[#787878] hover:text-[#A0A0A0] transition-colors"
              >
                Wrong or outdated? Report a change
              </Link>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
