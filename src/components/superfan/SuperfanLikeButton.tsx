'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  likedUserId: string
  initialCount: number
  loginRedirect: string
}

export default function SuperfanLikeButton({ likedUserId, initialCount, loginRedirect }: Props) {
  const [count, setCount] = useState(initialCount)
  const [liked, setLiked] = useState(false)
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [viewerLoading, setViewerLoading] = useState(true)
  const [isSuperfan, setIsSuperfan] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setViewerLoading(false)
        return
      }
      if (cancelled) return

      setViewerId(user.id)

      const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      setIsSuperfan(prof?.role === 'superfan')

      if (user.id !== likedUserId) {
        const { data: row } = await supabase
          .from('superfan_card_likes')
          .select('id')
          .eq('liker_id', user.id)
          .eq('liked_user_id', likedUserId)
          .maybeSingle()
        setLiked(!!row)
      }

      setViewerLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [likedUserId])

  useEffect(() => {
    setCount(initialCount)
  }, [initialCount])

  const toggle = async () => {
    if (!viewerId || viewerId === likedUserId || !isSuperfan || busy) return

    const supabase = createClient()
    setBusy(true)
    try {
      if (liked) {
        const { error } = await supabase
          .from('superfan_card_likes')
          .delete()
          .eq('liker_id', viewerId)
          .eq('liked_user_id', likedUserId)

        if (error) throw error
        setLiked(false)
        setCount((c) => Math.max(0, c - 1))
      } else {
        const { error } = await supabase.from('superfan_card_likes').insert({
          liker_id: viewerId,
          liked_user_id: likedUserId,
        })
        if (error) throw error
        setLiked(true)
        setCount((c) => c + 1)
      }
    } catch {
      /* RLS or network — keep UI stable */
    } finally {
      setBusy(false)
    }
  }

  if (viewerLoading) {
    return (
      <div className="flex items-center gap-2 text-[#A0A0A0]">
        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
        <span className="text-sm">Loading…</span>
      </div>
    )
  }

  if (!viewerId) {
    return (
      <div className="flex items-center gap-3 flex-wrap justify-end">
        <span className="text-xs text-[#A0A0A0]">{count} superfans tapped this card</span>
        <Link
          href={`/login?next=${encodeURIComponent(loginRedirect)}`}
          className="text-sm font-medium text-[#00F5D4] hover:text-[#F72585]"
        >
          Log in to like
        </Link>
      </div>
    )
  }

  if (viewerId === likedUserId) {
    return (
      <p className="text-xs text-[#666]">
        This is your fan card · {count} like{count === 1 ? '' : 's'}
      </p>
    )
  }

  if (!isSuperfan) {
    return (
      <div className="text-right">
        <span className="text-xs text-[#A0A0A0]">
          Only superfan accounts can like fan cards ({count})
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 justify-end flex-wrap">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all disabled:opacity-60 ${
          liked
            ? 'border-[#F72585]/70 bg-[#F72585]/15 text-[#F72585]'
            : 'border-[#7B2FF7]/40 bg-[#7B2FF7]/10 text-white hover:border-[#F72585]/50 hover:bg-[#7B2FF7]/20'
        }`}
      >
        {busy ? (
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
        ) : (
          <Heart className={`w-5 h-5 shrink-0 ${liked ? 'fill-current' : ''}`} />
        )}
        {liked ? 'Liked' : 'Like card'}
      </button>
      <span className="text-sm tabular-nums text-[#A0A0A0]">{count}</span>
    </div>
  )
}
