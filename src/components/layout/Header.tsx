'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'

const navLinks = [
  { href: '/open-mics', label: 'Open Mics' },
  { href: '/for-venues/find-talent', label: 'Find Talent' },
  { href: '/courses', label: 'Courses' },
  { href: '/community', label: 'Community' },
  { href: '/for-venues', label: 'For Venues' },
]

interface HeaderProps {
  user?: { id: string; email: string; full_name?: string } | null
}

export default function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl border-b border-[#7B2FF7]/10" />
      
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Logo size={32} />
              <div className="absolute inset-0 blur-lg bg-[#7B2FF7]/30 group-hover:bg-[#F72585]/30 transition-colors" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#7B2FF7] via-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
              NovaActa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative text-sm font-medium transition-colors
                  ${pathname === link.href 
                    ? 'text-white' 
                    : 'text-[#A0A0A0] hover:text-white'
                  }
                `}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7B2FF7] to-[#F72585] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user.full_name || user.email}</span>
                </Link>
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#A0A0A0] hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-b border-[#7B2FF7]/10 p-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    text-lg font-medium py-2 transition-colors
                    ${pathname === link.href ? 'text-white' : 'text-[#A0A0A0]'}
                  `}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-[#7B2FF7]/20" />
              {user ? (
                <>
                  <Link href="/dashboard/profile" className="text-lg text-[#A0A0A0] py-2">
                    My Profile
                  </Link>
                  <Link href="/dashboard" className="text-lg text-[#A0A0A0] py-2">
                    Dashboard
                  </Link>
                  <Button variant="secondary" className="w-full">Sign Out</Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="secondary" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

