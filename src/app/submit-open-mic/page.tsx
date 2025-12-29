'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mic, 
  MapPin, 
  Clock, 
  Calendar,
  Send,
  CheckCircle,
  ArrowLeft,
  Info
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { US_STATES } from '@/types'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

interface SubmitFormData {
  // Open Mic Info
  name: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  day_of_week: number
  start_time: string
  end_time: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'one-time'
  signup_type: 'first-come' | 'list' | 'bucket' | 'online'
  time_per_comic: number
  cover_charge: number
  drink_minimum: boolean
  parking_info: string
  notes: string
  // Submitter Info
  submitter_name: string
  submitter_email: string
  submitter_role: 'comedian' | 'host' | 'venue' | 'other'
  venue_website: string
}

const initialFormData: SubmitFormData = {
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  day_of_week: 1,
  start_time: '20:00',
  end_time: '',
  frequency: 'weekly',
  signup_type: 'list',
  time_per_comic: 5,
  cover_charge: 0,
  drink_minimum: false,
  parking_info: '',
  notes: '',
  submitter_name: '',
  submitter_email: '',
  submitter_role: 'comedian',
  venue_website: '',
}

export default function SubmitOpenMicPage() {
  const [formData, setFormData] = useState<SubmitFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Insert into open_mics table (pending review)
      const { error: insertError } = await supabase
        .from('open_mics')
        .insert([{
          name: formData.name,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          day_of_week: formData.day_of_week,
          start_time: formData.start_time,
          end_time: formData.end_time || null,
          frequency: formData.frequency,
          signup_type: formData.signup_type,
          time_per_comic: formData.time_per_comic,
          cover_charge: formData.cover_charge,
          drink_minimum: formData.drink_minimum,
          parking_info: formData.parking_info || null,
          notes: `Submitted by: ${formData.submitter_name} (${formData.submitter_email}) - ${formData.submitter_role}\nWebsite: ${formData.venue_website}\n\n${formData.notes}`,
          is_active: true, // Could set to false for review workflow
        }])

      if (insertError) throw insertError

      setIsSubmitted(true)
    } catch (err) {
      console.error('Submission error:', err)
      setError('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#0D0016] pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#00F5D4]/30 rounded-3xl p-12">
              <div className="w-20 h-20 bg-[#00F5D4]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#00F5D4]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Thank You! 🎤
              </h1>
              <p className="text-[#A0A0A0] text-lg mb-8">
                Your open mic submission has been received. We&apos;ll review it and add it to the map shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setFormData(initialFormData)
                    setIsSubmitted(false)
                  }}
                  variant="secondary"
                >
                  Submit Another
                </Button>
                <Link href="/open-mics">
                  <Button>
                    Browse Open Mics
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0D0016] pt-32 pb-20 px-4">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7B2FF7]/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F72585]/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Back Link */}
          <Link 
            href="/open-mics" 
            className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Open Mics
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7B2FF7] to-[#F72585] rounded-2xl mb-6">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Submit an Open Mic
            </h1>
            <p className="text-[#A0A0A0] text-lg max-w-xl mx-auto">
              Know an open mic that&apos;s not on our map? Help fellow comedians discover it by submitting the details below.
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-[#7B2FF7]/10 border border-[#7B2FF7]/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#7B2FF7] flex-shrink-0 mt-0.5" />
            <p className="text-[#A0A0A0] text-sm">
              All submissions are reviewed before being added to the map. We&apos;ll verify the information and may reach out if we need clarification.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-[#FF6B6B]">
                {error}
              </div>
            )}

            {/* Open Mic Details */}
            <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#7B2FF7]/20">
                <Mic className="w-5 h-5 text-[#7B2FF7]" />
                <h2 className="text-xl font-semibold text-white">Open Mic Details</h2>
              </div>

              <Input
                id="name"
                label="Open Mic Name *"
                placeholder="Monday Night Comedy, The Laugh Factory Open Mic, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Description
                </label>
                <textarea
                  placeholder="What makes this open mic special? Any tips for first-timers?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#7B2FF7] resize-none"
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#7B2FF7]/20">
                <MapPin className="w-5 h-5 text-[#F72585]" />
                <h2 className="text-xl font-semibold text-white">Location</h2>
              </div>

              <Input
                id="address"
                label="Venue Address *"
                placeholder="123 Comedy Lane"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Input
                    id="city"
                    label="City *"
                    placeholder="Los Angeles"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                    required
                  >
                    <option value="">Select</option>
                    {US_STATES.map(state => (
                      <option key={state.value} value={state.value}>{state.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Input
                    id="zip_code"
                    label="ZIP Code"
                    placeholder="90001"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  />
                </div>
              </div>

              <Input
                id="venue_website"
                label="Venue Website"
                placeholder="https://venuewebsite.com"
                value={formData.venue_website}
                onChange={(e) => setFormData({ ...formData, venue_website: e.target.value })}
              />
            </div>

            {/* Schedule */}
            <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#7B2FF7]/20">
                <Calendar className="w-5 h-5 text-[#00F5D4]" />
                <h2 className="text-xl font-semibold text-white">Schedule</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Day of Week *</label>
                  <select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({ ...formData, day_of_week: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                    required
                  >
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Input
                    id="start_time"
                    type="time"
                    label="Start Time *"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    id="end_time"
                    type="time"
                    label="End Time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">How Often?</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as SubmitFormData['frequency'] })}
                    className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                  >
                    <option value="weekly">Every Week</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Monthly</option>
                    <option value="one-time">One-time Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">How to Sign Up?</label>
                  <select
                    value={formData.signup_type}
                    onChange={(e) => setFormData({ ...formData, signup_type: e.target.value as SubmitFormData['signup_type'] })}
                    className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                  >
                    <option value="list">Sign-up List (arrive early)</option>
                    <option value="first-come">First Come First Serve</option>
                    <option value="bucket">Bucket Draw</option>
                    <option value="online">Online Signup Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* More Details */}
            <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#7B2FF7]/20">
                <Clock className="w-5 h-5 text-[#FFB627]" />
                <h2 className="text-xl font-semibold text-white">Additional Details</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  id="time_per_comic"
                  type="number"
                  label="Minutes per Comic"
                  value={formData.time_per_comic}
                  onChange={(e) => setFormData({ ...formData, time_per_comic: Number(e.target.value) })}
                />
                <Input
                  id="cover_charge"
                  type="number"
                  label="Cover Charge ($)"
                  value={formData.cover_charge}
                  onChange={(e) => setFormData({ ...formData, cover_charge: Number(e.target.value) })}
                />
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer py-3">
                    <input
                      type="checkbox"
                      checked={formData.drink_minimum}
                      onChange={(e) => setFormData({ ...formData, drink_minimum: e.target.checked })}
                      className="w-5 h-5 rounded border-[#7B2FF7]/30 bg-[#1A0033]/50 text-[#7B2FF7] focus:ring-[#7B2FF7]"
                    />
                    <span className="text-white">Drink Minimum?</span>
                  </label>
                </div>
              </div>

              <Input
                id="parking_info"
                label="Parking Info"
                placeholder="Street parking, lot in back, etc."
                value={formData.parking_info}
                onChange={(e) => setFormData({ ...formData, parking_info: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Tips or Notes for Comedians
                </label>
                <textarea
                  placeholder="Arrive 30 min early, bring your own crowd for better spots, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#7B2FF7] resize-none"
                />
              </div>
            </div>

            {/* Submitter Info */}
            <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#7B2FF7]/20">
                <Send className="w-5 h-5 text-[#7B2FF7]" />
                <h2 className="text-xl font-semibold text-white">Your Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="submitter_name"
                  label="Your Name *"
                  placeholder="Jane Comedian"
                  value={formData.submitter_name}
                  onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                  required
                />
                <Input
                  id="submitter_email"
                  type="email"
                  label="Your Email *"
                  placeholder="you@example.com"
                  value={formData.submitter_email}
                  onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">How are you connected to this open mic?</label>
                <select
                  value={formData.submitter_role}
                  onChange={(e) => setFormData({ ...formData, submitter_role: e.target.value as SubmitFormData['submitter_role'] })}
                  className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                >
                  <option value="comedian">I&apos;ve performed here</option>
                  <option value="host">I host this open mic</option>
                  <option value="venue">I work at/own the venue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <p className="text-sm text-[#A0A0A0]">
                We&apos;ll only use your email to follow up if we have questions about this submission.
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              Submit Open Mic
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

