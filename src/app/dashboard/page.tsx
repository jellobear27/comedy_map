'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  MapPin, BookOpen, MessageSquare, Calendar, 
  Users, Heart, ArrowRight, Plus, User,
  Mic, Trophy, Target, Zap, Edit, Loader2
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  bio: string | null
  city: string | null
  state: string | null
  created_at: string
  profile_photo_url: string | null
  avatar_url: string | null
}

interface ComedianProfile {
  username: string | null
  headline: string | null
  comedy_styles: string[]
  available_for_booking: boolean
  video_clips: { title: string; url: string }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [comedianProfile, setComedianProfile] = useState<ComedianProfile | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Load base profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Load comedian profile
      const { data: comedianData } = await supabase
        .from('comedian_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile({
          ...profileData,
          email: user.email || '',
        })
      } else {
        // Create a basic profile from auth data
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          email: user.email || '',
          bio: null,
          city: null,
          state: null,
          created_at: user.created_at,
          profile_photo_url: null,
          avatar_url: null,
        })
      }

      if (comedianData) {
        setComedianProfile(comedianData)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (profile?.email) {
      return profile.email[0].toUpperCase()
    }
    return '?'
  }

  const formatMemberSince = () => {
    if (!profile?.created_at) return ''
    const date = new Date(profile.created_at)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getLocation = () => {
    const parts = [profile?.city, profile?.state].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : null
  }

  const isProfileComplete = () => {
    return profile?.full_name && profile?.bio && profile?.city && comedianProfile?.username
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7B2FF7] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {profile?.profile_photo_url || profile?.avatar_url ? (
              <img 
                src={profile.profile_photo_url || profile.avatar_url || ''} 
                alt={profile.full_name || 'Profile'}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-white text-2xl font-bold">
                {getInitials()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
              </h1>
              <p className="text-[#A0A0A0]">
                {getLocation() && (
                  <>
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {getLocation()} · 
                  </>
                )}
                Member since {formatMemberSince()}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/profile">
              <Button variant="secondary" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
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

        {/* Profile Completion Banner */}
        {!isProfileComplete() && (
          <Card className="mb-8 p-6 bg-gradient-to-r from-[#7B2FF7]/20 to-[#F72585]/20 border-[#7B2FF7]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Complete Your Profile 🎤</h2>
                <p className="text-[#A0A0A0]">
                  Add your bio, location, and comedy info to get discovered by venues and connect with other comedians.
                </p>
              </div>
              <Link href="/dashboard/profile">
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Complete Profile
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7B2FF7]/10 flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#7B2FF7]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Saved Mics</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F72585]/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#F72585]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Courses</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00F5D4]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#00F5D4]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Posts</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFB627]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#FFB627]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-xs text-[#A0A0A0]">Connections</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Summary */}
            <Card variant="gradient" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Your Profile</h2>
                <Link href="/dashboard/profile" className="text-sm text-[#7B2FF7] hover:text-[#F72585]">
                  Edit
                </Link>
              </div>

              <div className="space-y-4">
                {comedianProfile?.headline && (
                  <p className="text-lg text-[#A0A0A0] italic">"{comedianProfile.headline}"</p>
                )}
                
                {profile?.bio ? (
                  <p className="text-[#A0A0A0]">{profile.bio}</p>
                ) : (
                  <p className="text-[#666] italic">No bio yet. Tell venues about yourself!</p>
                )}

                {comedianProfile?.comedy_styles && comedianProfile.comedy_styles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {comedianProfile.comedy_styles.map(style => (
                      <Badge key={style} variant="default" size="sm">{style}</Badge>
                    ))}
                  </div>
                )}

                {comedianProfile?.available_for_booking && (
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="success">Available for Booking</Badge>
                  </div>
                )}

                {comedianProfile?.username && (
                  <div className="pt-4 border-t border-[#1A1A1A]">
                    <p className="text-sm text-[#A0A0A0]">
                      Your public profile: 
                      <Link href={`/comedians/${comedianProfile.username}`} className="text-[#7B2FF7] hover:text-[#F72585] ml-2">
                        novaacta.com/comedians/{comedianProfile.username}
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              {!isProfileComplete() && (
                <Link href="/dashboard/profile">
                  <Button variant="secondary" className="w-full mt-6">
                    <Edit className="w-4 h-4 mr-2" />
                    Complete Your Profile
                  </Button>
                </Link>
              )}
            </Card>

            {/* Get Started */}
            <Card variant="gradient" hover={false}>
              <h2 className="text-lg font-semibold text-white mb-6">Get Started</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/open-mics" className="group">
                  <div className="p-4 rounded-xl bg-[#7B2FF7]/5 border border-[#7B2FF7]/10 hover:border-[#7B2FF7]/30 transition-colors">
                    <Mic className="w-8 h-8 text-[#7B2FF7] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#7B2FF7] transition-colors">Find Open Mics</h3>
                    <p className="text-sm text-[#A0A0A0]">Discover open mics near you</p>
                  </div>
                </Link>
                <Link href="/courses" className="group">
                  <div className="p-4 rounded-xl bg-[#F72585]/5 border border-[#F72585]/10 hover:border-[#F72585]/30 transition-colors">
                    <BookOpen className="w-8 h-8 text-[#F72585] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#F72585] transition-colors">Browse Courses</h3>
                    <p className="text-sm text-[#A0A0A0]">Learn from the pros</p>
                  </div>
                </Link>
                <Link href="/community" className="group">
                  <div className="p-4 rounded-xl bg-[#00F5D4]/5 border border-[#00F5D4]/10 hover:border-[#00F5D4]/30 transition-colors">
                    <MessageSquare className="w-8 h-8 text-[#00F5D4] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#00F5D4] transition-colors">Join Community</h3>
                    <p className="text-sm text-[#A0A0A0]">Connect with comedians</p>
                  </div>
                </Link>
                <Link href="/for-venues/find-talent" className="group">
                  <div className="p-4 rounded-xl bg-[#FFB627]/5 border border-[#FFB627]/10 hover:border-[#FFB627]/30 transition-colors">
                    <Users className="w-8 h-8 text-[#FFB627] mb-3" />
                    <h3 className="font-medium text-white group-hover:text-[#FFB627] transition-colors">Find Talent</h3>
                    <p className="text-sm text-[#A0A0A0]">Browse other comedians</p>
                  </div>
                </Link>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Video Clips */}
            {comedianProfile?.video_clips && comedianProfile.video_clips.length > 0 ? (
              <Card variant="glass" hover={false}>
                <h2 className="text-lg font-semibold text-white mb-4">Your Video Clips</h2>
                <div className="space-y-3">
                  {comedianProfile.video_clips.slice(0, 3).map((clip, index) => (
                    <a
                      key={index}
                      href={clip.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#7B2FF7]/20 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-[#7B2FF7]" />
                      </div>
                      <span className="text-sm text-white truncate">{clip.title}</span>
                    </a>
                  ))}
                </div>
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    Manage Clips
                  </Button>
                </Link>
              </Card>
            ) : (
              <Card variant="glass" hover={false}>
                <h2 className="text-lg font-semibold text-white mb-4">Video Clips</h2>
                <p className="text-[#A0A0A0] text-sm mb-4">
                  Add links to your sets so venues can see your work!
                </p>
                <Link href="/dashboard/profile">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video Clips
                  </Button>
                </Link>
              </Card>
            )}

            {/* Quick Links */}
            <Card variant="glass" hover={false}>
              <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <User className="w-5 h-5 text-[#7B2FF7]" />
                  <span className="text-[#A0A0A0] hover:text-white">Edit Profile</span>
                </Link>
                <Link
                  href="/community"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-[#00F5D4]" />
                  <span className="text-[#A0A0A0] hover:text-white">Community Forum</span>
                </Link>
                <Link
                  href="/open-mics"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Mic className="w-5 h-5 text-[#F72585]" />
                  <span className="text-[#A0A0A0] hover:text-white">Find Open Mics</span>
                </Link>
                {comedianProfile?.username && (
                  <Link
                    href={`/comedians/${comedianProfile.username}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-[#FFB627]" />
                    <span className="text-[#A0A0A0] hover:text-white">View Public Profile</span>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
