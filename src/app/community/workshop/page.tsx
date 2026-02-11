'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Users, Lock, Plus, MessageSquare, Clock, ChevronRight,
  Sparkles, Shield, UserPlus, X, Copy, Check, Pencil
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// Mock workshop groups
const mockGroups = [
  {
    id: '1',
    name: 'NYC Comedy Writers',
    description: 'A tight-knit group of NYC comics workshopping material together. Weekly feedback sessions.',
    member_count: 7,
    max_members: 10,
    owner: 'JokeMaster',
    recent_activity: '2 hours ago',
    post_count: 34,
    is_member: true,
  },
  {
    id: '2',
    name: 'The Punchline Lab',
    description: 'Focused on crafting killer punchlines. Bring your premises, leave with bangers.',
    member_count: 5,
    max_members: 8,
    owner: 'PunchlineQueen',
    recent_activity: '5 hours ago',
    post_count: 21,
    is_member: true,
  },
  {
    id: '3',
    name: 'Crowd Work Collective',
    description: 'Workshopping crowd work bits and improv responses. Video clips encouraged.',
    member_count: 9,
    max_members: 10,
    owner: 'CrowdKing',
    recent_activity: '1 day ago',
    post_count: 45,
    is_member: false,
    has_invite: true,
  },
]

// Mock recent posts from groups
const mockRecentPosts = [
  {
    id: '1',
    group_name: 'NYC Comedy Writers',
    author: 'FunnyBones',
    title: 'New bit about dating apps - need help with the tag',
    status: 'seeking_feedback',
    feedback_count: 4,
    created_at: '2 hours ago',
  },
  {
    id: '2',
    group_name: 'The Punchline Lab',
    author: 'SetupKing',
    title: 'Premise about working from home - where\'s the punchline?',
    status: 'seeking_feedback',
    feedback_count: 7,
    created_at: '5 hours ago',
  },
]

const workshopRules = [
  "What's shared here stays here - no stealing material",
  "Give feedback you'd want to receive - constructive, specific, kind",
  "It's okay to bomb in the workshop - that's what it's for",
  "Respect everyone's creative process",
]

