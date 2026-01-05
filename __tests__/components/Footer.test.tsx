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

  it('renders platform links', () => {
    render(<Footer />)
    
    expect(screen.getByText('Find Open Mics')).toBeInTheDocument()
    expect(screen.getByText('Courses')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('For Venues')).toBeInTheDocument()
  })

  it('platform links have correct href', () => {
    render(<Footer />)
    
    expect(screen.getByRole('link', { name: 'Find Open Mics' })).toHaveAttribute('href', '/open-mics')
    expect(screen.getByRole('link', { name: 'Courses' })).toHaveAttribute('href', '/courses')
    expect(screen.getByRole('link', { name: 'Community' })).toHaveAttribute('href', '/community')
    expect(screen.getByRole('link', { name: 'For Venues' })).toHaveAttribute('href', '/for-venues')
  })

  it('renders resource links', () => {
    render(<Footer />)
    
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Comedy Guides')).toBeInTheDocument()
    expect(screen.getByText('Podcast')).toBeInTheDocument()
    expect(screen.getByText('Live Events')).toBeInTheDocument()
  })

  it('renders company links', () => {
    render(<Footer />)
    
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Careers')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Press')).toBeInTheDocument()
  })

  it('renders legal links', () => {
    render(<Footer />)
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
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

