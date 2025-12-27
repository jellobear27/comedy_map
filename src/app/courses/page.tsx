'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, BookOpen, Clock, Star, Users, Play, Filter, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// Mock courses data
const mockCourses = [
  {
    id: '1',
    title: 'Joke Writing Mastery',
    description: 'Learn the fundamentals of crafting killer jokes that get laughs every time.',
    instructor: 'Dave Thompson',
    instructor_avatar: 'DT',
    price: 79,
    original_price: 129,
    skill_level: 'beginner',
    lessons_count: 24,
    duration_hours: 8,
    enrolled_count: 2340,
    rating: 4.9,
    reviews_count: 456,
    topics: ['Joke Structure', 'Punchlines', 'Callbacks', 'Setups'],
    featured: true,
  },
  {
    id: '2',
    title: 'Crowd Work Secrets',
    description: 'Master the art of interacting with your audience and handling any situation.',
    instructor: 'Maria Santos',
    instructor_avatar: 'MS',
    price: 99,
    skill_level: 'intermediate',
    lessons_count: 18,
    duration_hours: 6,
    enrolled_count: 1890,
    rating: 4.8,
    reviews_count: 312,
    topics: ['Reading the Room', 'Heckler Management', 'Improvisation'],
    featured: true,
  },
  {
    id: '3',
    title: 'From Open Mic to Headliner',
    description: 'A complete roadmap for turning your comedy hobby into a career.',
    instructor: 'James Wilson',
    instructor_avatar: 'JW',
    price: 149,
    skill_level: 'advanced',
    lessons_count: 32,
    duration_hours: 12,
    enrolled_count: 1245,
    rating: 4.9,
    reviews_count: 234,
    topics: ['Building Sets', 'Booking Shows', 'Marketing', 'Industry'],
    featured: true,
  },
  {
    id: '4',
    title: 'Stage Presence & Delivery',
    description: 'Command the stage with confidence and deliver your material with impact.',
    instructor: 'Lisa Chen',
    instructor_avatar: 'LC',
    price: 69,
    skill_level: 'beginner',
    lessons_count: 15,
    duration_hours: 5,
    enrolled_count: 3120,
    rating: 4.7,
    reviews_count: 521,
    topics: ['Body Language', 'Timing', 'Voice Control', 'Energy'],
  },
  {
    id: '5',
    title: 'Writing Your First Hour',
    description: 'Build a complete hour of material that showcases your unique voice.',
    instructor: 'Marcus Brown',
    instructor_avatar: 'MB',
    price: 129,
    skill_level: 'intermediate',
    lessons_count: 28,
    duration_hours: 10,
    enrolled_count: 890,
    rating: 4.8,
    reviews_count: 178,
    topics: ['Material Development', 'Theme Building', 'Set Construction'],
  },
  {
    id: '6',
    title: 'Comedy Business 101',
    description: 'Learn the business side of comedy - from contracts to taxes.',
    instructor: 'Rachel Kim',
    instructor_avatar: 'RK',
    price: 89,
    skill_level: 'intermediate',
    lessons_count: 20,
    duration_hours: 7,
    enrolled_count: 678,
    rating: 4.6,
    reviews_count: 134,
    topics: ['Contracts', 'Taxes', 'Agents', 'Networking'],
  },
]

const skillLevelColors: Record<string, 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredCourses = mockCourses.filter((course) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !course.title.toLowerCase().includes(query) &&
        !course.instructor.toLowerCase().includes(query) &&
        !course.topics.some((t) => t.toLowerCase().includes(query))
      ) {
        return false
      }
    }
    if (selectedLevel && course.skill_level !== selectedLevel) return false
    return true
  })

  const featuredCourses = filteredCourses.filter((c) => c.featured)
  const allCourses = filteredCourses

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] bg-[#F72585]/15 rounded-full blur-[128px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-[#7B2FF7]/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="danger" className="mb-4">Learn from the Best</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Comedy{' '}
              <span className="bg-gradient-to-r from-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
                Courses
              </span>
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Expert-led courses covering everything from joke writing to building your comedy career.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search courses, instructors, or topics..."
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

            {showFilters && (
              <Card variant="glass" className="mt-4 p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                      Skill Level
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7B2FF7]"
                    >
                      <option value="">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLevel('')}>
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && !searchQuery && !selectedLevel && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Featured Courses</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <Card key={course.id} variant="gradient" className="group relative overflow-hidden">
                  {/* Course Thumbnail */}
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-[#7B2FF7]/30 to-[#F72585]/30 mb-4 flex items-center justify-center relative overflow-hidden">
                    <BookOpen className="w-16 h-16 text-[#F72585]/30" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  <Badge variant={skillLevelColors[course.skill_level]} size="sm" className="mb-3 capitalize">
                    {course.skill_level}
                  </Badge>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#7B2FF7] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[#A0A0A0] mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-white text-xs font-semibold">
                      {course.instructor_avatar}
                    </div>
                    <span className="text-sm text-[#A0A0A0]">{course.instructor}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-[#A0A0A0] mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons_count} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration_hours}h
                    </span>
                    <span className="flex items-center gap-1 text-[#FFB627]">
                      <Star className="w-4 h-4 fill-current" />
                      {course.rating}
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#7B2FF7]/20">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">${course.price}</span>
                      {course.original_price && (
                        <span className="text-sm text-[#A0A0A0] line-through">${course.original_price}</span>
                      )}
                    </div>
                    <Button size="sm">Enroll Now</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Courses */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {searchQuery || selectedLevel ? 'Search Results' : 'All Courses'}
            </h2>
            <p className="text-[#A0A0A0]">
              <span className="text-white font-medium">{allCourses.length}</span> courses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map((course) => (
              <Card key={course.id} variant="default" className="group">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-[#7B2FF7]/20 to-[#F72585]/20 mb-4 flex items-center justify-center relative overflow-hidden">
                  <BookOpen className="w-12 h-12 text-[#F72585]/30" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <Badge variant={skillLevelColors[course.skill_level]} size="sm" className="mb-3 capitalize">
                  {course.skill_level}
                </Badge>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#7B2FF7] transition-colors">
                  {course.title}
                </h3>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-white text-xs font-semibold">
                    {course.instructor_avatar}
                  </div>
                  <span className="text-sm text-[#A0A0A0]">{course.instructor}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-[#A0A0A0] mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.lessons_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration_hours}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {course.enrolled_count.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-[#FFB627]">
                    <Star className="w-3 h-3 fill-current" />
                    {course.rating}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#7B2FF7]/20">
                  <span className="text-xl font-bold text-white">${course.price}</span>
                  <Link href={`/courses/${course.id}`}>
                    <Button size="sm" variant="secondary">
                      View Course
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {allCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F72585]/10 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-[#F72585]/50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
              <p className="text-[#A0A0A0]">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Become an Instructor CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="gradient" hover={false} className="p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#F72585]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="warning" className="mb-4">Share Your Knowledge</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Become an Instructor
                </h2>
                <p className="text-lg text-[#A0A0A0] mb-6">
                  Have years of comedy experience? Share your knowledge with the next generation of comedians 
                  and earn money doing what you love.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Keep 85% of your course revenue',
                    'Full creative control over your content',
                    'Built-in audience of eager learners',
                    'Professional tools and support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[#A0A0A0]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFB627]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-[#F72585] to-[#FFB627]">
                  Apply to Teach
                </Button>
              </div>
              <div className="hidden lg:block">
                <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-[#F72585]/20 to-[#FFB627]/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent mb-2">
                      $50K+
                    </div>
                    <p className="text-[#A0A0A0]">Avg. instructor earnings/year</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

