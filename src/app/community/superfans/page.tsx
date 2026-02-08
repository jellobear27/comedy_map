'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, MessageSquare, Heart, Share2, Bookmark, TrendingUp, Clock, 
  Users, Plus, Calendar, MapPin, Star, Sparkles, Trophy, Ticket
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// Mock superfan posts
const mockPosts = [
  {
    id: '1',
    title: "Who's going to The Comedy Store this Saturday?! 🎭",
    content: "Just got my tickets for the Saturday showcase - heard they have some amazing headliners this week! Anyone else going? Would love to meet up before the show!",
    author: 'ComedyLover42',
    author_avatar: 'CL',
    author_badges: ['🌟', '🔥'],
    category: 'event-hype',
    tags: ['LA', 'saturday', 'comedy-store'],
    likes_count: 89,
    comments_count: 34,
    created_at: '1 hour ago',
    is_pinned: true,
  },
  {
    id: '2',
    title: 'Just saw the BEST set of my life last night',
    content: "Went to an open mic in Brooklyn and this new comic absolutely KILLED. I was crying laughing. This is why I love going to shows - you never know who you'll discover!",
    author: 'StandupAddict',
    author_avatar: 'SA',
    author_badges: ['👑', '✍️'],
    category: 'show-review',
    tags: ['NYC', 'open-mic', 'discovery'],
    likes_count: 156,
    comments_count: 42,
    created_at: '3 hours ago',
  },
  {
    id: '3',
    title: 'Tips for getting front row seats?',
    content: "I always seem to end up in the back. What are your strategies for snagging those prime front row spots? Do you just show up super early?",
    author: 'NewFan2024',
    author_avatar: 'NF',
    author_badges: ['🎭'],
    category: 'question',
    tags: ['tips', 'seating', 'help'],
    likes_count: 67,
    comments_count: 28,
    created_at: '5 hours ago',
  },
  {
    id: '4',
    title: 'Chicago Comedy Week lineup is INSANE 🔥',
    content: "Just saw the full lineup announcement. SO many of my favorite comics are performing. Already requested time off work. Who else is planning to go all week?",
    author: 'WindyCityLaughs',
    author_avatar: 'WC',
    author_badges: ['🌟', '🦋'],
    category: 'event-hype',
    tags: ['Chicago', 'festival', 'lineup'],
    likes_count: 234,
    comments_count: 67,
    created_at: '8 hours ago',
  },
  {
    id: '5',
    title: 'Rate my comedy show bucket list!',
    content: "1. See Dave Chappelle live ✅\n2. Catch a taping of a Netflix special\n3. Go to the Just for Laughs festival\n4. Sit front row and get roasted\n5. Meet my favorite comic after a show",
    author: 'BucketListFan',
    author_avatar: 'BL',
    author_badges: ['⭐'],
    category: 'discussion',
    tags: ['bucket-list', 'goals', 'experiences'],
    likes_count: 178,
    comments_count: 52,
    created_at: '1 day ago',
  },
]

// Upcoming events for the sidebar
const upcomingEvents = [
  { name: 'Saturday Night Showcase', venue: 'The Comedy Store', city: 'LA', date: 'Sat, Feb 8', hypes: 45 },
  { name: 'Open Mic Night', venue: 'Gotham Comedy Club', city: 'NYC', date: 'Tue, Feb 11', hypes: 23 },
  { name: 'Chicago Comedy Week', venue: 'Multiple Venues', city: 'Chicago', date: 'Feb 15-22', hypes: 156 },
]

const categories = [
  { value: '', label: 'All Posts', icon: MessageSquare },
  { value: 'event-hype', label: 'Event Hype 🔥', icon: Sparkles },
  { value: 'show-review', label: 'Show Reviews', icon: Star },
  { value: 'discussion', label: 'Discussion', icon: Users },
  { value: 'question', label: 'Questions', icon: MessageSquare },
]

const categoryColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  'event-hype': 'warning',
  'show-review': 'success',
  discussion: 'default',
  question: 'info',
}

