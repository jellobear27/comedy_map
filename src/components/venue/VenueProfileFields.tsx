'use client'

import { Building2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

export type VenueFormSlice = {
  venue_name: string
  contact_phone: string
  website: string
}

type Props = {
  value: VenueFormSlice
  onChange: (next: VenueFormSlice) => void
}

export default function VenueProfileFields({ value, onChange }: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-[#F72585]" />
        Venue details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            id="venue_name"
            label="Venue name"
            value={value.venue_name}
            onChange={(e) => onChange({ ...value, venue_name: e.target.value })}
            placeholder="The Comedy Cellar"
          />
        </div>
        <Input
          id="venue_phone"
          label="Contact phone"
          value={value.contact_phone}
          onChange={(e) => onChange({ ...value, contact_phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
        <Input
          id="venue_website"
          label="Website"
          value={value.website}
          onChange={(e) => onChange({ ...value, website: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <p className="text-xs text-[#666] mt-4">
        City and state use your location above. Find talent and open mic tools live under For Venues.
      </p>
    </Card>
  )
}
