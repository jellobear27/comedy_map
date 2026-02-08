'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Flame, MessageSquare, AlertTriangle, Plus, Clock, 
  TrendingUp, Shield, ChevronDown, ChevronUp, Flag, X
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// Mock roast threads
const mockThreads = [
  {
    id: '1',
    author: 'BraveComedian',
    author_avatar: 'BC',
    title: "I've been doing comedy for 3 years and still can't get a paid gig. Roast me.",
    description: "I perform 5 nights a week and my mom still asks when I'm getting a real job.",
    roast_count: 47,
    top_roast: "3 years and no paid gigs? Even your unpaid internship had better career growth.",
    top_roast_fires: 89,
    created_at: '2 hours ago',
    is_hot: true,
  },
  {
    id: '2',
    author: 'OpenMicWarrior',
    author_avatar: 'OM',
    title: "I bomb so often the TSA put me on a watchlist. Do your worst.",
    description: "Last week I got less laughs than a funeral. The funeral was funnier.",
    roast_count: 32,
    top_roast: "Your comedy career is like your love life - lots of awkward silences and everyone leaves disappointed.",
    top_roast_fires: 67,
    created_at: '5 hours ago',
    is_hot: true,
  },
  {
    id: '3',
    author: 'StageFreightened',
    author_avatar: 'SF',
    title: "I write jokes for 8 hours and perform for 5 minutes. Efficiency king. Roast me.",
    description: null,
    roast_count: 23,
    top_roast: "8 hours of writing for 5 minutes of silence isn't comedy, it's meditation.",
    top_roast_fires: 45,
    created_at: '1 day ago',
    is_hot: false,
  },
  {
    id: '4',
    author: 'HecklerMagnet',
    author_avatar: 'HM',
    title: "Hecklers talk to me more than my audience laughs. Have at it.",
    description: "At least someone's engaging with my content, right?",
    roast_count: 56,
    top_roast: "You're not a comedian, you're a conversation starter for drunk people.",
    top_roast_fires: 112,
    created_at: '1 day ago',
    is_hot: true,
  },
]

const roastGuidelines = [
  { rule: "Keep it funny, not cruel", description: "The goal is laughs, not tears" },
  { rule: "No racism, homophobia, or bigotry", description: "Punch up, not down" },
  { rule: "No attacks on family members", description: "They didn't sign up for this" },
  { rule: "No doxxing or personal info", description: "Keep it on the platform" },
  { rule: "Thread owner can close anytime", description: "Consent can be withdrawn" },
]

