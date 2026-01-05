import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders the main headline', () => {
    render(<HomePage />)
    expect(screen.getByText('Comedy. Culture.')).toBeInTheDocument()
    expect(screen.getByText('Connection.')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<HomePage />)
    expect(screen.getByText('The stage is yours.')).toBeInTheDocument()
  })

  it('renders the badge', () => {
    render(<HomePage />)
    expect(screen.getByText('Built for comics. Backed by community.')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<HomePage />)
    expect(screen.getByText('Start Your Journey')).toBeInTheDocument()
    // "Find Open Mics" appears in both CTA button and feature section
    expect(screen.getAllByText('Find Open Mics').length).toBeGreaterThanOrEqual(1)
  })

  it('CTA buttons have correct links', () => {
    render(<HomePage />)
    
    const signupLink = screen.getByRole('link', { name: /Start Your Journey/i })
    const openMicsLink = screen.getByRole('link', { name: /Find Open Mics/i })
    
    expect(signupLink).toHaveAttribute('href', '/signup')
    expect(openMicsLink).toHaveAttribute('href', '/open-mics')
  })

  it('renders feature sections', () => {
    render(<HomePage />)
    
    // "Find Open Mics" appears in both CTA button and feature section
    expect(screen.getAllByText('Find Open Mics').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Learn & Grow')).toBeInTheDocument()
    expect(screen.getByText('Join Community')).toBeInTheDocument()
    expect(screen.getByText('Plan Your Tour')).toBeInTheDocument()
  })

  it('renders stats section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('2,500+')).toBeInTheDocument()
    expect(screen.getByText('Open Mics Listed')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('States Covered')).toBeInTheDocument()
  })

  it('renders testimonials', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/NovaActa helped me find 15 open mics/)).toBeInTheDocument()
  })
})

