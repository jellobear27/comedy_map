import { render, screen } from '@testing-library/react'
import Footer from '@/components/layout/Footer'

describe('Footer Component', () => {
  it('renders the NovaActa logo', () => {
    render(<Footer />)
    expect(screen.getByText('NovaActa')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Footer />)
    expect(screen.getByText('Built for comics. Backed by community.')).toBeInTheDocument()
  })

  it('renders enabled platform links', () => {
    render(<Footer />)
    
    // These are enabled in the feature flags
    expect(screen.getByText('Find Open Mics')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('For Venues')).toBeInTheDocument()
    
    // Courses is disabled, should not be present
    expect(screen.queryByText('Courses')).not.toBeInTheDocument()
  })

  it('platform links have correct href', () => {
    render(<Footer />)
    
    expect(screen.getByRole('link', { name: 'Find Open Mics' })).toHaveAttribute('href', '/open-mics')
    expect(screen.getByRole('link', { name: 'Community' })).toHaveAttribute('href', '/community')
    expect(screen.getByRole('link', { name: 'For Venues' })).toHaveAttribute('href', '/for-venues')
  })

  it('does not render disabled resource links', () => {
    render(<Footer />)
    
    // All resource links are disabled in feature flags
    expect(screen.queryByText('Blog')).not.toBeInTheDocument()
    expect(screen.queryByText('Comedy Guides')).not.toBeInTheDocument()
    expect(screen.queryByText('Podcast')).not.toBeInTheDocument()
    expect(screen.queryByText('Live Events')).not.toBeInTheDocument()
  })

  it('does not render disabled company links', () => {
    render(<Footer />)
    
    // All company links are disabled in feature flags
    expect(screen.queryByText('About Us')).not.toBeInTheDocument()
    expect(screen.queryByText('Careers')).not.toBeInTheDocument()
    expect(screen.queryByText('Contact')).not.toBeInTheDocument()
    expect(screen.queryByText('Press')).not.toBeInTheDocument()
  })

  it('does not render disabled legal links', () => {
    render(<Footer />)
    
    // All legal links are disabled in feature flags
    expect(screen.queryByText('Privacy Policy')).not.toBeInTheDocument()
    expect(screen.queryByText('Terms of Service')).not.toBeInTheDocument()
    expect(screen.queryByText('Cookie Policy')).not.toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} NovaActa. All rights reserved.`)).toBeInTheDocument()
  })

  it('renders the slogan', () => {
    render(<Footer />)
    expect(screen.getByText('Comedy. Culture. Connection. ⚡')).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    // Social links are icon-only, so we check for their presence
    const socialLinks = document.querySelectorAll('a[href="#"]')
    expect(socialLinks.length).toBeGreaterThanOrEqual(3) // Instagram, Twitter, YouTube
  })
})

