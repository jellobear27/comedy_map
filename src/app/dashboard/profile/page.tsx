'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, Camera, MapPin, Calendar, Globe, Instagram, Youtube, 
  Twitter, Video, Plus, X, Loader2, Check, ExternalLink, Music
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { 
  COMEDY_STYLES, 
  PERFORMANCE_TYPES, 
  TRAVEL_RADIUS_OPTIONS,
  US_STATES,
  VideoClip,
  SocialLinks
} from '@/types'

interface ProfileFormData {
  // Base profile
  full_name: string
  bio: string
  city: string
  state: string
  profile_photo_url: string
  is_public: boolean
  
  // Comedian profile
  username: string
  headline: string
  comedy_start_date: string
  comedy_styles: string[]
  social_links: SocialLinks
  video_clips: VideoClip[]
  available_for_booking: boolean
  booking_rate: string
  travel_radius: string
  performance_types: string[]
}

const initialFormData: ProfileFormData = {
  full_name: '',
  bio: '',
  city: '',
  state: '',
  profile_photo_url: '',
  is_public: true,
  username: '',
  headline: '',
  comedy_start_date: '',
  comedy_styles: [],
  social_links: {},
  video_clips: [],
  available_for_booking: false,
  booking_rate: '',
  travel_radius: '',
  performance_types: [],
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [newVideoClip, setNewVideoClip] = useState<VideoClip>({ title: '', url: '', platform: 'youtube' })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Load base profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Load comedian profile
      const { data: comedianProfile } = await supabase
        .from('comedian_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          city: profile.city || '',
          state: profile.state || '',
          profile_photo_url: profile.profile_photo_url || profile.avatar_url || '',
          is_public: profile.is_public ?? true,
          username: comedianProfile?.username || '',
          headline: comedianProfile?.headline || '',
          comedy_start_date: comedianProfile?.comedy_start_date || '',
          comedy_styles: comedianProfile?.comedy_styles || [],
          social_links: comedianProfile?.social_links || {},
          video_clips: comedianProfile?.video_clips || [],
          available_for_booking: comedianProfile?.available_for_booking || false,
          booking_rate: comedianProfile?.booking_rate || '',
          travel_radius: comedianProfile?.travel_radius || '',
          performance_types: comedianProfile?.performance_types || [],
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Update base profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          bio: formData.bio,
          city: formData.city,
          state: formData.state,
          profile_photo_url: formData.profile_photo_url,
          is_public: formData.is_public,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // Update comedian profile
      const { error: comedianError } = await supabase
        .from('comedian_profiles')
        .upsert({
          id: user.id,
          username: formData.username || null,
          headline: formData.headline,
          comedy_start_date: formData.comedy_start_date || null,
          comedy_styles: formData.comedy_styles,
          social_links: formData.social_links,
          video_clips: formData.video_clips,
          available_for_booking: formData.available_for_booking,
          booking_rate: formData.booking_rate,
          travel_radius: formData.travel_radius,
          performance_types: formData.performance_types,
        })

      if (comedianError) throw comedianError

      setMessage({ type: 'success', text: 'Profile saved successfully!' })
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const toggleStyle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      comedy_styles: prev.comedy_styles.includes(style)
        ? prev.comedy_styles.filter(s => s !== style)
        : [...prev.comedy_styles, style]
    }))
  }

  const togglePerformanceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      performance_types: prev.performance_types.includes(type)
        ? prev.performance_types.filter(t => t !== type)
        : [...prev.performance_types, type]
    }))
  }

  const addVideoClip = () => {
    if (newVideoClip.title && newVideoClip.url) {
      setFormData(prev => ({
        ...prev,
        video_clips: [...prev.video_clips, newVideoClip]
      }))
      setNewVideoClip({ title: '', url: '', platform: 'youtube' })
    }
  }

  const removeVideoClip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      video_clips: prev.video_clips.filter((_, i) => i !== index)
    }))
  }

  const updateSocialLink = (platform: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value }
    }))
  }

  const calculateYearsOfExperience = () => {
    if (!formData.comedy_start_date) return null
    const start = new Date(formData.comedy_start_date)
    const now = new Date()
    const years = Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return years
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7B2FF7] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Edit Your Profile</h1>
          <p className="text-[#A0A0A0]">
            Build your comedian profile to get discovered by venues and connect with the community.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#7B2FF7]" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="full_name"
                label="Full Name / Stage Name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your name or stage name"
              />
              
              <Input
                id="username"
                label="Username (for your public URL)"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                placeholder="yourname"
                icon={<span className="text-[#A0A0A0] text-sm">/comedians/</span>}
              />
              
              <Input
                id="headline"
                label="Headline"
                value={formData.headline}
                onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                placeholder="e.g., Denver-based observational comic"
              />

              <Input
                id="profile_photo_url"
                label="Profile Photo URL"
                value={formData.profile_photo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, profile_photo_url: e.target.value }))}
                placeholder="https://..."
                icon={<Camera className="w-4 h-4" />}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell venues and fellow comedians about yourself, your comedy journey, and what makes you unique..."
                rows={4}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#7B2FF7] focus:ring-1 focus:ring-[#7B2FF7] transition-colors resize-none"
              />
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F72585]" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="city"
                label="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Denver"
              />
              
              <div>
                <label className="block text-sm font-medium text-[#E0E0E0] mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#7B2FF7] focus:ring-1 focus:ring-[#7B2FF7] transition-colors"
                >
                  <option value="">Select state</option>
                  {US_STATES.map(state => (
                    <option key={state.value} value={state.value}>{state.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Comedy Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00F5D4]" />
              Comedy Background
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                  When did you start doing comedy?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="date"
                    value={formData.comedy_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, comedy_start_date: e.target.value }))}
                    className="px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#7B2FF7] focus:ring-1 focus:ring-[#7B2FF7] transition-colors"
                  />
                  {calculateYearsOfExperience() !== null && (
                    <span className="text-[#A0A0A0]">
                      ({calculateYearsOfExperience()} {calculateYearsOfExperience() === 1 ? 'year' : 'years'} of experience)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#E0E0E0] mb-3">
                  Comedy Styles (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMEDY_STYLES.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.comedy_styles.includes(style)
                          ? 'bg-[#7B2FF7] text-white'
                          : 'bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#252525] border border-[#333]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FFB627]" />
              Social Links
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="instagram"
                label="Instagram"
                value={formData.social_links.instagram || ''}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                placeholder="@yourhandle"
                icon={<Instagram className="w-4 h-4" />}
              />
              
              <Input
                id="youtube"
                label="YouTube"
                value={formData.social_links.youtube || ''}
                onChange={(e) => updateSocialLink('youtube', e.target.value)}
                placeholder="Channel URL"
                icon={<Youtube className="w-4 h-4" />}
              />
              
              <Input
                id="tiktok"
                label="TikTok"
                value={formData.social_links.tiktok || ''}
                onChange={(e) => updateSocialLink('tiktok', e.target.value)}
                placeholder="@yourhandle"
                icon={<Music className="w-4 h-4" />}
              />
              
              <Input
                id="twitter"
                label="X (Twitter)"
                value={formData.social_links.twitter || ''}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                placeholder="@yourhandle"
                icon={<Twitter className="w-4 h-4" />}
              />
              
              <Input
                id="website"
                label="Personal Website"
                value={formData.social_links.website || ''}
                onChange={(e) => updateSocialLink('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                icon={<ExternalLink className="w-4 h-4" />}
              />

              <Input
                id="spotify"
                label="Spotify (Comedy Album)"
                value={formData.social_links.spotify || ''}
                onChange={(e) => updateSocialLink('spotify', e.target.value)}
                placeholder="Album/Artist URL"
                icon={<Music className="w-4 h-4" />}
              />
            </div>
          </Card>

          {/* Video Clips */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#FF6B6B]" />
              Video Clips
            </h2>
            
            <p className="text-[#A0A0A0] text-sm mb-4">
              Add links to your best sets. Venues love seeing your work!
            </p>

            {/* Existing clips */}
            {formData.video_clips.length > 0 && (
              <div className="space-y-3 mb-6">
                {formData.video_clips.map((clip, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl">
                    <Video className="w-5 h-5 text-[#7B2FF7]" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{clip.title}</p>
                      <p className="text-[#A0A0A0] text-sm truncate">{clip.url}</p>
                    </div>
                    <span className="px-2 py-1 bg-[#252525] rounded text-xs text-[#A0A0A0] capitalize">
                      {clip.platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVideoClip(index)}
                      className="p-1 text-[#A0A0A0] hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new clip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                id="clip_title"
                label="Title"
                value={newVideoClip.title}
                onChange={(e) => setNewVideoClip(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Set at Comedy Club"
              />
              
              <Input
                id="clip_url"
                label="URL"
                value={newVideoClip.url}
                onChange={(e) => setNewVideoClip(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://youtube.com/..."
                className="md:col-span-2"
              />
              
              <div>
                <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Platform</label>
                <div className="flex gap-2">
                  <select
                    value={newVideoClip.platform}
                    onChange={(e) => setNewVideoClip(prev => ({ ...prev, platform: e.target.value as VideoClip['platform'] }))}
                    className="flex-1 px-3 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="other">Other</option>
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addVideoClip}
                    disabled={!newVideoClip.title || !newVideoClip.url}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Check className="w-5 h-5 text-[#00F5D4]" />
              Booking Availability
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available_for_booking}
                    onChange={(e) => setFormData(prev => ({ ...prev, available_for_booking: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B2FF7]"></div>
                </label>
                <span className="text-white font-medium">Available for booking</span>
              </div>

              {formData.available_for_booking && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="booking_rate"
                    label="Rate / Pricing Info"
                    value={formData.booking_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, booking_rate: e.target.value }))}
                    placeholder="Contact for rates, $500-1000, etc."
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Travel Radius</label>
                    <select
                      value={formData.travel_radius}
                      onChange={(e) => setFormData(prev => ({ ...prev, travel_radius: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                    >
                      <option value="">Select range</option>
                      {TRAVEL_RADIUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#E0E0E0] mb-3">
                      Performance Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PERFORMANCE_TYPES.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => togglePerformanceType(type.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            formData.performance_types.includes(type.value)
                              ? 'bg-[#F72585] text-white'
                              : 'bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#252525] border border-[#333]'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Public Profile</h3>
                <p className="text-[#A0A0A0] text-sm">
                  Allow venues and other comedians to find you in the directory
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B2FF7]"></div>
              </label>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

