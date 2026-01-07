import Link from 'next/link'
import { Instagram, Twitter, Youtube } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { FEATURES } from '@/config/features'

// Define all footer links with their feature flags
const allFooterLinks = {
  platform: [
    { href: '/open-mics', label: 'Find Open Mics', feature: 'openMics' as const },
    { href: '/courses', label: 'Courses', feature: 'courses' as const },
    { href: '/community', label: 'Community', feature: 'community' as const },
    { href: '/for-venues', label: 'For Venues', feature: 'forVenues' as const },
  ],
  resources: [
    { href: '/blog', label: 'Blog', feature: 'blog' as const },
    { href: '/guides', label: 'Comedy Guides', feature: 'guides' as const },
    { href: '/podcast', label: 'Podcast', feature: 'podcast' as const },
    { href: '/events', label: 'Live Events', feature: 'liveEvents' as const },
  ],
  company: [
    { href: '/about', label: 'About Us', feature: 'about' as const },
    { href: '/careers', label: 'Careers', feature: 'careers' as const },
    { href: '/contact', label: 'Contact', feature: 'contact' as const },
    { href: '/press', label: 'Press', feature: 'press' as const },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy', feature: 'privacy' as const },
    { href: '/terms', label: 'Terms of Service', feature: 'terms' as const },
    { href: '/cookies', label: 'Cookie Policy', feature: 'cookies' as const },
  ],
}

// Filter to only show enabled features
const footerLinks = {
  platform: allFooterLinks.platform.filter(link => FEATURES[link.feature]),
  resources: allFooterLinks.resources.filter(link => FEATURES[link.feature]),
  company: allFooterLinks.company.filter(link => FEATURES[link.feature]),
  legal: allFooterLinks.legal.filter(link => FEATURES[link.feature]),
}

export default function Footer() {
  // Check if any section has links to show
  const hasPlatformLinks = footerLinks.platform.length > 0
  const hasResourceLinks = footerLinks.resources.length > 0
  const hasCompanyLinks = footerLinks.company.length > 0
  const hasLegalLinks = footerLinks.legal.length > 0
  
  return (
    <footer className="relative border-t border-[#7B2FF7]/10">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7B2FF7]/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span className="text-lg font-bold bg-gradient-to-r from-[#7B2FF7] via-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
                NovaActa
              </span>
            </Link>
            <p className="text-[#A0A0A0] text-sm mb-6 max-w-xs">
              Built for comics. Backed by community.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#A0A0A0] hover:text-[#7B2FF7] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A0A0A0] hover:text-[#7B2FF7] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A0A0A0] hover:text-[#7B2FF7] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          {hasPlatformLinks && (
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources Links */}
          {hasResourceLinks && (
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Links */}
          {hasCompanyLinks && (
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal Links */}
          {hasLegalLinks && (
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-[#7B2FF7]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#A0A0A0]">
            © {new Date().getFullYear()} NovaActa. All rights reserved.
          </p>
          <p className="text-sm text-[#A0A0A0]">
            Comedy. Culture. Connection. ⚡
          </p>
        </div>
      </div>
    </footer>
  )
}
