'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Building2, Star, MessageSquare, MapPin, Users, TrendingUp, Check, ArrowRight, Calendar, Award } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { US_STATES } from '@/types'

// Mock hosts data
const mockHosts = [
  {
    id: '1',
    name: 'Mike Johnson',
    avatar: 'MJ',
    location: 'Los Angeles, CA',
    experience_years: 5,
    shows_hosted: 250,
    rating: 4.9,
    reviews_count: 89,
    bio: 'Professional comedian and host with experience running successful open mics at major LA venues.',
    specialties: ['Open Mics', 'Showcases', 'Corporate Events'],
    available: true,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'SC',
    location: 'New York, NY',
    experience_years: 3,
    shows_hosted: 150,
    rating: 4.8,
    reviews_count: 67,
    bio: 'NYC-based host specializing in creating welcoming environments for new comics.',
    specialties: ['Open Mics', 'New Comic Showcases'],
    available: true,
  },
  {
    id: '3',
    name: 'Marcus Williams',
    avatar: 'MW',
    location: 'Chicago, IL',
    experience_years: 7,
    shows_hosted: 400,
    rating: 4.9,
    reviews_count: 156,
    bio: 'Chicago comedy veteran who has built and managed multiple successful open mic nights.',
    specialties: ['Open Mics', 'Comedy Nights', 'Festival Programming'],
    available: false,
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: 'ER',
    location: 'Austin, TX',
    experience_years: 4,
    shows_hosted: 200,
    rating: 4.7,
    reviews_count: 78,
    bio: 'Austin comedy scene staple known for high-energy hosting and excellent crowd engagement.',
    specialties: ['Open Mics', 'Bar Shows', 'Alternative Comedy'],
    available: true,
  },
]

// Mock promoters data
const mockPromoters = [
  {
    id: '1',
    name: 'Comedy Collective LA',
    contact: 'Jake Martinez',
    avatar: 'CC',
    location: 'Los Angeles, CA',
    venues_worked: 15,
    rating: 4.8,
    bio: 'Full-service comedy promotion agency helping venues launch and grow successful comedy programs.',
    services: ['Marketing', 'Booking', 'Show Production'],
  },
  {
    id: '2',
    name: 'NYC Laughs Promotions',
    contact: 'Amanda Lee',
    avatar: 'NL',
    location: 'New York, NY',
    venues_worked: 22,
    rating: 4.9,
    bio: 'Premier comedy promotion company in the tri-state area with connections to top talent.',
    services: ['Talent Booking', 'Social Media', 'Event Planning'],
  },
]

const benefits = [
  {
    icon: Users,
    title: 'Attract New Customers',
    description: 'Comedy nights bring in crowds who stay for food and drinks, boosting your revenue.',
  },
  {
    icon: Calendar,
    title: 'Fill Slow Nights',
    description: 'Turn your quietest nights into your busiest with regular comedy programming.',
  },
  {
    icon: TrendingUp,
    title: 'Build Community',
    description: 'Create a loyal following of comedy fans who return week after week.',
  },
  {
    icon: Award,
    title: 'Stand Out',
    description: 'Differentiate your venue from competitors with unique entertainment options.',
  },
]

