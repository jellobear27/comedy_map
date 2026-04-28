'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Mic, ArrowRight, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('open_mics')
        .select('id,name,venue_name,address,city,state,day_of_week,start_time,is_active')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })

      if (!error && data) {
        setMics(data as OpenMicRow[])
      }
      setLoading(false)
    }
    load()
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
      {!loading && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <p className="text-sm text-[#A0A0A0]">
            <span className="text-white font-semibold">{stats.listings}</span> open mic
            {stats.listings === 1 ? '' : 's'} ·{' '}
            <span className="text-white font-semibold">{stats.cities}</span>{' '}
            {stats.cities === 1 ? 'city' : 'cities'} ·{' '}
            <span className="text-white font-semibold">{stats.states}</span>{' '}
            {stats.states === 1 ? 'state' : 'states'}
            <span className="text-[#787878] hidden sm:inline"> — listings grow when comics add them.</span>
          </p>
          {FEATURES.submitOpenMic && (
            <Link
              href="/submit-open-mic"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7B2FF7] hover:text-[#F72585] transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" aria-hidden />
              Submit a mic
            </Link>
          )}
        </div>
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
            aria-label="Find open mics near you"
          />
        </div>
        <Button
          size="lg"
          type="button"
          className="w-full sm:w-auto sm:self-stretch min-h-[48px] px-8"
          onClick={() => router.push(searchHref)}
        >
          Find open mics near you
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
          <p className="text-[#A0A0A0] text-sm py-2">
            {query.trim()
              ? 'No listings match that search yet—try another city or browse all mics.'
              : 'No active listings yet. Be the first to add your open mic.'}
          </p>
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
          <div className="pt-4 mt-2 border-t border-[#7B2FF7]/20">
            <Link
              href={searchHref}
              className="inline-flex items-center text-sm font-medium text-[#7B2FF7] hover:text-[#F72585] transition-colors"
            >
              See all results
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
