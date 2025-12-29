'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Search, MapPin, Calendar, Clock, Filter, ChevronDown, Star, Users, Plus, Mic, Theater, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { US_STATES } from '@/types'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const WEEKS_OF_MONTH = [
  { value: 0, label: 'Every Week' },
  { value: 1, label: '1st Week' },
  { value: 2, label: '2nd Week' },
  { value: 3, label: '3rd Week' },
  { value: 4, label: '4th Week' },
  { value: 5, label: '5th Week' },
]

const EVENT_TYPES = [
  { value: 'open-mic', label: 'Open Mic', icon: Mic },
  { value: 'show', label: 'Show', icon: Theater },
]

// Cities by state - will be populated from data
const CITIES_BY_STATE: Record<string, string[]> = {
  CO: ['Arvada', 'Aurora', 'Boulder', 'Broomfield', 'Colorado Springs', 'Denver', 'Englewood', 'Fort Collins', 'Greeley', 'Lakewood', 'Littleton', 'Longmont', 'Loveland', 'Wellington', 'Westminster', 'Wheat Ridge'],
  CA: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'Pasadena', 'Long Beach', 'Irvine', 'Santa Monica'],
  NY: ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Buffalo', 'Rochester', 'Albany'],
  TX: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso'],
  IL: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
  // Add more states as needed
}

interface OpenMicData {
  id: string
  name: string
  venue_name?: string
  address: string
  city: string
  state: string
  day_of_week: number
  week_of_month?: number // 0 = every week, 1-5 = specific week
  start_time: string
  signup_type: string
  event_type?: 'open-mic' | 'show'
  time_per_comic?: number
  cover_charge?: number
  rating?: number
  reviews_count?: number
  frequency?: string
  is_active?: boolean
}

const signupTypeLabels: Record<string, string> = {
  'first-come': 'First Come',
  'list': 'Sign-up List',
  'bucket': 'Bucket Draw',
  'online': 'Online Signup',
}

