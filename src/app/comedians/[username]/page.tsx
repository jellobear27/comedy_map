'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  MapPin, Calendar, Instagram, Youtube, Twitter, Globe, 
  Video, ExternalLink, Mail, Sparkles, Zap, Star, 
  Music, Mic, Award, Play, Edit3, Clock
} from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface PageProps {
  params: Promise<{ username: string }>
}

export default function ComedianProfilePage({ params }: PageProps) {
  const [profile, setProfile] = useState<any>(null)
  const [comedianProfile, setComedianProfile] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const loadProfile = async () => {
      const resolvedParams = await params
      setUsername(resolvedParams.username)
      
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

  const yearsOfExperience = comedianProfile.comedy_start_date
    ? Math.floor((Date.now() - new Date(comedianProfile.comedy_start_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  const socialLinks = comedianProfile.social_links || {}
  const videoClips = comedianProfile.video_clips || []
  const comedyStyles = comedianProfile.comedy_styles || []
  const performanceTypes = comedianProfile.performance_types || []

  // Calculate "power level" based on profile completeness
  let powerLevel = 0
  if (profile.full_name) powerLevel += 10
  if (profile.bio) powerLevel += 15
  if (profile.profile_photo_url) powerLevel += 15
  if (comedianProfile.headline) powerLevel += 10
  if (comedyStyles.length > 0) powerLevel += 10
  if (videoClips.length > 0) powerLevel += 20
  if (Object.values(socialLinks).some(v => v)) powerLevel += 10
  if (comedianProfile.available_for_booking) powerLevel += 10

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
        <Link href="/dashboard/profile" className="fixed top-24 right-6 z-50">
          <Button variant="secondary" className="flex items-center gap-2 shadow-lg shadow-[#7B2FF7]/20">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        </Link>
      )}

      {/* Hero Card Section */}
      <section className="relative pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* THE CARD - Pokemon style with holographic border */}
          <div className="relative group">
            {/* Holographic glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7B2FF7] via-[#F72585] via-[#00F5D4] to-[#7B2FF7] rounded-[2rem] opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
            
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-[#0D0016] via-[#1A0033] to-[#0D0016] rounded-[2rem] border border-[#7B2FF7]/30 overflow-hidden">
              {/* Card Header - Type/Rarity */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-[#7B2FF7]/20 bg-[#7B2FF7]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[#A0A0A0] font-medium uppercase tracking-wider text-sm">Stand-Up Comedian</span>
                </div>
                <div className="flex items-center gap-2">
                  {comedianProfile.available_for_booking && (
                    <span className="px-3 py-1 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-[#00F5D4] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Bookable
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-[#FFB627]/10 border border-[#FFB627]/30 text-[#FFB627] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {powerLevel}% Power
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left - Photo & Stats */}
                  <div className="lg:w-1/3 space-y-6">
                    {/* Profile Photo with frame */}
                    <div className="relative mx-auto lg:mx-0 w-64 h-64">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FF7] via-[#F72585] to-[#00F5D4] rounded-2xl" />
                      <div className="absolute inset-[3px] bg-[#0D0016] rounded-2xl overflow-hidden">
                        {profile.profile_photo_url || profile.avatar_url ? (
                          <img
                            src={profile.profile_photo_url || profile.avatar_url}
                            alt={profile.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#7B2FF7]/50 to-[#F72585]/50 flex items-center justify-center">
                            <span className="text-8xl font-bold text-white/80">
                              {profile.full_name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Sparkle decorations */}
                      <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#FFB627] animate-pulse" />
                      <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-[#00F5D4] animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>

                    {/* Stats Grid - Pokemon style */}
                    <div className="bg-[#0A0A0A]/50 rounded-xl p-4 border border-[#7B2FF7]/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B2FF7] mb-3">Stats</h4>
                      <div className="space-y-3">
                        {yearsOfExperience !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#00F5D4]" />
                              Experience
                            </span>
                            <span className="text-white font-bold">{yearsOfExperience} YRS</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                            <Video className="w-4 h-4 text-[#F72585]" />
                            Clips
                          </span>
                          <span className="text-white font-bold">{videoClips.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[#FFB627]" />
                            Styles
                          </span>
                          <span className="text-white font-bold">{comedyStyles.length}</span>
                        </div>
                        {(profile.city || profile.state) && (
                          <div className="flex items-center justify-between">
                            <span className="text-[#A0A0A0] text-sm flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#7B2FF7]" />
                              Base
                            </span>
                            <span className="text-white font-bold text-right text-sm">
                              {[profile.city, profile.state].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right - Name, Bio, Styles */}
                  <div className="lg:w-2/3 space-y-6">
                    {/* Name & Headline */}
                    <div>
                      <h1 className="text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                        {profile.full_name}
                      </h1>
                      {comedianProfile.headline && (
                        <p className="text-xl text-[#A0A0A0] italic">"{comedianProfile.headline}"</p>
                      )}
                    </div>

                    {/* Comedy Styles - as badges */}
                    {comedyStyles.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F72585] mb-3 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Signature Moves
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {comedyStyles.map((style: string, index: number) => (
                            <span 
                              key={style} 
                              className="px-4 py-2 rounded-full font-semibold text-sm border"
                              style={{
                                background: `linear-gradient(135deg, ${['#7B2FF7', '#F72585', '#00F5D4', '#FFB627'][index % 4]}20, transparent)`,
                                borderColor: `${['#7B2FF7', '#F72585', '#00F5D4', '#FFB627'][index % 4]}40`,
                                color: ['#7B2FF7', '#F72585', '#00F5D4', '#FFB627'][index % 4]
                              }}
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {profile.bio && (
                      <div className="bg-[#0A0A0A]/50 rounded-xl p-6 border border-[#7B2FF7]/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#00F5D4] mb-3">Origin Story</h4>
                        <p className="text-[#E0E0E0] leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                      </div>
                    )}

                    {/* Performance Types */}
                    {performanceTypes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFB627] mb-3">Available For</h4>
                        <div className="flex flex-wrap gap-2">
                          {performanceTypes.map((type: string) => (
                            <span key={type} className="px-3 py-1 bg-[#FFB627]/10 border border-[#FFB627]/30 rounded-full text-[#FFB627] text-sm capitalize">
                              {type.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer - Booking CTA */}
              {comedianProfile.available_for_booking && (
                <div className="px-8 py-6 border-t border-[#7B2FF7]/20 bg-gradient-to-r from-[#7B2FF7]/10 via-[#F72585]/10 to-[#7B2FF7]/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      {comedianProfile.booking_rate && (
                        <p className="text-white">
                          <span className="text-[#A0A0A0]">Rate:</span>{' '}
                          <span className="font-bold text-[#00F5D4]">{comedianProfile.booking_rate}</span>
                        </p>
                      )}
                      {comedianProfile.travel_radius && (
                        <p className="text-sm text-[#A0A0A0]">
                          Travels: {comedianProfile.travel_radius === 'local' && 'Local (50mi)'}
                          {comedianProfile.travel_radius === 'regional' && 'Regional (250mi)'}
                          {comedianProfile.travel_radius === 'national' && 'National'}
                          {comedianProfile.travel_radius === 'international' && 'International'}
                        </p>
                      )}
                    </div>
                    <a href={`mailto:${profile.email}`}>
                      <Button className="bg-gradient-to-r from-[#7B2FF7] to-[#F72585] hover:opacity-90 px-8">
                        <Mail className="w-4 h-4 mr-2" />
                        Book This Legend
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
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

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
