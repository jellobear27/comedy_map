export type UserRole = 'comedian' | 'venue' | 'host' | 'promoter' | 'superfan'

// Superfan-specific types
export interface SuperfanProfile {
  id: string
  favorite_comedians?: string[]
  shows_attended: number
  badges: SuperfanBadge[]
  membership_tier: 'free' | 'premium'
  premium_until?: string
}

export interface SuperfanBadge {
  id: string
  type: BadgeType
  name: string
  description: string
  icon: string
  earned_at: string
}

export type BadgeType = 
  | 'first_show'      // Attended first show
  | 'regular'         // 5 shows attended
  | 'superfan'        // 10 shows attended
  | 'legendary'       // 25 shows attended
  | 'comedy_addict'   // 50 shows attended
  | 'pioneer'         // Early adopter
  | 'social_butterfly' // 10 forum posts
  | 'hype_master'     // 50 event hypes
  | 'reviewer'        // 10 show reviews

export const BADGE_DEFINITIONS: Record<BadgeType, { name: string; description: string; icon: string; requirement: number }> = {
  first_show: { name: 'First Laugh', description: 'Attended your first comedy show', icon: '🎭', requirement: 1 },
  regular: { name: 'Regular', description: 'Attended 5 comedy shows', icon: '⭐', requirement: 5 },
  superfan: { name: 'Superfan', description: 'Attended 10 comedy shows', icon: '🌟', requirement: 10 },
  legendary: { name: 'Legendary', description: 'Attended 25 comedy shows', icon: '👑', requirement: 25 },
  comedy_addict: { name: 'Comedy Addict', description: 'Attended 50 comedy shows', icon: '🎪', requirement: 50 },
  pioneer: { name: 'Pioneer', description: 'Early NovaActa adopter', icon: '🚀', requirement: 0 },
  social_butterfly: { name: 'Social Butterfly', description: 'Made 10 forum posts', icon: '🦋', requirement: 10 },
  hype_master: { name: 'Hype Master', description: 'Hyped 50 upcoming events', icon: '🔥', requirement: 50 },
  reviewer: { name: 'Critic', description: 'Wrote 10 show reviews', icon: '✍️', requirement: 10 },
}

export interface Superfan extends User {
  role: 'superfan'
  superfan_profile?: SuperfanProfile
}

export interface ShowAttendance {
  id: string
  user_id: string
  event_id: string
  event_name: string
  venue_name: string
  attended_at: string
  review?: string
  rating?: number
}

export interface EventHype {
  id: string
  user_id: string
  event_id: string
  event_name: string
  venue_name: string
  event_date: string
  hype_message?: string
  created_at: string
}

// Roast Thread types
export interface RoastThread {
  id: string
  user_id: string
  title: string
  description?: string
  photo_url?: string
  is_active: boolean
  roast_count: number
  best_roast_id?: string
  created_at: string
  closed_at?: string
  author?: User
}

export interface Roast {
  id: string
  thread_id: string
  author_id: string
  content: string
  fire_count: number
  is_reported: boolean
  is_hidden: boolean
  created_at: string
  author?: User
}

export interface RoastReport {
  id: string
  roast_id: string
  reporter_id: string
  reason: 'harassment' | 'racism' | 'homophobia' | 'personal_attack' | 'other'
  details?: string
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
  created_at: string
  reviewed_at?: string
}

// Workshop Group types
export interface WorkshopGroup {
  id: string
  name: string
  description?: string
  cover_image_url?: string
  owner_id: string
  max_members: number
  is_private: boolean
  invite_code?: string
  member_count: number
  created_at: string
  updated_at: string
  owner?: User
}

export interface WorkshopMembership {
  id: string
  group_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
  user?: User
}

export interface WorkshopPost {
  id: string
  group_id: string
  author_id: string
  title: string
  content: string
  post_type: 'joke' | 'bit' | 'premise' | 'crowdwork' | 'setlist' | 'other'
  video_url?: string
  status: 'draft' | 'seeking_feedback' | 'revised' | 'stage_ready'
  feedback_count: number
  created_at: string
  updated_at: string
  author?: User
}

