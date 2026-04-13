'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  User, Camera, MapPin, Calendar, Globe, Instagram, Youtube, 
  Twitter, Video, Plus, X, Loader2, Check, ExternalLink, Music, Upload
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import SuperfanProfileFields from '@/components/superfan/SuperfanProfileFields'
import VenueProfileFields from '@/components/venue/VenueProfileFields'
import { createClient } from '@/lib/supabase/client'
import {
  getAuthRoleHintFromClient,
  resolveAccountRoleWithHints,
  shouldPersistResolvedRole,
  type AccountRole,
} from '@/lib/account-role'
import { 
  COMEDY_STYLES, 
  PERFORMANCE_TYPES, 
  TRAVEL_RADIUS_OPTIONS,
  US_STATES,
  VideoClip,
  SocialLinks
} from '@/types'

function parseFavoriteLocalNames(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

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
  /** Calendar year they started comedy (stored in DB as YYYY-01-01) */
  comedy_start_year: string
  comedy_styles: string[]
  social_links: SocialLinks
  video_clips: VideoClip[]
  available_for_booking: boolean
  booking_rate: string
  travel_radius: string
  performance_types: string[]

  // Superfan profile
  superfan_public_slug: string
  superfan_preferred_styles: string[]
  superfan_show_frequency: string
  superfan_favorite_local_text: string

  // Venue profile
  venue_name: string
  venue_contact_phone: string
  venue_website: string
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
  comedy_start_year: '',
  comedy_styles: [],
  social_links: {},
  video_clips: [],
  available_for_booking: false,
  booking_rate: '',
  travel_radius: '',
  performance_types: [],
  superfan_public_slug: '',
  superfan_preferred_styles: [],
  superfan_show_frequency: '',
  superfan_favorite_local_text: '',
  venue_name: '',
  venue_contact_phone: '',
  venue_website: '',
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [newVideoClip, setNewVideoClip] = useState<VideoClip>({ title: '', url: '', platform: 'youtube' })
  const [accountRole, setAccountRole] = useState<AccountRole>('comedian')

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

      const authRoleHint = await getAuthRoleHintFromClient(supabase)

      const [
        { data: profile },
        { data: comedianProfile },
        { data: superfanProfile },
        { data: venueProfile },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('comedian_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('superfan_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('venue_profiles').select('*').eq('id', user.id).maybeSingle(),
      ])

      const resolvedRole = resolveAccountRoleWithHints(profile?.role, authRoleHint, {
        hasSuperfanProfileRow: !!superfanProfile,
        hasVenueProfileRow: !!venueProfile,
      })

      if (profile && shouldPersistResolvedRole(profile.role, resolvedRole)) {
        await supabase
          .from('profiles')
          .update({ role: resolvedRole, updated_at: new Date().toISOString() })
          .eq('id', user.id)
      }

      setAccountRole(resolvedRole)

      const locals = superfanProfile?.favorite_local_names as string[] | undefined

      if (profile) {
        setFormData({
          ...initialFormData,
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          city: profile.city || '',
          state: profile.state || '',
          profile_photo_url: profile.profile_photo_url || profile.avatar_url || '',
          is_public: profile.is_public ?? true,
          username: comedianProfile?.username || '',
          headline: comedianProfile?.headline || '',
          comedy_start_year: (() => {
            const raw = comedianProfile?.comedy_start_date
            if (!raw) return ''
            const y = new Date(raw as string).getFullYear()
            return Number.isNaN(y) ? '' : String(y)
          })(),
          comedy_styles: comedianProfile?.comedy_styles || [],
          social_links: comedianProfile?.social_links || {},
          video_clips: comedianProfile?.video_clips || [],
          available_for_booking: comedianProfile?.available_for_booking || false,
          booking_rate: comedianProfile?.booking_rate || '',
          travel_radius: comedianProfile?.travel_radius || '',
          performance_types: comedianProfile?.performance_types || [],
          superfan_public_slug: superfanProfile?.public_slug || '',
          superfan_preferred_styles: superfanProfile?.preferred_comedy_styles || [],
          superfan_show_frequency: superfanProfile?.show_frequency || '',
          superfan_favorite_local_text: locals?.length ? locals.join('\n') : '',
          venue_name: venueProfile?.venue_name || '',
          venue_contact_phone: venueProfile?.contact_phone || '',
          venue_website: venueProfile?.website || '',
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

      const role = accountRole

      const currentYear = new Date().getFullYear()
      let comedyStartDate: string | null = null
      if (role === 'comedian') {
        const yearRaw = String(formData.comedy_start_year ?? '').trim()
        const digitsOnly = yearRaw.replace(/\D/g, '')
        if (digitsOnly.length > 0) {
          const y = parseInt(digitsOnly.slice(0, 4), 10)
          if (Number.isNaN(y) || y < 1970 || y > currentYear) {
            setMessage({
              type: 'error',
              text: `Enter a valid year between 1970 and ${currentYear} (e.g. 2018), or clear the field.`,
            })
            setIsSaving(false)
            return
          }
          comedyStartDate = `${y}-01-01`
        }
      }

      let superfanSlug: string | null = null
      if (role === 'superfan') {
        const raw = formData.superfan_public_slug.trim()
        if (raw.length > 0) {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw) || raw.length < 2) {
            setMessage({
              type: 'error',
              text: 'Public URL must be 2+ characters: lowercase letters, numbers, and single hyphens between segments.',
            })
            setIsSaving(false)
            return
          }
          superfanSlug = raw
        }
      }

      if (role === 'venue') {
        const vn = formData.venue_name.trim()
        if (!vn) {
          setMessage({ type: 'error', text: 'Please enter your venue name.' })
          setIsSaving(false)
          return
        }
      }

      const dbRole: 'comedian' | 'superfan' | 'venue' =
        role === 'superfan' ? 'superfan' : role === 'venue' ? 'venue' : 'comedian'

      // Update base profile (persist role so DB matches signup / UI)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            email: user.email,
            full_name: formData.full_name,
            bio: formData.bio,
            city: formData.city,
            state: formData.state,
            profile_photo_url: formData.profile_photo_url,
            is_public: formData.is_public,
            role: dbRole,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (profileError) {
        console.error('Profile update error:', profileError.message, profileError.code, profileError.details)
        throw new Error(profileError.message)
      }

      if (role === 'comedian') {
        const { error: comedianError } = await supabase
          .from('comedian_profiles')
          .upsert(
            {
              id: user.id,
              username: formData.username || null,
              headline: formData.headline,
              comedy_start_date: comedyStartDate,
              comedy_styles: formData.comedy_styles,
              social_links: formData.social_links,
              video_clips: formData.video_clips,
              available_for_booking: formData.available_for_booking,
              booking_rate: formData.booking_rate,
              travel_radius: formData.travel_radius,
              performance_types: formData.performance_types,
            },
            { onConflict: 'id' }
          )

        if (comedianError) {
          console.error('Comedian profile error:', comedianError.message, comedianError.code, comedianError.details)
          throw new Error(comedianError.message)
        }

        if (formData.username) {
          router.push(`/comedians/${formData.username}`)
        } else {
          setMessage({ type: 'success', text: 'Profile saved! Set a username to view your public profile.' })
        }
        return
      }

      if (role === 'superfan') {
        const favoriteLocals = parseFavoriteLocalNames(formData.superfan_favorite_local_text)
        const { error: superfanError } = await supabase
          .from('superfan_profiles')
          .upsert(
            {
              id: user.id,
              public_slug: superfanSlug,
              preferred_comedy_styles: formData.superfan_preferred_styles,
              show_frequency: formData.superfan_show_frequency.trim() || null,
              favorite_local_names: favoriteLocals,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          )

        if (superfanError) {
          console.error('Superfan profile error:', superfanError.message, superfanError.code, superfanError.details)
          throw new Error(superfanError.message)
        }

        if (superfanSlug) {
          router.push(`/superfans/${superfanSlug}`)
        } else {
          setMessage({
            type: 'success',
            text: 'Profile saved! Add a public URL slug to share your fan card.',
          })
        }
        return
      }

      if (role === 'venue') {
        const { error: venueError } = await supabase
          .from('venue_profiles')
          .upsert(
            {
              id: user.id,
              venue_name: formData.venue_name.trim(),
              contact_phone: formData.venue_contact_phone.trim() || null,
              website: formData.venue_website.trim() || null,
              city: formData.city.trim() || null,
              state: formData.state.trim() || null,
            },
            { onConflict: 'id' }
          )

        if (venueError) {
          console.error('Venue profile error:', venueError.message, venueError.code, venueError.details)
          throw new Error(venueError.message)
        }

        setMessage({ type: 'success', text: 'Venue profile saved.' })
        return
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      const detail = error instanceof Error ? error.message : 'Failed to save profile. Please try again.'
      setMessage({ type: 'error', text: detail })
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
    const digits = String(formData.comedy_start_year ?? '')
      .replace(/\D/g, '')
      .slice(0, 4)
    if (digits.length < 4) return null
    const start = new Date(`${digits}-01-01`)
    if (Number.isNaN(start.getTime())) return null
    const now = new Date()
    const years = Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return Math.max(0, years)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' })
      return
    }

    setIsUploadingPhoto(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setMessage({ type: 'error', text: 'Please log in to upload a photo' })
        return
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        // If bucket doesn't exist, fall back to URL input
        console.error('Upload error:', uploadError)
        setMessage({ type: 'error', text: 'Photo upload not configured. Please use a URL instead or contact support.' })
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, profile_photo_url: publicUrl }))
      setMessage({ type: 'success', text: 'Photo uploaded successfully!' })
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'Failed to upload photo. Try using a URL instead.' })
    } finally {
      setIsUploadingPhoto(false)
    }
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Your Profile</h1>
            <p className="text-[#A0A0A0]">
              {accountRole === 'comedian' && (
                <>Build your comedian profile to get discovered by venues and connect with the community.</>
              )}
              {accountRole === 'superfan' && (
                <>Customize your public fan card: comedy taste, how often you go out, and locals you love.</>
              )}
              {accountRole === 'venue' && (
                <>Keep your venue details current so comedians and fans can find you.</>
              )}
            </p>
          </div>
          {accountRole === 'comedian' && formData.username ? (
            <Link href={`/comedians/${formData.username}`}>
              <Button variant="secondary" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View Public Profile
              </Button>
            </Link>
          ) : accountRole === 'superfan' && formData.superfan_public_slug ? (
            <Link href={`/superfans/${formData.superfan_public_slug}`}>
              <Button variant="secondary" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                View public card
              </Button>
            </Link>
          ) : accountRole === 'comedian' ? (
            <div className="text-sm text-[#A0A0A0] bg-[#1A0033]/40 px-4 py-2 rounded-xl border border-[#7B2FF7]/20">
              💡 Set a username below to get your public profile link
            </div>
          ) : accountRole === 'superfan' ? (
            <div className="text-sm text-[#A0A0A0] bg-[#00F5D4]/10 px-4 py-2 rounded-xl border border-[#00F5D4]/25">
              Add a URL slug below to share your fan card
            </div>
          ) : null}
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
                label={
                  accountRole === 'venue'
                    ? 'Contact / organizer name'
                    : accountRole === 'superfan'
                      ? 'Display name'
                      : 'Full Name / Stage Name'
                }
                value={formData.full_name ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder={
                  accountRole === 'venue'
                    ? 'Booker or GM name'
                    : accountRole === 'superfan'
                      ? 'How you appear on your fan card'
                      : 'Your name or stage name'
                }
              />
              
              {accountRole === 'comedian' && (
                <>
                  <Input
                    id="username"
                    label="Username"
                    value={formData.username ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') }))}
                    placeholder="yourname"
                    icon={<User className="w-4 h-4" />}
                  />
                  {formData.username && (
                    <p className="text-xs text-[#A0A0A0] -mt-4 md:col-span-2">
                      Your profile: <span className="text-[#7B2FF7]">novaacta.com/comedians/{formData.username}</span>
                    </p>
                  )}
                  
                  <Input
                    id="headline"
                    label="Headline"
                    value={formData.headline ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                    placeholder="e.g., Denver-based observational comic"
                  />
                </>
              )}
            </div>

            {/* Profile Photo Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Profile Photo</label>
              <div className="flex items-start gap-6">
                {/* Photo Preview */}
                <div className="flex-shrink-0">
                  {formData.profile_photo_url ? (
                    <div className="relative">
                      <img
                        src={formData.profile_photo_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-xl object-cover border-2 border-[#7B2FF7]/30"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, profile_photo_url: '' }))}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-[#1A1A1A] border-2 border-dashed border-[#333] flex items-center justify-center">
                      <Camera className="w-8 h-8 text-[#666]" />
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-2 bg-[#7B2FF7] hover:bg-[#6B1FE7] text-white rounded-xl cursor-pointer transition-colors inline-flex items-center gap-2">
                        {isUploadingPhoto ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload Photo
                          </>
                        )}
                      </span>
                      <span className="text-sm text-[#666]">or</span>
                    </div>
                  </label>
                  
                  <input
                    type="url"
                    value={formData.profile_photo_url ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, profile_photo_url: e.target.value }))}
                    placeholder="Paste image URL"
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-[#666] text-sm focus:outline-none focus:border-[#7B2FF7] transition-colors"
                  />
                  <p className="text-xs text-[#666]">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Bio</label>
              <textarea
                value={formData.bio ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder={
                  accountRole === 'superfan'
                    ? 'A line or two about you as a comedy fan…'
                    : accountRole === 'venue'
                      ? 'What makes your room special for comedians and audiences?'
                      : 'Tell venues and fellow comedians about yourself, your comedy journey, and what makes you unique...'
                }
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
                value={formData.city ?? ''}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Denver"
              />
              
              <div>
                <label className="block text-sm font-medium text-[#E0E0E0] mb-2">State</label>
                <select
                  value={formData.state ?? ''}
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

          {accountRole === 'superfan' && (
            <SuperfanProfileFields
              value={{
                public_slug: formData.superfan_public_slug,
                preferred_styles: formData.superfan_preferred_styles,
                show_frequency: formData.superfan_show_frequency,
                favorite_local_names: formData.superfan_favorite_local_text,
              }}
              onChange={(next) =>
                setFormData((prev) => ({
                  ...prev,
                  superfan_public_slug: next.public_slug,
                  superfan_preferred_styles: next.preferred_styles,
                  superfan_show_frequency: next.show_frequency,
                  superfan_favorite_local_text: next.favorite_local_names,
                }))
              }
            />
          )}

          {accountRole === 'venue' && (
            <VenueProfileFields
              value={{
                venue_name: formData.venue_name,
                contact_phone: formData.venue_contact_phone,
                website: formData.venue_website,
              }}
              onChange={(next) =>
                setFormData((prev) => ({
                  ...prev,
                  venue_name: next.venue_name,
                  venue_contact_phone: next.contact_phone,
                  venue_website: next.website,
                }))
              }
            />
          )}

          {accountRole === 'comedian' && (
          <>
          {/* Comedy Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00F5D4]" />
              Comedy Background
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                  What year did you start doing comedy?
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1970}
                    max={new Date().getFullYear()}
                    step={1}
                    placeholder="e.g. 2018"
                    value={formData.comedy_start_year ?? ''}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setFormData((prev) => ({ ...prev, comedy_start_year: v }))
                    }}
                    className="w-36 px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#7B2FF7] focus:ring-1 focus:ring-[#7B2FF7] transition-colors"
                  />
                  {calculateYearsOfExperience() !== null && (
                    <span className="text-[#A0A0A0] text-sm">
                      (~{calculateYearsOfExperience()}{' '}
                      {calculateYearsOfExperience() === 1 ? 'year' : 'years'} of experience)
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#666] mt-2">
                  We only need the year—exact dates are easy to forget.
                </p>
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
                    checked={!!formData.available_for_booking}
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
                    value={formData.booking_rate ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, booking_rate: e.target.value }))}
                    placeholder="Contact for rates, $500-1000, etc."
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-[#E0E0E0] mb-2">Travel Radius</label>
                    <select
                      value={formData.travel_radius ?? ''}
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
          </>
          )}

          {/* Privacy */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Public Profile</h3>
                <p className="text-[#A0A0A0] text-sm">
                  {accountRole === 'comedian' && (
                    <>Allow venues and other comedians to find you in the directory</>
                  )}
                  {accountRole === 'superfan' && (
                    <>When on, your fan card can be viewed at your public URL (if you set a slug).</>
                  )}
                  {accountRole === 'venue' && (
                    <>Controls visibility of your listing in NovaActa where applicable.</>
                  )}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_public !== false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7B2FF7]"></div>
              </label>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} isLoading={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