export default function SuperfanCommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('trending')

  const filteredPosts = mockPosts.filter((post) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !post.title.toLowerCase().includes(query) &&
        !post.content.toLowerCase().includes(query) &&
        !post.tags.some((t) => t.toLowerCase().includes(query))
      ) {
        return false
      }
    }
    if (selectedCategory && post.category !== selectedCategory) return false
    return true
  })

  const pinnedPosts = filteredPosts.filter((p) => p.is_pinned)
  const regularPosts = filteredPosts.filter((p) => !p.is_pinned)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[400px] bg-[#00F5D4]/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[300px] bg-[#FFB627]/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">
              <Heart className="w-3 h-3 mr-1" />
              Superfan Zone
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Comedy{' '}
              <span className="bg-gradient-to-r from-[#00F5D4] via-[#FFB627] to-[#F72585] bg-clip-text text-transparent">
                Superfans
              </span>
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Connect with fellow comedy lovers. Hype upcoming shows, share reviews, and celebrate the art of standup together.
            </p>
          </div>

          {/* Forum Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/community">
              <Button variant="secondary" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                General Forum
              </Button>
            </Link>
            <Button size="sm" className="bg-gradient-to-r from-[#00F5D4] to-[#7B2FF7]">
              <Heart className="w-4 h-4 mr-2" />
              Superfan Zone
            </Button>
          </div>

          {/* Search and Create */}
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search hypes, reviews, discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-[#00F5D4] to-[#7B2FF7]">
              <Plus className="w-5 h-5" />
              New Post
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Categories */}
              <Card variant="glass" hover={false}>
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
                        ${selectedCategory === cat.value
                          ? 'bg-[#00F5D4]/20 text-white'
                          : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Hot Events 🔥</h3>
                  <Link href="/open-mics" className="text-xs text-[#00F5D4] hover:underline">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.name} className="p-3 rounded-xl bg-[#00F5D4]/5 border border-[#00F5D4]/20">
                      <div className="font-medium text-white text-sm mb-1">{event.name}</div>
                      <div className="flex items-center gap-2 text-xs text-[#A0A0A0] mb-2">
                        <MapPin className="w-3 h-3" />
                        {event.venue}, {event.city}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#00F5D4]">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {event.date}
                        </span>
                        <span className="text-xs text-[#FFB627]">
                          🔥 {event.hypes} hyped
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Premium Perks */}
              <Card variant="gradient" hover={false} className="border-[#FFB627]/30">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-[#FFB627]" />
                  <h3 className="font-semibold text-white">Premium Perks</h3>
                </div>
                <ul className="space-y-2 text-sm text-[#A0A0A0] mb-4">
                  <li className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#00F5D4]" />
                    Early access to tickets
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FFB627]" />
                    Exclusive meet-and-greets
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F72585]" />
                    Special badges & flair
                  </li>
                </ul>
                <Button size="sm" className="w-full bg-gradient-to-r from-[#FFB627] to-[#F72585]">
                  Upgrade to Premium
                </Button>
              </Card>
            </div>

            {/* Posts Feed */}
            <div className="lg:col-span-3">
              {/* Sort Options */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSortBy('trending')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      sortBy === 'trending' ? 'text-[#00F5D4]' : 'text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </button>
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      sortBy === 'recent' ? 'text-[#00F5D4]' : 'text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Recent
                  </button>
                </div>
                <span className="text-sm text-[#A0A0A0]">
                  {filteredPosts.length} posts
                </span>
              </div>

              {/* Pinned Posts */}
              {pinnedPosts.length > 0 && (
                <div className="mb-6">
                  {pinnedPosts.map((post) => (
                    <Card key={post.id} variant="gradient" className="relative border-[#00F5D4]/30">
                      <div className="absolute top-4 right-4">
                        <Badge variant="success" size="sm">🔥 Hot</Badge>
                      </div>
                      <PostCard post={post} />
                    </Card>
                  ))}
                </div>
              )}

              {/* Regular Posts */}
              <div className="space-y-4">
                {regularPosts.map((post) => (
                  <Card key={post.id} variant="default">
                    <PostCard post={post} />
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#00F5D4]/10 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-[#00F5D4]/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                  <p className="text-[#A0A0A0] mb-6">Be the first to hype an upcoming show!</p>
                  <Button className="bg-gradient-to-r from-[#00F5D4] to-[#7B2FF7]">Create Post</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PostCard({ post }: { post: typeof mockPosts[0] }) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7B2FF7] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {post.author_avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{post.author}</span>
            <div className="flex gap-1">
              {post.author_badges.map((badge, i) => (
                <span key={i} className="text-sm" title="Superfan Badge">{badge}</span>
              ))}
            </div>
            <span className="text-sm text-[#A0A0A0]">· {post.created_at}</span>
          </div>
          
          <Badge 
            variant={categoryColors[post.category] || 'default'} 
            size="sm" 
            className="mb-2 capitalize"
          >
            {post.category.replace('-', ' ')}
          </Badge>

          <Link href={`/community/superfans/${post.id}`}>
            <h3 className="text-lg font-semibold text-white hover:text-[#00F5D4] transition-colors mb-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-[#A0A0A0] line-clamp-2 mb-4 whitespace-pre-line">
            {post.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-[#00F5D4]/10 text-[#00F5D4]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#F72585] transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{post.likes_count}</span>
            </button>
            <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#00F5D4] transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{post.comments_count}</span>
            </button>
            <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#FFB627] transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

