'use client'

import { Heart, Link2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import { COMEDY_STYLES, SUPERFAN_SHOW_FREQUENCY } from '@/types'

export type SuperfanFormSlice = {
  public_slug: string
  preferred_styles: string[]
  show_frequency: string
  favorite_local_names: string
}

type Props = {
  value: SuperfanFormSlice
  onChange: (next: SuperfanFormSlice) => void
}

export default function SuperfanProfileFields({ value, onChange }: Props) {
  const toggleStyle = (style: string) => {
    const next = value.preferred_styles.includes(style)
      ? value.preferred_styles.filter((s) => s !== style)
      : [...value.preferred_styles, style]
    onChange({ ...value, preferred_styles: next })
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Heart className="w-5 h-5 text-[#00F5D4]" />
        Superfan profile
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
            Public profile URL
          </label>
          <div className="flex flex-wrap items-center gap-2 text-[#A0A0A0] text-sm mb-2">
            <span>novaacta.com/superfans/</span>
          </div>
          <input
            type="text"
            value={value.public_slug}
            onChange={(e) =>
              onChange({
                ...value,
                public_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
              })
            }
            placeholder="your-handle"
            className="w-full max-w-md px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#00F5D4] transition-colors"
          />
          <p className="text-xs text-[#666] mt-2">
            Letters, numbers, and hyphens only. This powers your shareable fan card.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0] mb-3">
            What kind of comedy do you love?
          </label>
          <div className="flex flex-wrap gap-2">
            {COMEDY_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  value.preferred_styles.includes(style)
                    ? 'bg-[#00F5D4]/20 border border-[#00F5D4]/50 text-[#00F5D4]'
                    : 'bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#252525] border border-[#333]'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
            How often do you go to live comedy?
          </label>
          <select
            value={value.show_frequency}
            onChange={(e) => onChange({ ...value, show_frequency: e.target.value })}
            className="w-full max-w-md px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#00F5D4] transition-colors"
          >
            <option value="">Select…</option>
            {SUPERFAN_SHOW_FREQUENCY.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
            Favorite local comedians
          </label>
          <textarea
            value={value.favorite_local_names}
            onChange={(e) => onChange({ ...value, favorite_local_names: e.target.value })}
            placeholder={'One per line or comma-separated — e.g.\nJamie Kim\nAlex Ortiz'}
            rows={5}
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#00F5D4] transition-colors resize-y min-h-[120px]"
          />
          <p className="text-xs text-[#666] mt-2 flex items-start gap-1">
            <Link2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Shout out locals you love — names only for now; linking to NovaActa profiles can come later.
          </p>
        </div>
      </div>
    </Card>
  )
}
