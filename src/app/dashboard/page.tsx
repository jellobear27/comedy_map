'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MapPin, BookOpen, MessageSquare, Calendar, Clock, Star, 
  TrendingUp, Users, Heart, ArrowRight, Plus, Settings,
  Mic, Trophy, Target, Zap
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// Mock user data
const mockUser = {
  id: '1',
  full_name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'comedian',
  avatar: 'AJ',
  location: 'Los Angeles, CA',
  member_since: 'January 2024',
  stats: {
    mics_saved: 24,
    courses_enrolled: 3,
    community_posts: 12,
    connections: 156,
  },
}

const upcomingMics = [
  {
    id: '1',
    name: 'The Comedy Store Open Mic',
    venue: 'The Comedy Store',
    date: 'Tonight',
    time: '8:00 PM',
    status: 'confirmed',
  },
  {
    id: '2',
    name: 'Laugh Factory Wednesday',
    venue: 'The Laugh Factory',
    date: 'Wed, Dec 28',
    time: '9:00 PM',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Ice House New Comics',
    venue: 'The Ice House',
    date: 'Fri, Dec 30',
    time: '7:30 PM',
    status: 'saved',
  },
]

const activeCourses = [
  {
    id: '1',
    title: 'Joke Writing Mastery',
    instructor: 'Dave Thompson',
    progress: 68,
    next_lesson: 'Callbacks and Tags',
  },
  {
    id: '2',
    title: 'Stage Presence & Delivery',
    instructor: 'Lisa Chen',
    progress: 35,
    next_lesson: 'Body Language Basics',
  },
]

const recentActivity = [
  { type: 'mic', text: 'Saved "Gotham Comedy Club Open Mic"', time: '2 hours ago' },
  { type: 'course', text: 'Completed lesson "Punchline Techniques"', time: '1 day ago' },
  { type: 'community', text: 'Received 15 likes on your post', time: '2 days ago' },
  { type: 'connection', text: 'Connected with Sarah Chen', time: '3 days ago' },
]

const quickStats = [
  { icon: Mic, label: 'Mics This Month', value: '8', color: 'text-[#7B2FF7]', bg: 'bg-[#7B2FF7]/10' },
  { icon: Trophy, label: 'Course Progress', value: '52%', color: 'text-[#F72585]', bg: 'bg-[#F72585]/10' },
  { icon: Target, label: 'Weekly Goal', value: '4/5', color: 'text-[#00F5D4]', bg: 'bg-[#00F5D4]/10' },
  { icon: Zap, label: 'Streak', value: '12 days', color: 'text-[#FFB627]', bg: 'bg-[#FFB627]/10' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-white text-2xl font-bold">
              {mockUser.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {mockUser.full_name.split(' ')[0]}! 👋
              </h1>
              <p className="text-[#A0A0A0]">
                <MapPin className="w-4 h-4 inline mr-1" />
                {mockUser.location} · Member since {mockUser.member_since}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/settings">
              <Button variant="secondary" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link href="/open-mics">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Find Open Mics
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat) => (
            <Card key={stat.label} variant="glass" hover={false} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-[#A0A0A0]">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Open Mics */}
            <Card variant="gradient" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Upcoming Open Mics</h2>
                <Link href="/dashboard/mics" className="text-sm text-[#7B2FF7] hover:text-[#F72585]">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingMics.map((mic) => (
                  <div
                    key={mic.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#7B2FF7]/5 border border-[#7B2FF7]/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B2FF7]/30 to-[#F72585]/30 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-[#F72585]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{mic.name}</h3>
                        <p className="text-sm text-[#A0A0A0]">{mic.venue}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{mic.date}</p>
                      <p className="text-sm text-[#A0A0A0]">{mic.time}</p>
                    </div>
                    <Badge
                      variant={
                        mic.status === 'confirmed' ? 'success' :
                        mic.status === 'pending' ? 'warning' : 'default'
                      }
                      size="sm"
                    >
                      {mic.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <Link href="/open-mics">
                <Button variant="secondary" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Find More Open Mics
                </Button>
              </Link>
            </Card>

            {/* Active Courses */}
            <Card variant="gradient" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Continue Learning</h2>
                <Link href="/dashboard/courses" className="text-sm text-[#7B2FF7] hover:text-[#F72585]">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {activeCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl bg-[#F72585]/5 border border-[#F72585]/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white">{course.title}</h3>
                        <p className="text-sm text-[#A0A0A0]">by {course.instructor}</p>
                      </div>
                      <Badge variant="info" size="sm">
                        {course.progress}%
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <div className="h-2 bg-[#1A0033] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7B2FF7] to-[#F72585] rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#A0A0A0]">
                        Next: {course.next_lesson}
                      </p>
                      <Button size="sm" variant="ghost">
                        Continue
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/courses">
                <Button variant="secondary" className="w-full mt-4">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* User Stats */}
            <Card variant="glass" hover={false}>
              <h2 className="text-lg font-semibold text-white mb-4">Your Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0]">
                    <MapPin className="w-4 h-4" />
                    Saved Mics
                  </div>
                  <span className="font-semibold text-white">{mockUser.stats.mics_saved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0]">
                    <BookOpen className="w-4 h-4" />
                    Courses
                  </div>
                  <span className="font-semibold text-white">{mockUser.stats.courses_enrolled}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0]">
                    <MessageSquare className="w-4 h-4" />
                    Posts
                  </div>
                  <span className="font-semibold text-white">{mockUser.stats.community_posts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#A0A0A0]">
                    <Users className="w-4 h-4" />
                    Connections
                  </div>
                  <span className="font-semibold text-white">{mockUser.stats.connections}</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="glass" hover={false}>
              <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${activity.type === 'mic' ? 'bg-[#7B2FF7]/10' : ''}
                      ${activity.type === 'course' ? 'bg-[#F72585]/10' : ''}
                      ${activity.type === 'community' ? 'bg-[#00F5D4]/10' : ''}
                      ${activity.type === 'connection' ? 'bg-[#FFB627]/10' : ''}
                    `}>
                      {activity.type === 'mic' && <MapPin className="w-4 h-4 text-[#7B2FF7]" />}
                      {activity.type === 'course' && <BookOpen className="w-4 h-4 text-[#F72585]" />}
                      {activity.type === 'community' && <Heart className="w-4 h-4 text-[#00F5D4]" />}
                      {activity.type === 'connection' && <Users className="w-4 h-4 text-[#FFB627]" />}
                    </div>
                    <div>
                      <p className="text-sm text-white">{activity.text}</p>
                      <p className="text-xs text-[#A0A0A0]">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Links */}
            <Card variant="glass" hover={false}>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  href="/community"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-[#00F5D4]" />
                  <span className="text-[#A0A0A0] hover:text-white">Community Forum</span>
                </Link>
                <Link
                  href="/dashboard/saved"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Heart className="w-5 h-5 text-[#F72585]" />
                  <span className="text-[#A0A0A0] hover:text-white">Saved Open Mics</span>
                </Link>
                <Link
                  href="/dashboard/connections"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Users className="w-5 h-5 text-[#FFB627]" />
                  <span className="text-[#A0A0A0] hover:text-white">Connections</span>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

