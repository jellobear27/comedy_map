'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Calendar, Filter, Check, X, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { US_STATES, COMEDY_STYLES, PERFORMANCE_TYPES } from '@/types'

interface ComedianListing {
  id: string
  username: string
  full_name: string
  headline: string
  bio: string
  city: string
  state: string
  profile_photo_url: string
  avatar_url: string
  comedy_start_date: string
  comedy_styles: string[]
  available_for_booking: boolean
  booking_rate: string
  travel_radius: string
  performance_types: string[]
}

interface ComedianProfileRow {
  id: string
  username: string | null
  headline: string | null
  comedy_start_date: string | null
  available_for_booking: boolean
  booking_rate: string | null
  travel_radius: string | null
  performance_types: string[] | null
  comedy_styles: string[] | null
}

interface ProfileRow {
  id: string
  full_name: string | null
  bio: string | null
  city: string | null
  state: string | null
  profile_photo_url: string | null
  avatar_url: string | null
  is_public: boolean
}

export default function FindTalentPage() {
  const [comedians, setComedians] = useState<ComedianListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedPerformanceType, setSelectedPerformanceType] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadComedians()
  }, [])

  const loadComedians = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Fetch comedian profiles with base profile data
      const { data: comedianProfiles } = await supabase
        .from('comedian_profiles')
        .select('*')
      
      if (!comedianProfiles) {
        setComedians([])
        return
      }

      // Fetch corresponding base profiles
      const profileIds = (comedianProfiles as ComedianProfileRow[]).map((cp: ComedianProfileRow) => cp.id)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', profileIds)
        .eq('is_public', true)

      if (!profiles) {
        setComedians([])
        return
      }

      // Merge the data
      const merged = (comedianProfiles as ComedianProfileRow[])
        .map((cp: ComedianProfileRow) => {
          const profile = (profiles as ProfileRow[]).find((p: ProfileRow) => p.id === cp.id)
          if (!profile) return null
          return {
            id: cp.id,
            username: cp.username,
            full_name: profile.full_name,
            headline: cp.headline,
            bio: profile.bio,
            city: profile.city,
            state: profile.state,
            profile_photo_url: profile.profile_photo_url,
            avatar_url: profile.avatar_url,
            comedy_start_date: cp.comedy_start_date,
            comedy_styles: cp.comedy_styles || [],
            available_for_booking: cp.available_for_booking,
            booking_rate: cp.booking_rate,
            travel_radius: cp.travel_radius,
            performance_types: cp.performance_types || [],
          }
        })
        .filter(Boolean) as ComedianListing[]

      setComedians(merged)
    } catch (error) {
      console.error('Error loading comedians:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateYears = (startDate: string) => {
    if (!startDate) return null
    return Math.floor((Date.now() - new Date(startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const filteredComedians = comedians.filter(comedian => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = comedian.full_name?.toLowerCase().includes(query)
      const matchesHeadline = comedian.headline?.toLowerCase().includes(query)
      const matchesBio = comedian.bio?.toLowerCase().includes(query)
      const matchesCity = comedian.city?.toLowerCase().includes(query)
      if (!matchesName && !matchesHeadline && !matchesBio && !matchesCity) return false
    }

    // State filter
    if (selectedState && comedian.state !== selectedState) return false

    // Comedy styles filter
    if (selectedStyles.length > 0) {
      const hasStyle = selectedStyles.some(style => comedian.comedy_styles.includes(style))
      if (!hasStyle) return false
    }

    // Performance type filter
    if (selectedPerformanceType && !comedian.performance_types.includes(selectedPerformanceType)) return false

    // Available for booking filter
    if (onlyAvailable && !comedian.available_for_booking) return false

    return true
  })

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedState('')
    setSelectedStyles([])
    setSelectedPerformanceType('')
    setOnlyAvailable(true)
  }

  const hasActiveFilters = searchQuery || selectedState || selectedStyles.length > 0 || selectedPerformanceType || !onlyAvailable

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7B2FF7]/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F72585]/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Find <span className="bg-gradient-to-r from-[#7B2FF7] to-[#F72585] bg-clip-text text-transparent">Talent</span>
          </h1>
          <p className="text-xl text-[#A0A0A0] max-w-2xl mx-auto">
            Discover comedians available for booking at your venue, event, or private party.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, or style..."
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
              >
                <option value="">All States</option>
                {US_STATES.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>

              <select
                value={selectedPerformanceType}
                onChange={(e) => setSelectedPerformanceType(e.target.value)}
                className="px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
              >
                <option value="">All Types</option>
                {PERFORMANCE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <Button
                variant={showFilters ? 'primary' : 'secondary'}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {selectedStyles.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {selectedStyles.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl">
              <div className="space-y-6">
                {/* Comedy Styles */}
                <div>
                  <label className="block text-sm font-medium text-[#E0E0E0] mb-3">Comedy Styles</label>
                  <div className="flex flex-wrap gap-2">
                    {COMEDY_STYLES.map(style => (
                      <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedStyles.includes(style)
                            ? 'bg-[#7B2FF7] text-white'
                            : 'bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#252525] border border-[#333]'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Availability */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={(e) => setOnlyAvailable(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B2FF7]"></div>
                  </label>
                  <span className="text-white">Only show comedians available for booking</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <p className="text-[#A0A0A0] mb-6">
            {isLoading ? 'Loading...' : `${filteredComedians.length} comedian${filteredComedians.length !== 1 ? 's' : ''} found`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#1A1A1A] rounded-2xl h-80" />
              ))}
            </div>
          ) : filteredComedians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComedians.map(comedian => (
                <Link
                  key={comedian.id}
                  href={comedian.username ? `/comedians/${comedian.username}` : '#'}
                  className="group"
                >
                  <Card hover className="h-full overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {comedian.profile_photo_url || comedian.avatar_url ? (
                          <img
                            src={comedian.profile_photo_url || comedian.avatar_url}
                            alt={comedian.full_name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-2xl font-bold text-white">
                            {comedian.full_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate group-hover:text-[#7B2FF7] transition-colors">
                            {comedian.full_name}
                          </h3>
                          {comedian.headline && (
                            <p className="text-sm text-[#A0A0A0] truncate">{comedian.headline}</p>
                          )}
                        </div>
                      </div>

                      {/* Location & Experience */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#A0A0A0] mb-4">
                        {(comedian.city || comedian.state) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-[#F72585]" />
                            {[comedian.city, comedian.state].filter(Boolean).join(', ')}
                          </span>
                        )}
                        {calculateYears(comedian.comedy_start_date) !== null && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-[#00F5D4]" />
                            {calculateYears(comedian.comedy_start_date)}y
                          </span>
                        )}
                      </div>

                      {/* Comedy Styles */}
                      {comedian.comedy_styles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {comedian.comedy_styles.slice(0, 3).map(style => (
                            <Badge key={style} variant="default" size="sm">
                              {style}
                            </Badge>
                          ))}
                          {comedian.comedy_styles.length > 3 && (
                            <Badge variant="default" size="sm">
                              +{comedian.comedy_styles.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Booking Info */}
                      {comedian.available_for_booking && (
                        <div className="flex items-center justify-between pt-4 border-t border-[#1A1A1A]">
                          <span className="flex items-center gap-1 text-sm text-[#00F5D4]">
                            <Check className="w-4 h-4" />
                            Available
                          </span>
                          {comedian.booking_rate && (
                            <span className="text-sm text-[#A0A0A0]">{comedian.booking_rate}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <Search className="w-10 h-10 text-[#666]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No comedians found</h3>
              <p className="text-[#A0A0A0] mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button variant="secondary" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA for Comedians */}
      <section className="py-16 border-t border-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Are you a comedian?</h2>
          <p className="text-[#A0A0A0] mb-6">
            Create your profile to get discovered by venues looking for talent.
          </p>
          <Link href="/signup">
            <Button size="lg">Create Your Profile</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

