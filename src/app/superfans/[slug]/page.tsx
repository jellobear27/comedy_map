'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SuperfanTrainerCard from '@/components/superfan/SuperfanTrainerCard'
import { Loader2 } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function SuperfanPublicPage({ params }: PageProps) {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [superfan, setSuperfan] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { slug } = await params
      const supabase = createClient()

      const { data: sf } = await supabase
        .from('superfan_profiles')
        .select('*')
        .eq('public_slug', slug)
        .maybeSingle()

      if (!sf?.id) {
        setIsLoading(false)
        return
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sf.id as string)
        .maybeSingle()

      if (!prof || prof.is_public === false) {
        setIsLoading(false)
        return
      }

      setProfile(prof)
      setSuperfan(sf)
      setIsLoading(false)
    }

    load()
  }, [params])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00F5D4] animate-spin" />
      </div>
    )
  }

  if (!profile || !superfan) {
    notFound()
  }

  const styles = (superfan.preferred_comedy_styles as string[]) || []
  const locals = (superfan.favorite_local_names as string[]) || []

  return (
    <div className="min-h-screen bg-[#050505] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Link
            href="/"
            className="text-sm text-[#A0A0A0] hover:text-white transition-colors"
          >
            ← NovaActa home
          </Link>
        </div>
        <SuperfanTrainerCard
          mode="public"
          profile={{
            full_name: (profile.full_name as string) ?? null,
            bio: (profile.bio as string) ?? null,
            city: (profile.city as string) ?? null,
            state: (profile.state as string) ?? null,
            profile_photo_url: (profile.profile_photo_url as string) ?? null,
            avatar_url: (profile.avatar_url as string) ?? null,
          }}
          superfan={{
            public_slug: (superfan.public_slug as string) ?? null,
            preferred_comedy_styles: styles,
            show_frequency: (superfan.show_frequency as string) ?? null,
            favorite_local_names: locals,
            shows_attended: (superfan.shows_attended as number) ?? 0,
            membership_tier: superfan.membership_tier as 'free' | 'premium' | undefined,
          }}
        />
      </div>
    </div>
  )
}
