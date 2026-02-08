'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MessageSquare, Heart, Share2, Bookmark, TrendingUp, Clock, Users, Plus, Mic, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// Mock community posts
const mockPosts = [
  {
    id: '1',
    title: 'How I went from bombing every set to getting booked regularly',
    content: 'After 2 years of consistent open mic grind, I finally cracked the code. Here are my top 5 lessons...',
    author: 'ComedyKing42',
    author_avatar: 'CK',
    category: 'success-story',
    tags: ['motivation', 'journey', 'tips'],
    likes_count: 342,
    comments_count: 87,
    created_at: '2 hours ago',
    is_pinned: true,
  },
  {
    id: '2',
    title: 'Best way to handle hecklers?',
    content: 'Had a rough night last week with a persistent heckler. What are your go-to strategies for dealing with them without losing the rest of the audience?',
    author: 'NewComic2024',
    author_avatar: 'NC',
    category: 'question',
    tags: ['hecklers', 'crowd-work', 'help'],
    likes_count: 156,
    comments_count: 63,
    created_at: '5 hours ago',
  },
  {
    id: '3',
    title: 'Free resource: 100 comedy writing prompts',
    content: 'I compiled a list of writing prompts that have helped me generate new material. Free to download, hope it helps!',
    author: 'WriterComic',
    author_avatar: 'WC',
    category: 'resource',
    tags: ['writing', 'free', 'prompts'],
    likes_count: 521,
    comments_count: 45,
    created_at: '1 day ago',
  },
  {
    id: '4',
    title: 'Anyone touring the midwest this spring?',
    content: 'Looking to connect with other comics who are planning midwest tours in March/April. Would love to share resources and maybe do some shows together.',
    author: 'RoadWarrior',
    author_avatar: 'RW',
    category: 'discussion',
    tags: ['touring', 'midwest', 'networking'],
    likes_count: 89,
    comments_count: 32,
    created_at: '1 day ago',
  },
  {
    id: '5',
    title: 'Advice: Should I move to LA or NYC?',
    content: 'Been doing comedy for 3 years in a small market. Ready to make the jump to a bigger city. What are the pros/cons of each for building a career?',
    author: 'AspiringStar',
    author_avatar: 'AS',
    category: 'advice',
    tags: ['career', 'moving', 'nyc', 'la'],
    likes_count: 234,
    comments_count: 98,
    created_at: '2 days ago',
  },
  {
    id: '6',
    title: 'Just got my first paid gig!',
    content: 'After 18 months of open mics, I finally got offered $50 for a 10-minute spot! Small victory but it feels amazing!',
    author: 'GrindingComic',
    author_avatar: 'GC',
    category: 'success-story',
    tags: ['milestone', 'paid-gig', 'celebration'],
    likes_count: 678,
    comments_count: 124,
    created_at: '2 days ago',
  },
]

const categories = [
  { value: '', label: 'All Posts', icon: MessageSquare },
  { value: 'discussion', label: 'Discussion', icon: Users },
  { value: 'question', label: 'Questions', icon: MessageSquare },
  { value: 'advice', label: 'Advice', icon: TrendingUp },
  { value: 'success-story', label: 'Success Stories', icon: Heart },
  { value: 'resource', label: 'Resources', icon: Bookmark },
]

const categoryColors: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
  discussion: 'default',
  question: 'info',
  advice: 'warning',
  'success-story': 'success',
  resource: 'danger',
}

export default function CommunityPage() {
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
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[400px] bg-[#00F5D4]/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[300px] bg-[#7B2FF7]/15 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">Connect & Grow</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Comedy{' '}
              <span className="bg-gradient-to-r from-[#00F5D4] to-[#7B2FF7] bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
              Share experiences, get advice, and connect with fellow comedians on your journey.
            </p>
          </div>

          {/* Forum Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <Button size="sm">
              <Mic className="w-4 h-4 mr-2" />
              Comedian Forum
            </Button>
            <Link href="/community/superfans">
              <Button variant="secondary" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Superfan Zone
              </Button>
            </Link>
          </div>

          {/* Search and Create */}
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search discussions, questions, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <Button className="flex items-center gap-2">
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
            <div className="lg:col-span-1">
              <Card variant="glass" hover={false} className="sticky top-24">
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
                        ${selectedCategory === cat.value
                          ? 'bg-[#7B2FF7]/20 text-white'
                          : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span className="text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>

                <hr className="border-[#7B2FF7]/20 my-6" />

                <h3 className="font-semibold text-white mb-4">Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['#openmic', '#jokewriting', '#crowdwork', '#touring', '#firstgig', '#hecklers'].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full bg-[#7B2FF7]/10 text-[#7B2FF7] hover:bg-[#7B2FF7]/20 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
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
                      sortBy === 'trending' ? 'text-[#7B2FF7]' : 'text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </button>
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      sortBy === 'recent' ? 'text-[#7B2FF7]' : 'text-[#A0A0A0] hover:text-white'
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
                    <Card key={post.id} variant="gradient" className="relative border-[#FFB627]/30">
                      <div className="absolute top-4 right-4">
                        <Badge variant="warning" size="sm">Pinned</Badge>
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
                    <MessageSquare className="w-10 h-10 text-[#00F5D4]/50" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                  <p className="text-[#A0A0A0] mb-6">Be the first to start a discussion!</p>
                  <Button>Create Post</Button>
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
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {post.author_avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white">{post.author}</span>
            <span className="text-sm text-[#A0A0A0]">· {post.created_at}</span>
          </div>
          
          <Badge 
            variant={categoryColors[post.category] || 'default'} 
            size="sm" 
            className="mb-2 capitalize"
          >
            {post.category.replace('-', ' ')}
          </Badge>

          <Link href={`/community/${post.id}`}>
            <h3 className="text-lg font-semibold text-white hover:text-[#7B2FF7] transition-colors mb-2">
              {post.title}
            </h3>
          </Link>
          <p className="text-[#A0A0A0] line-clamp-2 mb-4">
            {post.content}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-[#7B2FF7]/10 text-[#7B2FF7]"
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
            <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#7B2FF7] transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{post.comments_count}</span>
            </button>
            <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#00F5D4] transition-colors">
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