export default function ForVenuesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [activeTab, setActiveTab] = useState<'hosts' | 'promoters'>('hosts')

  const filteredHosts = mockHosts.filter((host) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !host.name.toLowerCase().includes(query) &&
        !host.location.toLowerCase().includes(query) &&
        !host.specialties.some((s) => s.toLowerCase().includes(query))
      ) {
        return false
      }
    }
    if (selectedState) {
      const state = host.location.split(', ')[1]
      if (state !== selectedState) return false
    }
    return true
  })

  const filteredPromoters = mockPromoters.filter((promoter) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !promoter.name.toLowerCase().includes(query) &&
        !promoter.location.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    if (selectedState) {
      const state = promoter.location.split(', ')[1]
      if (state !== selectedState) return false
    }
    return true
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-[#F72585]/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-[#FFB627]/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="warning" className="mb-4">For Venues</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Bring{' '}
                <span className="bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                  Live Comedy
                </span>{' '}
                to Your Venue
              </h1>
              <p className="text-lg text-[#A0A0A0] mb-8">
                Connect with experienced hosts and promoters to launch a successful comedy night. 
                We&apos;ll help you find the right talent to bring the laughs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?role=venue">
                  <Button className="bg-gradient-to-r from-[#F72585] to-[#FFB627]">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="secondary">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F72585] to-[#FFB627] rounded-3xl blur-xl opacity-20" />
              <Card variant="glass" hover={false} className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                      500+
                    </div>
                    <p className="text-sm text-[#A0A0A0] mt-1">Verified Hosts</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                      50
                    </div>
                    <p className="text-sm text-[#A0A0A0] mt-1">States Covered</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                      98%
                    </div>
                    <p className="text-sm text-[#A0A0A0] mt-1">Satisfaction Rate</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                      2K+
                    </div>
                    <p className="text-sm text-[#A0A0A0] mt-1">Shows Launched</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-[#F72585]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Add Comedy to Your Venue?
            </h2>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Comedy nights are proven to increase revenue and create loyal customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} variant="gradient" className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F72585]/20 to-[#FFB627]/20 flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-[#F72585]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-[#A0A0A0]">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Find Hosts & Promoters */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Find Your Perfect Match
            </h2>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Browse experienced hosts and promoters in your area ready to help launch your comedy night.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, location, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7]"
              >
                <option value="">All States</option>
                {US_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('hosts')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'hosts'
                  ? 'bg-gradient-to-r from-[#F72585] to-[#FFB627] text-white'
                  : 'bg-[#1A0033]/30 text-[#A0A0A0] hover:text-white'
              }`}
            >
              Comedy Hosts
            </button>
            <button
              onClick={() => setActiveTab('promoters')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'promoters'
                  ? 'bg-gradient-to-r from-[#F72585] to-[#FFB627] text-white'
                  : 'bg-[#1A0033]/30 text-[#A0A0A0] hover:text-white'
              }`}
            >
              Promoters
            </button>
          </div>

          {/* Hosts Grid */}
          {activeTab === 'hosts' && (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredHosts.map((host) => (
                <Card key={host.id} variant="gradient" className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F72585] to-[#FFB627] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {host.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white group-hover:text-[#F72585] transition-colors">
                          {host.name}
                        </h3>
                        {host.available ? (
                          <Badge variant="success" size="sm">Available</Badge>
                        ) : (
                          <Badge variant="default" size="sm">Booked</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#A0A0A0] mb-2">
                        <MapPin className="w-4 h-4" />
                        {host.location}
                      </div>
                      <p className="text-sm text-[#A0A0A0] mb-3 line-clamp-2">
                        {host.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {host.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-xs px-2 py-1 rounded-full bg-[#F72585]/10 text-[#F72585]"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-[#FFB627]">
                            <Star className="w-4 h-4 fill-current" />
                            {host.rating}
                          </span>
                          <span className="text-[#A0A0A0]">
                            {host.shows_hosted} shows
                          </span>
                          <span className="text-[#A0A0A0]">
                            {host.experience_years} yrs exp
                          </span>
                        </div>
                        <Button size="sm" variant="secondary">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Promoters Grid */}
          {activeTab === 'promoters' && (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPromoters.map((promoter) => (
                <Card key={promoter.id} variant="gradient" className="group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {promoter.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-[#7B2FF7] transition-colors mb-1">
                        {promoter.name}
                      </h3>
                      <p className="text-sm text-[#A0A0A0] mb-1">Contact: {promoter.contact}</p>
                      <div className="flex items-center gap-2 text-sm text-[#A0A0A0] mb-3">
                        <MapPin className="w-4 h-4" />
                        {promoter.location}
                      </div>
                      <p className="text-sm text-[#A0A0A0] mb-3 line-clamp-2">
                        {promoter.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {promoter.services.map((service) => (
                          <span
                            key={service}
                            className="text-xs px-2 py-1 rounded-full bg-[#7B2FF7]/10 text-[#7B2FF7]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-[#FFB627]">
                            <Star className="w-4 h-4 fill-current" />
                            {promoter.rating}
                          </span>
                          <span className="text-[#A0A0A0]">
                            {promoter.venues_worked} venues
                          </span>
                        </div>
                        <Button size="sm" variant="secondary">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {(activeTab === 'hosts' ? filteredHosts : filteredPromoters).length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F72585]/10 flex items-center justify-center">
                <Building2 className="w-10 h-10 text-[#F72585]/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-[#A0A0A0]">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-[#7B2FF7]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Three simple steps to bring comedy to your venue.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and tell us about your venue, capacity, and availability.',
              },
              {
                step: '02',
                title: 'Connect with Hosts',
                description: 'Browse profiles, read reviews, and message hosts in your area.',
              },
              {
                step: '03',
                title: 'Launch Your Show',
                description: 'Work with your host to plan, promote, and run your first comedy night.',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#F72585]/20 to-[#FFB627]/20 flex items-center justify-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[#A0A0A0]">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#F72585]/30 to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/signup?role=venue">
              <Button size="lg" className="bg-gradient-to-r from-[#F72585] to-[#FFB627]">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

