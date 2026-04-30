import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=${encodeURIComponent('/admin/open-mics')}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    redirect('/?message=' + encodeURIComponent('That page is for moderators only.'))
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}