export interface WorkshopFeedback {
  id: string
  post_id: string
  author_id: string
  content: string
  feedback_type: 'general' | 'punchline' | 'premise' | 'timing' | 'wording' | 'structure'
  rating?: 'hits' | 'almost' | 'needs_work'
  is_helpful: boolean
  created_at: string
  author?: User
}

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  bio?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface VideoClip {
  title: string
  url: string
  platform: 'youtube' | 'tiktok' | 'instagram' | 'vimeo' | 'other'
}

export interface SocialLinks {
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  website?: string
  spotify?: string
}

export interface ComedianProfile {
  id: string
  username?: string
  headline?: string
  comedy_start_date?: string
  years_experience?: number
  comedy_styles?: string[]
  social_links?: SocialLinks
  video_clips?: VideoClip[]
  credits?: string[]
  available_for_booking?: boolean
  booking_rate?: string
  travel_radius?: 'local' | 'regional' | 'national' | 'international'
  performance_types?: ('standup' | 'hosting' | 'corporate' | 'private' | 'festival')[]
}

export interface Comedian extends User {
  role: 'comedian'
  city?: string
  state?: string
  profile_photo_url?: string
  is_public?: boolean
  comedian_profile?: ComedianProfile
  // Legacy fields for backward compatibility
  years_experience?: number
  comedy_styles?: string[]
  social_links?: SocialLinks
  credits?: string[]
}

export const COMEDY_STYLES = [
  'Observational',
  'Self-deprecating',
  'Dark/Edgy',
  'Political',
  'Storytelling',
  'One-liners',
  'Improv',
  'Sketch',
  'Musical',
  'Absurdist',
  'Roast',
  'Clean/Family',
  'Alternative',
  'Crowd Work',
] as const

export const PERFORMANCE_TYPES = [
  { value: 'standup', label: 'Stand-up Comedy' },
  { value: 'hosting', label: 'Hosting/MC' },
  { value: 'corporate', label: 'Corporate Events' },
  { value: 'private', label: 'Private Parties' },
  { value: 'festival', label: 'Festivals' },
] as const

export const TRAVEL_RADIUS_OPTIONS = [
  { value: 'local', label: 'Local Only (50 miles)' },
  { value: 'regional', label: 'Regional (250 miles)' },
  { value: 'national', label: 'National (US-wide)' },
  { value: 'international', label: 'International' },
] as const

export interface Venue extends User {
  role: 'venue'
  venue_name: string
  address: string
  city: string
  state: string
  zip_code: string
  capacity?: number
  venue_type?: 'club' | 'bar' | 'theater' | 'restaurant' | 'other'
  amenities?: string[]
  contact_phone?: string
  website?: string
}

export interface OpenMic {
  id: string
  venue_id: string
  host_id: string
  name: string
  description?: string
  address: string
  city: string
  state: string
  zip_code: string
  day_of_week: number // 0-6, Sunday-Saturday
  start_time: string // HH:MM format
  end_time?: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'one-time'
  signup_type: 'first-come' | 'list' | 'bucket' | 'online'
  time_per_comic?: number // minutes
  is_active: boolean
  cover_charge?: number
  drink_minimum?: boolean
  parking_info?: string
  notes?: string
  created_at: string
  updated_at: string
  venue?: Venue
  host?: User
}

export interface Course {
  id: string
  instructor_id: string
  title: string
  description: string
  price: number
  thumbnail_url?: string
  duration_hours?: number
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  topics: string[]
  lessons_count: number
  enrolled_count: number
  rating?: number
  is_published: boolean
  created_at: string
  updated_at: string
  instructor?: User
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description?: string
  video_url?: string
  content?: string
  order_index: number
  duration_minutes?: number
  is_free_preview: boolean
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  progress: number
  completed_lessons: string[]
  enrolled_at: string
  completed_at?: string
}

export interface CommunityPost {
  id: string
  author_id: string
  title: string
  content: string
  category: 'advice' | 'discussion' | 'question' | 'success-story' | 'resource'
  tags?: string[]
  likes_count: number
  comments_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  author?: User
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  content: string
  likes_count: number
  created_at: string
  author?: User
}

export interface HostConnection {
  id: string
  venue_id: string
  host_id: string
  status: 'pending' | 'accepted' | 'declined'
  message?: string
  created_at: string
}

export type USState = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY' | 'DC'

export const US_STATES: { value: USState; label: string }[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

