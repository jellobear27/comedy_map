import Link from 'next/link'
import { Zap, Instagram, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  platform: [
    { href: '/open-mics', label: 'Find Open Mics' },
    { href: '/courses', label: 'Courses' },
    { href: '/community', label: 'Community' },
    { href: '/for-venues', label: 'For Venues' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/guides', label: 'Comedy Guides' },
    { href: '/podcast', label: 'Podcast' },
    { href: '/events', label: 'Live Events' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
    { href: '/press', label: 'Press' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-[#7B2FF7]/10">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7B2FF7]/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Zap className="w-7 h-7 text-[#7B2FF7]" />
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

          {/* Links */}
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
        </div>

        <div className="mt-12 pt-8 border-t border-[#7B2FF7]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#A0A0A0]">
            © {new Date().getFullYear()} NovaActa. All rights reserved.
          </p>
          <p className="text-sm text-[#A0A0A0]">
            Made with ⚡ for comedians everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}

