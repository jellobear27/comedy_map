export type UserRole = 'comedian' | 'venue' | 'host' | 'promoter'

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

export interface Comedian extends User {
  role: 'comedian'
  years_experience?: number
  comedy_styles?: string[]
  social_links?: {
    instagram?: string
    twitter?: string
    youtube?: string
    tiktok?: string
  }
  credits?: string[]
}

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