export default function RoastMePage() {
  const [showGuidelines, setShowGuidelines] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [sortBy, setSortBy] = useState<'hot' | 'new'>('hot')

  const sortedThreads = [...mockThreads].sort((a, b) => {
    if (sortBy === 'hot') {
      return b.roast_count - a.roast_count
    }
    return 0 // Already sorted by recency in mock
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-[#FF6B6B]/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[300px] bg-[#FFB627]/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="danger" className="mb-4">
              <Flame className="w-3 h-3 mr-1" />
              Roast Zone
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Roast Me{' '}
              <span className="bg-gradient-to-r from-[#FF6B6B] via-[#FFB627] to-[#FF6B6B] bg-clip-text text-transparent">
                🔥
              </span>
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto mb-6">
              Think you can handle the heat? Volunteer to be roasted by the comedy community. 
              All in good fun. Thick skin required.
            </p>

            {/* Guidelines Toggle */}
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="inline-flex items-center gap-2 text-[#FFB627] hover:text-[#FF6B6B] transition-colors mb-6"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Community Guidelines</span>
              {showGuidelines ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Guidelines Panel */}
            {showGuidelines && (
              <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl bg-[#1A0033]/60 border border-[#FFB627]/30">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#FFB627]" />
                  <h3 className="font-semibold text-white">Keep It Funny, Keep It Safe</h3>
                </div>
                <div className="space-y-3 text-left">
                  {roastGuidelines.map((g, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#FF6B6B] font-bold">{i + 1}.</span>
                      <div>
                        <span className="text-white font-medium">{g.rule}</span>
                        <span className="text-[#A0A0A0]"> — {g.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[#A0A0A0]">
                  Violations will be removed. Repeat offenders will be banned. 
                  <Link href="/community" className="text-[#7B2FF7] hover:underline ml-1">
                    Full community rules →
                  </Link>
                </p>
              </div>
            )}

            {/* CTA */}
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB627]"
            >
              <Flame className="w-5 h-5 mr-2" />
              Volunteer to Be Roasted
            </Button>
          </div>

          {/* Back to Community */}
          <div className="flex justify-center mb-8">
            <Link href="/community">
              <Button variant="ghost" size="sm">
                ← Back to Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Threads Feed */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSortBy('hot')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  sortBy === 'hot' ? 'text-[#FF6B6B]' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Hottest
              </button>
              <button
                onClick={() => setSortBy('new')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  sortBy === 'new' ? 'text-[#FF6B6B]' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                Newest
              </button>
            </div>
            <span className="text-sm text-[#A0A0A0]">
              {mockThreads.length} brave souls
            </span>
          </div>

          {/* Threads */}
          <div className="space-y-4">
            {sortedThreads.map((thread) => (
              <Card 
                key={thread.id} 
                variant="default" 
                className={thread.is_hot ? 'border-[#FF6B6B]/30' : ''}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFB627] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {thread.author_avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{thread.author}</span>
                      {thread.is_hot && (
                        <Badge variant="danger" size="sm">
                          <Flame className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      <span className="text-sm text-[#A0A0A0]">· {thread.created_at}</span>
                    </div>

                    <Link href={`/community/roast-me/${thread.id}`}>
                      <h3 className="text-lg font-semibold text-white hover:text-[#FF6B6B] transition-colors mb-2">
                        {thread.title}
                      </h3>
                    </Link>

                    {thread.description && (
                      <p className="text-[#A0A0A0] text-sm mb-4">{thread.description}</p>
                    )}

                    {/* Top Roast Preview */}
                    {thread.top_roast && (
                      <div className="p-3 rounded-xl bg-[#FF6B6B]/5 border border-[#FF6B6B]/20 mb-4">
                        <div className="flex items-start gap-2">
                          <Flame className="w-4 h-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-white text-sm italic">"{thread.top_roast}"</p>
                            <span className="text-xs text-[#FFB627]">
                              🔥 {thread.top_roast_fires} fires
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                      <Link 
                        href={`/community/roast-me/${thread.id}`}
                        className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#FF6B6B] transition-colors"
                      >
                        <Flame className="w-4 h-4" />
                        <span className="text-sm">{thread.roast_count} roasts</span>
                      </Link>
                      <button className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#FFB627] transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Add roast</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateRoastModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

function CreateRoastModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#1A0033] border border-[#FF6B6B]/30 rounded-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFB627] flex items-center justify-center">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Volunteer for the Roast</h2>
          <p className="text-[#A0A0A0] mt-2">Are you sure? There's no going back (well, you can close the thread).</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Your roast-worthy confession *
            </label>
            <Input
              placeholder="I've been doing comedy for 5 years and my mom still doesn't think I'm funny..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Extra context (optional)
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-[#0D0015] border border-[#7B2FF7]/30 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#FF6B6B]/50 resize-none"
              rows={3}
              placeholder="Add any details that make you even more roastable..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="p-4 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#FF6B6B] text-[#FF6B6B] focus:ring-[#FF6B6B]"
              />
              <span className="text-sm text-[#A0A0A0]">
                I understand that I'm volunteering to be roasted. I have thick skin and won't take it personally. 
                I can close my thread at any time if it gets too spicy. 🌶️
              </span>
            </label>
          </div>

          <Button
            disabled={!title || !agreed}
            className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB627] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Flame className="w-5 h-5 mr-2" />
            Bring On the Roasts
          </Button>
        </div>
      </div>
    </div>
  )
}