export default function OpenMicsPage() {
  const [openMics, setOpenMics] = useState<OpenMicData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [selectedEventType, setSelectedEventType] = useState<string>('')
  const [showFilters, setShowFilters] = useState(true)

  // Load open mics from Supabase
  useEffect(() => {
    const loadOpenMics = async () => {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('open_mics')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
      
      if (!error && data) {
        setOpenMics(data as OpenMicData[])
      }
      setIsLoading(false)
    }
    loadOpenMics()
  }, [])

  // Get available cities based on selected state
  const availableCities = useMemo(() => {
    if (!selectedState) return []
    
    // First check our predefined list
    if (CITIES_BY_STATE[selectedState]) {
      return CITIES_BY_STATE[selectedState]
    }
    
    // Otherwise, get unique cities from the data
    const citiesFromData = [...new Set(
      openMics
        .filter(mic => mic.state === selectedState)
        .map(mic => mic.city)
    )].sort()
    
    return citiesFromData
  }, [selectedState, openMics])

  // Reset city when state changes
  useEffect(() => {
    setSelectedCity('')
  }, [selectedState])

  // Filter open mics
  const filteredMics = useMemo(() => {
    return openMics.filter((mic) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !mic.name.toLowerCase().includes(query) &&
          !mic.city.toLowerCase().includes(query) &&
          !(mic.venue_name?.toLowerCase().includes(query))
        ) {
          return false
        }
      }
      // State filter
      if (selectedState && mic.state !== selectedState) return false
      // City filter
      if (selectedCity && mic.city !== selectedCity) return false
      // Day of week filter
      if (selectedDay !== null && mic.day_of_week !== selectedDay) return false
      // Week of month filter
      if (selectedWeek !== null) {
        // 0 means "every week" - show all weekly mics
        if (selectedWeek === 0) {
          if (mic.week_of_month && mic.week_of_month !== 0) return false
        } else {
          if (mic.week_of_month !== selectedWeek && mic.week_of_month !== 0) return false
        }
      }
      // Event type filter
      if (selectedEventType && mic.event_type !== selectedEventType) return false
      
      return true
    })
  }, [openMics, searchQuery, selectedState, selectedCity, selectedDay, selectedWeek, selectedEventType])

  // Count active filters
  const activeFilterCount = [
    selectedState,
    selectedCity,
    selectedDay !== null,
    selectedWeek !== null,
    selectedEventType,
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSelectedState('')
    setSelectedCity('')
    setSelectedDay(null)
    setSelectedWeek(null)
    setSelectedEventType('')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7B2FF7]/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">Find Your Stage</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Open Mics{' '}
              <span className="bg-gradient-to-r from-[#7B2FF7] to-[#00F5D4] bg-clip-text text-transparent">
                Across the USA
              </span>
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Discover open mics in your area or plan your comedy tour with our comprehensive database.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by city, venue, or mic name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#7B2FF7] text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Enhanced Filters Panel */}
            {showFilters && (
              <Card variant="glass" className="mt-4 p-6">
                {/* Event Type Toggle */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-3">
                    Event Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedEventType(selectedEventType === '' ? '' : '')}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                        selectedEventType === ''
                          ? 'border-[#7B2FF7] bg-[#7B2FF7]/10 text-white'
                          : 'border-[#7B2FF7]/20 text-[#A0A0A0] hover:border-[#7B2FF7]/50'
                      }`}
                    >
                      All Events
                    </button>
                    {EVENT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedEventType(selectedEventType === type.value ? '' : type.value)}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                          selectedEventType === type.value
                            ? 'border-[#7B2FF7] bg-[#7B2FF7]/10 text-white'
                            : 'border-[#7B2FF7]/20 text-[#A0A0A0] hover:border-[#7B2FF7]/50'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Filters */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                      State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7]"
                    >
                      <option value="">All States</option>
                      {US_STATES.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                      City
                      {!selectedState && <span className="text-[#7B2FF7]/50 ml-2">(select state first)</span>}
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedState}
                      className="w-full bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">All Cities</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Filters */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                      Day of Week
                    </label>
                    <select
                      value={selectedDay ?? ''}
                      onChange={(e) => setSelectedDay(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7]"
                    >
                      <option value="">Any Day</option>
                      {DAYS.map((day, index) => (
                        <option key={day} value={index}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                      Week of Month
                    </label>
                    <select
                      value={selectedWeek ?? ''}
                      onChange={(e) => setSelectedWeek(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7]"
                    >
                      <option value="">Any Week</option>
                      {WEEKS_OF_MONTH.map((week) => (
                        <option key={week.value} value={week.value}>
                          {week.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters & Clear */}
                {activeFilterCount > 0 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#7B2FF7]/20">
                    <div className="flex flex-wrap gap-2">
                      {selectedState && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#7B2FF7]/20 text-[#7B2FF7] rounded-full text-sm">
                          {US_STATES.find(s => s.value === selectedState)?.label}
                          <button onClick={() => setSelectedState('')} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedCity && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F72585]/20 text-[#F72585] rounded-full text-sm">
                          {selectedCity}
                          <button onClick={() => setSelectedCity('')} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedDay !== null && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#00F5D4]/20 text-[#00F5D4] rounded-full text-sm">
                          {DAYS[selectedDay]}
                          <button onClick={() => setSelectedDay(null)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedWeek !== null && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFB627]/20 text-[#FFB627] rounded-full text-sm">
                          {WEEKS_OF_MONTH.find(w => w.value === selectedWeek)?.label}
                          <button onClick={() => setSelectedWeek(null)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedEventType && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#7B2FF7]/20 text-[#7B2FF7] rounded-full text-sm">
                          {EVENT_TYPES.find(t => t.value === selectedEventType)?.label}
                          <button onClick={() => setSelectedEventType('')} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#A0A0A0]">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  Showing <span className="text-white font-medium">{filteredMics.length}</span> open mics
                  {selectedState && ` in ${US_STATES.find(s => s.value === selectedState)?.label}`}
                  {selectedCity && ` • ${selectedCity}`}
                </>
              )}
            </p>
            <select className="bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#7B2FF7]">
              <option>Sort by Day</option>
              <option>Sort by City</option>
              <option>Sort by Name</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#1A0033]/40 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-[#7B2FF7]/20 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-[#7B2FF7]/10 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-[#7B2FF7]/10 rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-[#7B2FF7]/10 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMics.map((mic) => (
                <Card key={mic.id} variant="gradient" className="group cursor-pointer hover:border-[#7B2FF7]/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-[#7B2FF7] transition-colors">
                        {mic.name}
                      </h3>
                      {mic.venue_name && (
                        <p className="text-sm text-[#A0A0A0]">{mic.venue_name}</p>
                      )}
                    </div>
                    <Badge variant="success" size="sm">
                      {signupTypeLabels[mic.signup_type] || mic.signup_type}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                      <MapPin className="w-4 h-4 text-[#7B2FF7]" />
                      <span>{mic.city}, {mic.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                      <Calendar className="w-4 h-4 text-[#F72585]" />
                      <span>
                        {mic.week_of_month && mic.week_of_month > 0 
                          ? `${WEEKS_OF_MONTH.find(w => w.value === mic.week_of_month)?.label?.replace(' Week', '')} ` 
                          : ''
                        }
                        {DAYS[mic.day_of_week]}
                        {(!mic.week_of_month || mic.week_of_month === 0) && mic.frequency === 'weekly' && 's'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                      <Clock className="w-4 h-4 text-[#00F5D4]" />
                      <span>
                        {mic.start_time && new Date(`2000-01-01T${mic.start_time}`).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#7B2FF7]/20">
                    {mic.rating ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#FFB627] fill-current" />
                        <span className="text-sm font-medium text-white">{mic.rating}</span>
                        <span className="text-sm text-[#A0A0A0]">({mic.reviews_count})</span>
                      </div>
                    ) : (
                      <span className="text-sm text-[#A0A0A0]">No reviews yet</span>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#A0A0A0]" />
                      <span className="text-[#A0A0A0]">{mic.time_per_comic || 5} min</span>
                    </div>
                  </div>

                  {mic.cover_charge && mic.cover_charge > 0 && (
                    <div className="mt-3 text-sm text-[#FFB627]">
                      ${mic.cover_charge} cover
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredMics.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#7B2FF7]/10 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-[#7B2FF7]/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No open mics found</h3>
              <p className="text-[#A0A0A0] mb-6">
                {openMics.length === 0 
                  ? "We're still adding open mics to our database."
                  : "Try adjusting your filters or search query"
                }
              </p>
              <Link href="/submit-open-mic">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit an Open Mic
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Know an open mic that&apos;s not listed?
          </h2>
          <p className="text-[#A0A0A0] mb-8">
            Help the comedy community by submitting open mics in your area.
          </p>
          <Link href="/submit-open-mic">
            <Button variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Submit an Open Mic
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
