import Link from 'next/link'
import { MapPin, Mic, BookOpen, Users, Zap, ArrowRight, Star, Calendar, TrendingUp } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const features = [
  {
    icon: MapPin,
    title: 'Find Open Mics',
    description: 'Discover open mics across the USA with real-time updates. Filter by location, day, and signup type.',
    gradient: 'from-[#7B2FF7] to-[#F72585]',
  },
  {
    icon: BookOpen,
    title: 'Learn & Grow',
    description: 'Access courses from established comedians. Master joke writing, crowd work, and stage presence.',
    gradient: 'from-[#F72585] to-[#FF6B6B]',
  },
  {
    icon: Users,
    title: 'Join Community',
    description: 'Connect with fellow comedians. Share advice, celebrate wins, and build lasting relationships.',
    gradient: 'from-[#FF6B6B] to-[#FFB627]',
  },
  {
    icon: Calendar,
    title: 'Plan Your Tour',
    description: 'Seamlessly book your comedy tour with integrated open mic scheduling and route planning.',
    gradient: 'from-[#00F5D4] to-[#7B2FF7]',
  },
]

const testimonials = [
  {
    quote: "NovaActa helped me find 15 open mics in my first week. I'm performing more than ever!",
    author: "Sarah K.",
    role: "Comedian, NYC",
    avatar: "SK",
  },
  {
    quote: "The courses here transformed my writing. I finally understand how to structure a killer set.",
    author: "Marcus T.",
    role: "Comedian, LA",
    avatar: "MT",
  },
  {
    quote: "As a venue owner, connecting with hosts has never been easier. Our open mic is thriving!",
    author: "The Laugh Factory",
    role: "Comedy Club, Chicago",
    avatar: "LF",
  },
]

