'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, Clock, Filter, ChevronDown, Star, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { US_STATES } from '@/types'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Mock data for demonstration
const mockOpenMics = [
  {
    id: '1',
    name: 'The Comedy Store Open Mic',
    venue_name: 'The Comedy Store',
    address: '8433 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    day_of_week: 1,
    start_time: '20:00',
    signup_type: 'list',
    time_per_comic: 5,
    cover_charge: 0,
    rating: 4.8,
    reviews_count: 124,
  },
  {
    id: '2',
    name: 'Gotham Comedy Club New Talent',
    venue_name: 'Gotham Comedy Club',
    address: '208 W 23rd St',
    city: 'New York',
    state: 'NY',
    day_of_week: 2,
    start_time: '19:00',
    signup_type: 'online',
    time_per_comic: 4,
    cover_charge: 5,
    rating: 4.9,
    reviews_count: 89,
  },
  {
    id: '3',
    name: 'The Laugh Factory Open Mic Night',
    venue_name: 'The Laugh Factory',
    address: '3175 N Broadway',
    city: 'Chicago',
    state: 'IL',
    day_of_week: 3,
    start_time: '21:00',
    signup_type: 'bucket',
    time_per_comic: 5,
    cover_charge: 0,
    rating: 4.7,
    reviews_count: 56,
  },
  {
    id: '4',
    name: 'Helium Comedy Club Rising Stars',
    venue_name: 'Helium Comedy Club',
    address: '2031 Sansom St',
    city: 'Philadelphia',
    state: 'PA',
    day_of_week: 4,
    start_time: '19:30',
    signup_type: 'first-come',
    time_per_comic: 6,
    cover_charge: 10,
    rating: 4.6,
    reviews_count: 42,
  },
  {
    id: '5',
    name: 'Cap City Comedy Club Open Stage',
    venue_name: 'Cap City Comedy Club',
    address: '8120 Research Blvd',
    city: 'Austin',
    state: 'TX',
    day_of_week: 0,
    start_time: '18:00',
    signup_type: 'list',
    time_per_comic: 5,
    cover_charge: 0,
    rating: 4.8,
    reviews_count: 78,
  },
  {
    id: '6',
    name: 'The Ice House Comedy Playground',
    venue_name: 'The Ice House',
    address: '24 N Mentor Ave',
    city: 'Pasadena',
    state: 'CA',
    day_of_week: 5,
    start_time: '20:30',
    signup_type: 'online',
    time_per_comic: 5,
    cover_charge: 5,
    rating: 4.7,
    reviews_count: 93,
  },
]

const signupTypeLabels: Record<string, string> = {
  'first-come': 'First Come',
  'list': 'Sign-up List',
  'bucket': 'Bucket Draw',
  'online': 'Online Signup',
}

export default function OpenMicsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredMics = mockOpenMics.filter((mic) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !mic.name.toLowerCase().includes(query) &&
        !mic.city.toLowerCase().includes(query) &&
        !mic.venue_name.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    if (selectedState && mic.state !== selectedState) return false
    if (selectedDay !== null && mic.day_of_week !== selectedDay) return false
    return true
  })

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
          <div className="max-w-3xl mx-auto">
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
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <Card variant="glass" className="mt-4 p-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedState('')
                      setSelectedDay(null)
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
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
              Showing <span className="text-white font-medium">{filteredMics.length}</span> open mics
            </p>
            <select className="bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#7B2FF7]">
              <option>Sort by Relevance</option>
              <option>Sort by Rating</option>
              <option>Sort by Day</option>
              <option>Sort by City</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMics.map((mic) => (
              <Card key={mic.id} variant="gradient" className="group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[#7B2FF7] transition-colors">
                      {mic.name}
                    </h3>
                    <p className="text-sm text-[#A0A0A0]">{mic.venue_name}</p>
                  </div>
                  <Badge variant="success" size="sm">
                    {signupTypeLabels[mic.signup_type]}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                    <MapPin className="w-4 h-4 text-[#7B2FF7]" />
                    <span>{mic.city}, {mic.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                    <Calendar className="w-4 h-4 text-[#F72585]" />
                    <span>{DAYS[mic.day_of_week]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                    <Clock className="w-4 h-4 text-[#00F5D4]" />
                    <span>
                      {new Date(`2000-01-01T${mic.start_time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#7B2FF7]/20">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#FFB627] fill-current" />
                    <span className="text-sm font-medium text-white">{mic.rating}</span>
                    <span className="text-sm text-[#A0A0A0]">({mic.reviews_count})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-[#A0A0A0]" />
                    <span className="text-[#A0A0A0]">{mic.time_per_comic} min</span>
                  </div>
                </div>

                {mic.cover_charge > 0 && (
                  <div className="mt-3 text-sm text-[#FFB627]">
                    ${mic.cover_charge} cover
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredMics.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#7B2FF7]/10 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-[#7B2FF7]/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No open mics found</h3>
              <p className="text-[#A0A0A0]">Try adjusting your filters or search query</p>
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
          <Button variant="secondary">
            Submit an Open Mic
          </Button>
        </div>
      </section>
    </div>
  )
}

