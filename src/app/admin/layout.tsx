import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

