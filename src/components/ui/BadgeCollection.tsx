'use client'

import { useState } from 'react'
import { Trophy, Lock } from 'lucide-react'
import { BADGE_DEFINITIONS, BadgeType, SuperfanBadge } from '@/types'

interface BadgeCollectionProps {
  earnedBadges: SuperfanBadge[]
  showsAttended?: number
  className?: string
}

export default function BadgeCollection({ 
  earnedBadges, 
  showsAttended = 0,
  className = '' 
}: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null)

  const allBadgeTypes = Object.keys(BADGE_DEFINITIONS) as BadgeType[]
  const earnedBadgeTypes = earnedBadges.map(b => b.type as BadgeType)

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-[#FFB627]" />
        <h3 className="font-semibold text-white">Your Badges</h3>
        <span className="text-sm text-[#A0A0A0]">
          ({earnedBadges.length}/{allBadgeTypes.length})
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#A0A0A0]">Shows Attended</span>
          <span className="text-[#00F5D4] font-medium">{showsAttended}</span>
        </div>
        <div className="h-2 bg-[#1A0033] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00F5D4] to-[#7B2FF7] rounded-full transition-all duration-500"
            style={{ width: `${Math.min((showsAttended / 50) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#A0A0A0] mt-1">
          <span>0</span>
          <span>50 (Comedy Addict)</span>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {allBadgeTypes.map((badgeType) => {
          const definition = BADGE_DEFINITIONS[badgeType]
          const isEarned = earnedBadgeTypes.includes(badgeType)
          const earnedBadge = earnedBadges.find(b => b.type === badgeType)

          return (
            <button
              key={badgeType}
              onClick={() => setSelectedBadge(selectedBadge === badgeType ? null : badgeType)}
              className={`
                relative p-3 rounded-xl border-2 transition-all duration-300 text-center
                ${isEarned 
                  ? 'border-[#FFB627]/50 bg-[#FFB627]/10 hover:border-[#FFB627]' 
                  : 'border-[#7B2FF7]/20 bg-[#1A0033]/50 opacity-50 hover:opacity-75'
                }
                ${selectedBadge === badgeType ? 'ring-2 ring-[#FFB627] ring-offset-2 ring-offset-[#0D0015]' : ''}
              `}
            >
              <div className="text-2xl mb-1">
                {isEarned ? definition.icon : <Lock className="w-6 h-6 mx-auto text-[#A0A0A0]" />}
              </div>
              <div className={`text-xs font-medium truncate ${isEarned ? 'text-white' : 'text-[#A0A0A0]'}`}>
                {definition.name}
              </div>
              {isEarned && earnedBadge && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00F5D4] rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Badge Details */}
      {selectedBadge && (
        <div className="mt-4 p-4 rounded-xl bg-[#7B2FF7]/10 border border-[#7B2FF7]/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{BADGE_DEFINITIONS[selectedBadge].icon}</span>
            <div>
              <h4 className="font-semibold text-white">{BADGE_DEFINITIONS[selectedBadge].name}</h4>
              <p className="text-sm text-[#A0A0A0]">{BADGE_DEFINITIONS[selectedBadge].description}</p>
              {!earnedBadgeTypes.includes(selectedBadge) && BADGE_DEFINITIONS[selectedBadge].requirement > 0 && (
                <p className="text-xs text-[#FFB627] mt-1">
                  Requirement: {BADGE_DEFINITIONS[selectedBadge].requirement} {
                    selectedBadge.includes('show') || selectedBadge === 'regular' || selectedBadge === 'superfan' || selectedBadge === 'legendary' || selectedBadge === 'comedy_addict' || selectedBadge === 'first_show'
                      ? 'shows'
                      : selectedBadge === 'hype_master'
                        ? 'event hypes'
                        : selectedBadge === 'social_butterfly'
                          ? 'forum posts'
                          : selectedBadge === 'reviewer'
                            ? 'show reviews'
                            : ''
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