const stats = [
  { value: '2,500+', label: 'Open Mics Listed' },
  { value: '50', label: 'States Covered' },
  { value: '15K+', label: 'Active Comedians' },
  { value: '100+', label: 'Expert Courses' },
]

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7B2FF7]/30 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F72585]/30 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F5D4]/10 rounded-full blur-[150px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(123,47,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(123,47,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B2FF7]/10 border border-[#7B2FF7]/30 mb-8 animate-float">
            <Zap className="w-4 h-4 text-[#7B2FF7]" />
            <span className="text-sm font-medium text-[#7B2FF7]">The Future of Comedy Discovery</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight mb-6">
            <span className="text-white">Your Stage.</span>
            <br />
            <span className="bg-gradient-to-r from-[#7B2FF7] via-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
              Your Spotlight.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#A0A0A0] max-w-2xl mx-auto mb-10">
            Discover open mics, learn from the best, and connect with comedians across the USA. 
            Your comedy journey starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/open-mics">
              <Button variant="secondary" size="lg">
                <MapPin className="w-5 h-5 mr-2" />
                Find Open Mics
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#7B2FF7] to-[#F72585] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-[#A0A0A0] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#7B2FF7]/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#7B2FF7] rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-[#7B2FF7] to-[#F72585] bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Whether you&apos;re a first-timer or a touring pro, we&apos;ve got the tools to elevate your comedy career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} variant="gradient" className="group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" 
                  style={{ background: `linear-gradient(135deg, var(--electric-violet), var(--hot-magenta))` }} 
                />
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[#A0A0A0]">{feature.description}</p>
                <div className="mt-4 flex items-center text-[#7B2FF7] font-medium group-hover:text-[#F72585] transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Comedians Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7B2FF7]/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <Badge variant="success" className="mb-4">For Comedians</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Find Your Next Stage,{' '}
                <span className="bg-gradient-to-r from-[#00F5D4] to-[#7B2FF7] bg-clip-text text-transparent">
                  Anywhere in the USA
                </span>
              </h2>
              <p className="text-lg text-[#A0A0A0] mb-8">
                Search our comprehensive database of open mics by city, state, or zip code. 
                Filter by day of the week, signup type, and more. Plan your tour with confidence.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Real-time open mic listings updated daily',
                  'Detailed venue info including parking and transit',
                  'Community ratings and reviews',
                  'Save favorites and build your tour route',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00F5D4]/20 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-[#00F5D4]" />
                    </div>
                    <span className="text-[#A0A0A0]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup?role=comedian">
                <Button>
                  Join as Comedian
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Feature Preview Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7B2FF7] to-[#F72585] rounded-3xl blur-xl opacity-20" />
              <Card variant="glass" hover={false} className="relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Open Mics Near You</h3>
                  <Badge variant="success">Live</Badge>
                </div>
                
                {/* Mock search results */}
                {[
                  { name: 'The Comedy Store', city: 'Los Angeles, CA', day: 'Monday', time: '8:00 PM', spots: 12 },
                  { name: 'Gotham Comedy Club', city: 'New York, NY', day: 'Tuesday', time: '7:00 PM', spots: 8 },
                  { name: 'The Laugh Factory', city: 'Chicago, IL', day: 'Wednesday', time: '9:00 PM', spots: 15 },
                ].map((mic, i) => (
                  <div key={mic.name} className={`flex items-center justify-between py-4 ${i !== 2 ? 'border-b border-[#7B2FF7]/20' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B2FF7]/30 to-[#F72585]/30 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-[#F72585]" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{mic.name}</div>
                        <div className="text-sm text-[#A0A0A0]">{mic.city}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">{mic.day}</div>
                      <div className="text-sm text-[#A0A0A0]">{mic.time}</div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* For Venues Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Feature Preview */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F72585] to-[#FFB627] rounded-3xl blur-xl opacity-20" />
              <Card variant="glass" hover={false} className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Connect with Hosts</h3>
                  <Badge variant="warning">New</Badge>
                </div>
                
                {/* Mock host cards */}
                {[
                  { name: 'Mike Johnson', experience: '5 years hosting', shows: 200, rating: 4.9 },
                  { name: 'Sarah Chen', experience: '3 years hosting', shows: 150, rating: 4.8 },
                ].map((host, i) => (
                  <div key={host.name} className={`p-4 rounded-xl bg-[#7B2FF7]/10 ${i === 0 ? 'mb-4' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F72585] to-[#FFB627] flex items-center justify-center font-semibold text-white">
                          {host.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-white">{host.name}</div>
                          <div className="text-sm text-[#A0A0A0]">{host.experience}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#FFB627]">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{host.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#A0A0A0]">
                      <span>{host.shows}+ shows hosted</span>
                    </div>
                  </div>
                ))}
                
                <Button variant="secondary" className="w-full mt-4">
                  View All Hosts
                </Button>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="warning" className="mb-4">For Venues</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Start Your Open Mic,{' '}
                <span className="bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                  Find the Perfect Host
                </span>
              </h2>
              <p className="text-lg text-[#A0A0A0] mb-8">
                Interested in bringing live comedy to your venue? Connect with experienced hosts and 
                promoters in your area who can help you launch a successful open mic night.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Browse profiles of experienced comedy hosts',
                  'Read reviews from other venues',
                  'Direct messaging to discuss opportunities',
                  'List your open mic for free once established',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FFB627]/20 flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-[#FFB627]" />
                    </div>
                    <span className="text-[#A0A0A0]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/signup?role=venue">
                <Button className="bg-gradient-to-r from-[#F72585] to-[#FFB627]">
                  Join as Venue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F72585]/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="danger" className="mb-4">Courses</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Learn from the{' '}
              <span className="bg-gradient-to-r from-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
                Best in Comedy
              </span>
            </h2>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Expert-led courses covering everything from joke writing to headlining your own show.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'Joke Writing Mastery',
                instructor: 'Dave Thompson',
                level: 'Beginner',
                lessons: 24,
                rating: 4.9,
                price: 79,
              },
              {
                title: 'Crowd Work Secrets',
                instructor: 'Maria Santos',
                level: 'Intermediate',
                lessons: 18,
                rating: 4.8,
                price: 99,
              },
              {
                title: 'From Open Mic to Headliner',
                instructor: 'James Wilson',
                level: 'Advanced',
                lessons: 32,
                rating: 4.9,
                price: 149,
              },
            ].map((course) => (
              <Card key={course.title} variant="gradient">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-[#7B2FF7]/30 to-[#F72585]/30 mb-4 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-[#F72585]/50" />
                </div>
                <Badge size="sm" className="mb-3">{course.level}</Badge>
                <h3 className="text-lg font-semibold text-white mb-1">{course.title}</h3>
                <p className="text-sm text-[#A0A0A0] mb-4">by {course.instructor}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-[#A0A0A0]">
                    <span>{course.lessons} lessons</span>
                    <span className="flex items-center gap-1 text-[#FFB627]">
                      <Star className="w-3 h-3 fill-current" />
                      {course.rating}
                    </span>
                  </div>
                  <span className="font-semibold text-white">${course.price}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="secondary" size="lg">
                Browse All Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-[#7B2FF7] to-[#00F5D4] bg-clip-text text-transparent">
                Comedians Everywhere
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} variant="glass">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFB627] fill-current" />
                  ))}
                </div>
                <p className="text-white mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center font-semibold text-white text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-white">{testimonial.author}</div>
                    <div className="text-sm text-[#A0A0A0]">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#7B2FF7]/20 to-transparent rounded-full blur-[100px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Take the{' '}
            <span className="bg-gradient-to-r from-[#7B2FF7] via-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
              Stage?
            </span>
          </h2>
          <p className="text-lg text-[#A0A0A0] mb-10 max-w-2xl mx-auto">
            Join thousands of comedians and venues already using ComedyMap to grow their comedy careers and businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="animate-glow">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/open-mics">
              <Button variant="secondary" size="lg">
                Explore Open Mics
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
