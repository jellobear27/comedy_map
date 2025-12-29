'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit2, 
  MapPin, 
  Clock, 
  Calendar,
  Search,
  ChevronDown,
  X,
  Check,
  Mic
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { US_STATES } from '@/types'
import { createClient } from '@/lib/supabase/client'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

interface OpenMicFormData {
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
  venue_name: string
  host_name: string
  contact_email: string
  website: string
}

const initialFormData: OpenMicFormData = {
  name: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  day_of_week: 1,
  start_time: '20:00',
  end_time: '22:00',
  frequency: 'weekly',
  signup_type: 'list',
  time_per_comic: 5,
  cover_charge: 0,
  drink_minimum: false,
  parking_info: '',
  notes: '',
  venue_name: '',
  host_name: '',
  contact_email: '',
  website: '',
}

interface OpenMicEntry extends OpenMicFormData {
  id: string
  is_active: boolean
  created_at: string
}

export default function AdminOpenMicsPage() {
  const [openMics, setOpenMics] = useState<OpenMicEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<OpenMicFormData>(initialFormData)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterDay, setFilterDay] = useState<number | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [csvData, setCsvData] = useState('')
  const [importPreview, setImportPreview] = useState<OpenMicFormData[]>([])

  // Load open mics from Supabase
  useEffect(() => {
    loadOpenMics()
  }, [])

  const loadOpenMics = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('open_mics')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setOpenMics(data as OpenMicEntry[])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const openMicData = {
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
        notes: formData.notes || null,
        is_active: true,
      }

      if (editingId) {
        const { error } = await supabase
          .from('open_mics')
          .update(openMicData)
          .eq('id', editingId)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('open_mics')
          .insert([openMicData])
        
        if (error) throw error
      }

      await loadOpenMics()
      setIsModalOpen(false)
      setFormData(initialFormData)
      setEditingId(null)
    } catch (error) {
      console.error('Error saving open mic:', error)
      alert('Error saving open mic. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (openMic: OpenMicEntry) => {
    setFormData({
      name: openMic.name,
      description: openMic.description || '',
      address: openMic.address,
      city: openMic.city,
      state: openMic.state,
      zip_code: openMic.zip_code || '',
      day_of_week: openMic.day_of_week,
      start_time: openMic.start_time,
      end_time: openMic.end_time || '',
      frequency: openMic.frequency as OpenMicFormData['frequency'],
      signup_type: openMic.signup_type as OpenMicFormData['signup_type'],
      time_per_comic: openMic.time_per_comic || 5,
      cover_charge: openMic.cover_charge || 0,
      drink_minimum: openMic.drink_minimum || false,
      parking_info: openMic.parking_info || '',
      notes: openMic.notes || '',
      venue_name: '',
      host_name: '',
      contact_email: '',
      website: '',
    })
    setEditingId(openMic.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this open mic?')) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('open_mics')
      .delete()
      .eq('id', id)
    
    if (!error) {
      await loadOpenMics()
    }
  }

  const handleCSVImport = () => {
    try {
      const lines = csvData.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const parsed: OpenMicFormData[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const entry: Record<string, string | number | boolean> = {}
        
        headers.forEach((header, idx) => {
          entry[header] = values[idx] || ''
        })
        
        parsed.push({
          name: String(entry['name'] || ''),
          description: String(entry['description'] || ''),
          address: String(entry['address'] || ''),
          city: String(entry['city'] || ''),
          state: String(entry['state'] || ''),
          zip_code: String(entry['zip_code'] || entry['zip'] || ''),
          day_of_week: DAYS_OF_WEEK.find(d => 
            d.label.toLowerCase() === String(entry['day'] || entry['day_of_week'] || '').toLowerCase()
          )?.value || 0,
          start_time: String(entry['start_time'] || entry['time'] || '20:00'),
          end_time: String(entry['end_time'] || ''),
          frequency: (entry['frequency'] as OpenMicFormData['frequency']) || 'weekly',
          signup_type: (entry['signup_type'] as OpenMicFormData['signup_type']) || 'list',
          time_per_comic: Number(entry['time_per_comic']) || 5,
          cover_charge: Number(entry['cover_charge'] || entry['cover']) || 0,
          drink_minimum: entry['drink_minimum'] === 'true' || entry['drink_minimum'] === 'yes',
          parking_info: String(entry['parking_info'] || entry['parking'] || ''),
          notes: String(entry['notes'] || ''),
          venue_name: String(entry['venue_name'] || entry['venue'] || ''),
          host_name: String(entry['host_name'] || entry['host'] || ''),
          contact_email: String(entry['contact_email'] || entry['email'] || ''),
          website: String(entry['website'] || ''),
        })
      }
      
      setImportPreview(parsed)
    } catch (error) {
      console.error('CSV parsing error:', error)
      alert('Error parsing CSV. Please check the format.')
    }
  }

  const handleBulkImport = async () => {
    if (importPreview.length === 0) return
    
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      const openMicsToInsert = importPreview.map(item => ({
        name: item.name,
        description: item.description,
        address: item.address,
        city: item.city,
        state: item.state,
        zip_code: item.zip_code,
        day_of_week: item.day_of_week,
        start_time: item.start_time,
        end_time: item.end_time || null,
        frequency: item.frequency,
        signup_type: item.signup_type,
        time_per_comic: item.time_per_comic,
        cover_charge: item.cover_charge,
        drink_minimum: item.drink_minimum,
        parking_info: item.parking_info || null,
        notes: item.notes || null,
        is_active: true,
      }))

      const { error } = await supabase
        .from('open_mics')
        .insert(openMicsToInsert)
      
      if (error) throw error
      
      await loadOpenMics()
      setIsImportModalOpen(false)
      setCsvData('')
      setImportPreview([])
      alert(`Successfully imported ${importPreview.length} open mics!`)
    } catch (error) {
      console.error('Import error:', error)
      alert('Error importing open mics. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter open mics
  const filteredOpenMics = openMics.filter(mic => {
    const matchesSearch = mic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mic.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mic.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = !filterState || mic.state === filterState
    const matchesDay = filterDay === '' || mic.day_of_week === filterDay
    return matchesSearch && matchesState && matchesDay
  })

  return (
    <div className="min-h-screen bg-[#0D0016] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Mic className="w-8 h-8 text-[#7B2FF7]" />
              Open Mic Admin
            </h1>
            <p className="text-[#A0A0A0] mt-1">
              Manage open mic listings • {openMics.length} total
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={() => {
              setFormData(initialFormData)
              setEditingId(null)
              setIsModalOpen(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Open Mic
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
                <input
                  type="text"
                  placeholder="Search by name, city, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#7B2FF7]"
                />
              </div>
            </div>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
            >
              <option value="">All States</option>
              {US_STATES.map(state => (
                <option key={state.value} value={state.value}>{state.label}</option>
              ))}
            </select>
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value === '' ? '' : Number(e.target.value))}
              className="px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
            >
              <option value="">All Days</option>
              {DAYS_OF_WEEK.map(day => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Open Mics Table */}
        <div className="bg-[#1A0033]/40 backdrop-blur-xl border border-[#7B2FF7]/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7B2FF7]/20">
                  <th className="text-left py-4 px-6 text-[#A0A0A0] font-medium">Name</th>
                  <th className="text-left py-4 px-6 text-[#A0A0A0] font-medium">Location</th>
                  <th className="text-left py-4 px-6 text-[#A0A0A0] font-medium">Day & Time</th>
                  <th className="text-left py-4 px-6 text-[#A0A0A0] font-medium">Type</th>
                  <th className="text-left py-4 px-6 text-[#A0A0A0] font-medium">Status</th>
                  <th className="text-right py-4 px-6 text-[#A0A0A0] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpenMics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#A0A0A0]">
                      {openMics.length === 0 ? (
                        <div>
                          <Mic className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No open mics yet. Add your first one!</p>
                        </div>
                      ) : (
                        <p>No open mics match your filters.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredOpenMics.map((mic) => (
                    <tr key={mic.id} className="border-b border-[#7B2FF7]/10 hover:bg-[#7B2FF7]/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{mic.name}</div>
                        {mic.venue_name && (
                          <div className="text-sm text-[#A0A0A0]">{mic.venue_name}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#F72585] mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-white">{mic.city}, {mic.state}</div>
                            <div className="text-sm text-[#A0A0A0]">{mic.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#7B2FF7]" />
                          <span className="text-white">
                            {DAYS_OF_WEEK.find(d => d.value === mic.day_of_week)?.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-[#00F5D4]" />
                          <span className="text-[#A0A0A0]">{mic.start_time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-[#7B2FF7]/20 text-[#7B2FF7] rounded-full text-sm capitalize">
                          {mic.signup_type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          mic.is_active 
                            ? 'bg-[#00F5D4]/20 text-[#00F5D4]' 
                            : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                        }`}>
                          {mic.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(mic)}
                            className="p-2 text-[#A0A0A0] hover:text-[#7B2FF7] hover:bg-[#7B2FF7]/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(mic.id)}
                            className="p-2 text-[#A0A0A0] hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A0033] border border-[#7B2FF7]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#1A0033] border-b border-[#7B2FF7]/20 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Edit Open Mic' : 'Add New Open Mic'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#A0A0A0] hover:text-white hover:bg-[#7B2FF7]/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                  <Input
                    id="name"
                    label="Open Mic Name"
                    placeholder="Monday Night Comedy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Tell comedians what to expect..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#7B2FF7] resize-none"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Location</h3>
                  <Input
                    id="address"
                    label="Street Address"
                    placeholder="123 Comedy Lane"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <Input
                        id="city"
                        label="City"
                        placeholder="Los Angeles"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A0A0A0] mb-2">State</label>
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
                        label="ZIP"
                        placeholder="90001"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Schedule</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Day of Week</label>
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
                        label="Start Time"
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
                      <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Frequency</label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as OpenMicFormData['frequency'] })}
                        className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="one-time">One-time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#A0A0A0] mb-2">Signup Type</label>
                      <select
                        value={formData.signup_type}
                        onChange={(e) => setFormData({ ...formData, signup_type: e.target.value as OpenMicFormData['signup_type'] })}
                        className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white focus:outline-none focus:border-[#7B2FF7]"
                      >
                        <option value="list">Sign-up List</option>
                        <option value="first-come">First Come First Serve</option>
                        <option value="bucket">Bucket Draw</option>
                        <option value="online">Online Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Details</h3>
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
                        <span className="text-white">Drink Minimum</span>
                      </label>
                    </div>
                  </div>
                  <Input
                    id="parking_info"
                    label="Parking Info"
                    placeholder="Street parking available, lot in back..."
                    value={formData.parking_info}
                    onChange={(e) => setFormData({ ...formData, parking_info: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      placeholder="Any other info comedians should know..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#7B2FF7] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" isLoading={isLoading}>
                    {editingId ? 'Update' : 'Add'} Open Mic
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {isImportModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1A0033] border border-[#7B2FF7]/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#1A0033] border-b border-[#7B2FF7]/20 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Import Open Mics from CSV</h2>
                <button
                  onClick={() => {
                    setIsImportModalOpen(false)
                    setCsvData('')
                    setImportPreview([])
                  }}
                  className="p-2 text-[#A0A0A0] hover:text-white hover:bg-[#7B2FF7]/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                    CSV Template
                  </label>
                  <div className="bg-[#0D0016] rounded-xl p-4 text-sm text-[#A0A0A0] font-mono overflow-x-auto">
                    name,address,city,state,day,start_time,signup_type,time_per_comic,cover_charge
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                    Paste your CSV data
                  </label>
                  <textarea
                    placeholder="Paste CSV data here..."
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-[#1A0033]/50 border border-[#7B2FF7]/20 rounded-xl text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#7B2FF7] font-mono text-sm"
                  />
                </div>

                <Button type="button" variant="secondary" onClick={handleCSVImport}>
                  Parse & Preview
                </Button>

                {importPreview.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Preview ({importPreview.length} open mics)
                    </h3>
                    <div className="bg-[#0D0016] rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-[#1A0033]">
                          <tr>
                            <th className="text-left py-2 px-4 text-[#A0A0A0]">Name</th>
                            <th className="text-left py-2 px-4 text-[#A0A0A0]">City</th>
                            <th className="text-left py-2 px-4 text-[#A0A0A0]">Day</th>
                            <th className="text-left py-2 px-4 text-[#A0A0A0]">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importPreview.map((item, idx) => (
                            <tr key={idx} className="border-t border-[#7B2FF7]/10">
                              <td className="py-2 px-4 text-white">{item.name}</td>
                              <td className="py-2 px-4 text-[#A0A0A0]">{item.city}, {item.state}</td>
                              <td className="py-2 px-4 text-[#A0A0A0]">
                                {DAYS_OF_WEEK.find(d => d.value === item.day_of_week)?.label}
                              </td>
                              <td className="py-2 px-4 text-[#A0A0A0]">{item.start_time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setImportPreview([])}
                        className="flex-1"
                      >
                        Clear
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleBulkImport} 
                        className="flex-1"
                        isLoading={isLoading}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Import {importPreview.length} Open Mics
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

