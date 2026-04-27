import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders the main headline', () => {
    render(<HomePage />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Designed for')
    expect(h1).toHaveTextContent('comedians, venues, and superfans.')
  })

  it('renders the subheadline', () => {
    render(<HomePage />)
    expect(
      screen.getByText(/Find mics, connect with fellow comedians, fill your venue, and never miss a show/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Network with fellow comics, book better rooms, and unlock bigger opportunities/)
    ).toBeInTheDocument()
  })

  it('links Roast Me to community roast page', () => {
    render(<HomePage />)
    const roast = screen.getByRole('link', { name: 'Roast Me' })
    expect(roast).toHaveAttribute('href', '/community/roast-me')
  })

  it('renders the badge', () => {
    render(<HomePage />)
    expect(screen.getByText('Mics · Venues · Roast · Shows')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<HomePage />)
    expect(screen.getByText('Start Your Journey')).toBeInTheDocument()
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
