import type { Metadata } from "next"
import { Sora, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const sora = Sora({
  variable: "--font-clash",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ComedyMap - Find Open Mics, Courses & Community for Comedians",
  description: "The ultimate platform for comedians to discover open mics, learn from courses, connect with the comedy community, and plan tours across the USA.",
  keywords: ["comedy", "open mic", "stand-up", "comedian", "comedy courses", "comedy community"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sora.variable} ${jetbrainsMono.variable} antialiased bg-cosmic min-h-screen`}>
        <Header />
        <main className="pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
