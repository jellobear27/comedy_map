'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isAdminProfileRole } from '@/lib/account-role'
import { 
  Instagram, Youtube, Twitter, Globe, 
  Music, Play, Edit3
} from 'lucide-react'
import Link from 'next/link'
import ComedianPokemonCard from '@/components/comedian/ComedianPokemonCard'

interface PageProps {
  params: Promise<{ username: string }>
}

export default function ComedianProfilePage({ params }: PageProps) {
  const [profile, setProfile] = useState<any>(null)
  const [comedianProfile, setComedianProfile] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const resolvedParams = await params

      const supabase = createClient()

      // Check if current user owns this profile
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch comedian profile by username
      const { data: comedianData } = await supabase
        .from('comedian_profiles')
        .select('*')
        .eq('username', resolvedParams.username)
        .single()

      if (!comedianData) {
        setIsLoading(false)
        return
      }

      setComedianProfile(comedianData)

      // Fetch base profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', comedianData.id)
        .single()

      if (!profileData || !profileData.is_public) {
        setIsLoading(false)
        return
      }

      setProfile(profileData)
      setIsOwner(user?.id === profileData.id)
      setIsLoading(false)
    }

    loadProfile()
  }, [params])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#7B2FF7]/30 border-t-[#7B2FF7] rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile || !comedianProfile) {
    notFound()
  }

  const socialLinks = comedianProfile.social_links || {}
  const videoClips = comedianProfile.video_clips || []

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#7B2FF7]/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F72585]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00F5D4]/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Edit Button for Owner */}
      {isOwner && (
        <Link
          href="/dashboard/profile"
          className="fixed top-24 right-6 z-50 inline-flex items-center gap-2 rounded-xl border border-[#7B2FF7]/30 bg-[#1A0033]/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#7B2FF7]/20 backdrop-blur-sm hover:border-[#7B2FF7]/50"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </Link>
      )}

      <section className="relative pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <ComedianPokemonCard
            mode="public"
            isNovaAdmin={isAdminProfileRole(profile.role)}
            profile={{
              full_name: profile.full_name,
              bio: profile.bio,
              city: profile.city,
              state: profile.state,
              profile_photo_url: profile.profile_photo_url,
              avatar_url: profile.avatar_url,
              email: profile.email,
            }}
            comedian={{
              username: comedianProfile.username,
              headline: comedianProfile.headline,
              comedy_styles: comedianProfile.comedy_styles || [],
              comedy_start_date: comedianProfile.comedy_start_date,
              available_for_booking: comedianProfile.available_for_booking,
              booking_rate: comedianProfile.booking_rate,
              travel_radius: comedianProfile.travel_radius,
              performance_types: comedianProfile.performance_types || [],
              video_clips: videoClips,
              social_links: socialLinks,
            }}
          />
        </div>
      </section>

      {/* Video Showcase - Highlight Reel */}
      {videoClips.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                <Play className="w-8 h-8 text-[#F72585]" />
                Highlight Reel
              </h2>
              <p className="text-[#A0A0A0]">Watch the magic happen</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoClips.map((clip: { title: string; url: string; platform: string }, index: number) => (
                <a
                  key={index}
                  href={clip.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-[#1A0033] to-[#0A0A0A] rounded-2xl overflow-hidden border border-[#7B2FF7]/20 hover:border-[#F72585]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#F72585]/20"
                >
                  <div className="aspect-video bg-gradient-to-br from-[#7B2FF7]/20 to-[#F72585]/20 flex items-center justify-center relative">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 rounded text-xs text-white capitalize">
                      {clip.platform}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white font-semibold group-hover:text-[#F72585] transition-colors line-clamp-2">
                      {clip.title}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Links - Connect Section */}
      {Object.keys(socialLinks).some(key => socialLinks[key]) && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Connect</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#E1306C]/30"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
              )}
              
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube.startsWith('http') ? socialLinks.youtube : `https://youtube.com/${socialLinks.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-[#FF0000] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#FF0000]/30"
                >
                  <Youtube className="w-6 h-6 text-white" />
                </a>
              )}
              
              {socialLinks.tiktok && (
                <a
                  href={socialLinks.tiktok.startsWith('http') ? socialLinks.tiktok : `https://tiktok.com/${socialLinks.tiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-black border border-white/20 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  <Music className="w-6 h-6 text-white" />
                </a>
              )}
              
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg border border-white/20"
                >
                  <Twitter className="w-6 h-6 text-white" />
                </a>
              )}
              
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#00F5D4] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#7B2FF7]/30"
                >
                  <Globe className="w-6 h-6 text-white" />
                </a>
              )}

              {socialLinks.spotify && (
                <a
                  href={socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl bg-[#1DB954] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#1DB954]/30"
                >
                  <Music className="w-6 h-6 text-white" />
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Link
            href="/for-venues/find-talent"
            className="inline-flex items-center gap-2 text-[#7B2FF7] hover:text-[#F72585] transition-colors font-medium"
          >
            ← Discover More Comedians
          </Link>
        </div>
      </section>

    </div>
  )
}
