import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { 
  MapPin, Calendar, Instagram, Youtube, Twitter, Globe, 
  Video, ExternalLink, Mail, Check, Music
} from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function ComedianProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Fetch comedian profile by username
  const { data: comedianProfile } = await supabase
    .from('comedian_profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!comedianProfile) {
    notFound()
  }

  // Fetch base profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', comedianProfile.id)
    .single()

  if (!profile || !profile.is_public) {
    notFound()
  }

  const yearsOfExperience = comedianProfile.comedy_start_date
    ? Math.floor((Date.now() - new Date(comedianProfile.comedy_start_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  const socialLinks = comedianProfile.social_links || {}
  const videoClips = comedianProfile.video_clips || []
  const comedyStyles = comedianProfile.comedy_styles || []
  const performanceTypes = comedianProfile.performance_types || []

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7B2FF7]/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F72585]/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {profile.profile_photo_url || profile.avatar_url ? (
                <img
                  src={profile.profile_photo_url || profile.avatar_url}
                  alt={profile.full_name}
                  className="w-40 h-40 rounded-2xl object-cover border-4 border-[#7B2FF7]/30"
                />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center text-5xl font-bold text-white">
                  {profile.full_name?.charAt(0) || '?'}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{profile.full_name}</h1>
              
              {comedianProfile.headline && (
                <p className="text-xl text-[#A0A0A0] mb-4">{comedianProfile.headline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-[#A0A0A0] mb-4">
                {(profile.city || profile.state) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#F72585]" />
                    {[profile.city, profile.state].filter(Boolean).join(', ')}
                  </span>
                )}
                
                {yearsOfExperience !== null && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#00F5D4]" />
                    {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} in comedy
                  </span>
                )}
              </div>

              {/* Comedy Styles */}
              {comedyStyles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {comedyStyles.map((style: string) => (
                    <Badge key={style} variant="default" size="sm">
                      {style}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Booking Badge */}
              {comedianProfile.available_for_booking && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-[#00F5D4]">
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Available for Booking</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              {profile.bio && (
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                  <p className="text-[#A0A0A0] whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}

              {/* Video Clips */}
              {videoClips.length > 0 && (
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#FF6B6B]" />
                    Watch My Sets
                  </h2>
                  <div className="space-y-4">
                    {videoClips.map((clip: { title: string; url: string; platform: string }, index: number) => (
                      <a
                        key={index}
                        href={clip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-xl hover:bg-[#252525] transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7B2FF7] to-[#F72585] flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium group-hover:text-[#7B2FF7] transition-colors">
                            {clip.title}
                          </p>
                          <p className="text-[#666] text-sm capitalize">{clip.platform}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-[#666] group-hover:text-[#7B2FF7] transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Booking Info */}
              {comedianProfile.available_for_booking && (
                <div className="bg-gradient-to-br from-[#7B2FF7]/20 to-[#F72585]/20 border border-[#7B2FF7]/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Book This Comedian</h3>
                  
                  {comedianProfile.booking_rate && (
                    <p className="text-[#A0A0A0] mb-2">
                      <span className="text-white font-medium">Rate:</span> {comedianProfile.booking_rate}
                    </p>
                  )}
                  
                  {comedianProfile.travel_radius && (
                    <p className="text-[#A0A0A0] mb-4">
                      <span className="text-white font-medium">Travel:</span>{' '}
                      {comedianProfile.travel_radius === 'local' && 'Local Only (50 miles)'}
                      {comedianProfile.travel_radius === 'regional' && 'Regional (250 miles)'}
                      {comedianProfile.travel_radius === 'national' && 'National (US-wide)'}
                      {comedianProfile.travel_radius === 'international' && 'International'}
                    </p>
                  )}

                  {performanceTypes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-white font-medium mb-2">Available for:</p>
                      <div className="flex flex-wrap gap-2">
                        {performanceTypes.map((type: string) => (
                          <span key={type} className="px-3 py-1 bg-[#1A1A1A] rounded-full text-sm text-[#A0A0A0] capitalize">
                            {type.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full" onClick={() => window.location.href = `mailto:${profile.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact for Booking
                  </Button>
                </div>
              )}

              {/* Social Links */}
              {Object.keys(socialLinks).some(key => socialLinks[key]) && (
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
                  <div className="space-y-3">
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#E1306C] transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    
                    {socialLinks.youtube && (
                      <a
                        href={socialLinks.youtube.startsWith('http') ? socialLinks.youtube : `https://youtube.com/${socialLinks.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#FF0000] transition-colors"
                      >
                        <Youtube className="w-5 h-5" />
                        <span>YouTube</span>
                      </a>
                    )}
                    
                    {socialLinks.tiktok && (
                      <a
                        href={socialLinks.tiktok.startsWith('http') ? socialLinks.tiktok : `https://tiktok.com/${socialLinks.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#A0A0A0] hover:text-white transition-colors"
                      >
                        <Music className="w-5 h-5" />
                        <span>TikTok</span>
                      </a>
                    )}
                    
                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#1DA1F2] transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                        <span>X (Twitter)</span>
                      </a>
                    )}
                    
                    {socialLinks.website && (
                      <a
                        href={socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#7B2FF7] transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                        <span>Website</span>
                      </a>
                    )}

                    {socialLinks.spotify && (
                      <a
                        href={socialLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#A0A0A0] hover:text-[#1DB954] transition-colors"
                      >
                        <Music className="w-5 h-5" />
                        <span>Spotify</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Back Link */}
              <Link
                href="/for-venues/find-talent"
                className="block text-center text-[#7B2FF7] hover:text-[#F72585] transition-colors"
              >
                ← Browse All Comedians
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