export default function WorkshopPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)

  const myGroups = mockGroups.filter(g => g.is_member)
  const invitedGroups = mockGroups.filter(g => g.has_invite && !g.is_member)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-[#7B2FF7]/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[300px] bg-[#00F5D4]/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">
              <Lock className="w-3 h-3 mr-1" />
              Private Groups
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Workshop{' '}
              <span className="bg-gradient-to-r from-[#7B2FF7] via-[#00F5D4] to-[#7B2FF7] bg-clip-text text-transparent">
                Groups
              </span>
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto mb-6">
              Small, trusted circles to workshop your material. Share rough ideas, 
              get honest feedback, and refine your bits before hitting the stage.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Group
              </Button>
              <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
                <UserPlus className="w-5 h-5 mr-2" />
                Join with Code
              </Button>
            </div>
          </div>

          {/* Workshop Rules */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card variant="glass" hover={false} className="border-[#7B2FF7]/30">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#7B2FF7]" />
                <h3 className="font-semibold text-white">Workshop Code</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {workshopRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#00F5D4]">✓</span>
                    <span className="text-[#A0A0A0]">{rule}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Back to Community */}
          <div className="flex justify-center">
            <Link href="/community">
              <Button variant="ghost" size="sm">
                ← Back to Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* My Groups */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">My Groups</h2>
                <span className="text-sm text-[#A0A0A0]">{myGroups.length} groups</span>
              </div>

              {myGroups.length > 0 ? (
                <div className="space-y-4">
                  {myGroups.map((group) => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                </div>
              ) : (
                <Card variant="glass" hover={false} className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#7B2FF7]/10 flex items-center justify-center">
                    <Users className="w-8 h-8 text-[#7B2FF7]/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No groups yet</h3>
                  <p className="text-[#A0A0A0] mb-4">Create a group or join one with an invite code</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Group
                  </Button>
                </Card>
              )}

              {/* Pending Invites */}
              {invitedGroups.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-white mt-8">Pending Invites</h2>
                  <div className="space-y-4">
                    {invitedGroups.map((group) => (
                      <Card key={group.id} variant="gradient" className="border-[#FFB627]/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB627] to-[#F72585] flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{group.name}</h3>
                              <p className="text-sm text-[#A0A0A0]">
                                {group.member_count} members · Invited by {group.owner}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary">Decline</Button>
                            <Button size="sm">Accept</Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar - Recent Activity */}
            <div className="space-y-6">
              <Card variant="glass" hover={false}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#00F5D4]" />
                  <h3 className="font-semibold text-white">Recent Activity</h3>
                </div>

                {mockRecentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {mockRecentPosts.map((post) => (
                      <div key={post.id} className="p-3 rounded-xl bg-[#7B2FF7]/5 border border-[#7B2FF7]/20">
                        <div className="text-xs text-[#7B2FF7] mb-1">{post.group_name}</div>
                        <div className="font-medium text-white text-sm mb-2 line-clamp-2">
                          {post.title}
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#A0A0A0]">
                          <span>{post.author}</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.feedback_count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#A0A0A0] text-center py-4">
                    No recent activity
                  </p>
                )}
              </Card>

              {/* Tips Card */}
              <Card variant="gradient" hover={false}>
                <div className="flex items-center gap-2 mb-3">
                  <Pencil className="w-5 h-5 text-[#F72585]" />
                  <h3 className="font-semibold text-white">Workshop Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-[#A0A0A0]">
                  <li>• Share early, share often</li>
                  <li>• Bad ideas lead to good ones</li>
                  <li>• Specific feedback beats &quot;it&apos;s funny&quot;</li>
                  <li>• Test on stage, report back</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <JoinGroupModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  )
}

function GroupCard({ group }: { group: typeof mockGroups[0] }) {
  return (
    <Link href={`/community/workshop/${group.id}`}>
      <Card variant="default" className="hover:border-[#7B2FF7]/50 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7B2FF7] to-[#00F5D4] flex items-center justify-center flex-shrink-0">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">{group.name}</h3>
              <Lock className="w-3 h-3 text-[#A0A0A0]" />
            </div>
            <p className="text-sm text-[#A0A0A0] line-clamp-2 mb-3">
              {group.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-[#A0A0A0]">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {group.member_count}/{group.max_members}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {group.post_count} posts
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {group.recent_activity}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#A0A0A0]" />
        </div>
      </Card>
    </Link>
  )
}

function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [maxMembers, setMaxMembers] = useState('10')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#1A0033] border border-[#7B2FF7]/30 rounded-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#00F5D4] flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Workshop Group</h2>
          <p className="text-[#A0A0A0] mt-2">Start a private space to workshop material with trusted comics.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Group Name *
            </label>
            <Input
              placeholder="The Punchline Lab"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl bg-[#0D0015] border border-[#7B2FF7]/30 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#7B2FF7]/50 resize-none"
              rows={3}
              placeholder="What's the focus of this group?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Max Members
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-[#0D0015] border border-[#7B2FF7]/30 text-white focus:outline-none focus:border-[#7B2FF7]/50"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
            >
              <option value="5">5 members</option>
              <option value="8">8 members</option>
              <option value="10">10 members</option>
            </select>
            <p className="text-xs text-[#A0A0A0] mt-1">Smaller groups = more trust & focus</p>
          </div>

          <Button
            disabled={!name}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Group
          </Button>
        </div>
      </div>
    </div>
  )
}

function JoinGroupModal({ onClose }: { onClose: () => void }) {
  const [code, setCode] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#1A0033] border border-[#7B2FF7]/30 rounded-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7B2FF7] flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Join a Group</h2>
          <p className="text-[#A0A0A0] mt-2">Enter the invite code shared with you.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Invite Code
            </label>
            <Input
              placeholder="abc123"
              value={code}
              onChange={(e) => setCode(e.target.value.toLowerCase())}
              className="text-center text-lg tracking-widest"
            />
          </div>

          <Button
            disabled={!code || code.length < 6}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Group
          </Button>
        </div>
      </div>
    </div>
  )
}

