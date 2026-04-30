import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders the main headline', () => {
    render(<HomePage />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Find Open Mics.')
    expect(h1).toHaveTextContent('Get Stage Time.')
  })

  it('renders the hero subcopy', () => {
    render(<HomePage />)
    expect(
      screen.getByText(/The nationwide open mic finder for the United States/i)
    ).toBeInTheDocument()
  })

  it('mentions Roast Me in the community blurb', () => {
    render(<HomePage />)
    expect(screen.getByText(/Roast Me/i)).toBeInTheDocument()
  })

  it('renders the hero badge strip', () => {
    render(<HomePage />)
    expect(screen.getByText(/Built for U\.S\. comedians/i)).toBeInTheDocument()
  })

  it('renders primary CTAs for listings and submissions', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: /Find open mics in the U\.S\./i })).toHaveAttribute(
      'href',
      '/open-mics'
    )
    expect(screen.getByRole('link', { name: /Submit or update a mic/i })).toHaveAttribute(
      'href',
      '/submit-open-mic'
    )
  })

  it('links comedian signup', () => {
    render(<HomePage />)
    const comedianLinks = screen.getAllByRole('link', {
      name: /Create a (free )?comedian account/i,
    })
    expect(comedianLinks.length).toBeGreaterThanOrEqual(1)
    comedianLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/signup?role=comedian')
    })
  })

  it('renders venue section', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /Fill the room/i })).toBeInTheDocument()
  })

  it('renders mission section copy', () => {
    render(<HomePage />)
    expect(screen.getByText(/Why we exist/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Nova Acta is a nationwide map kept accurate by comics and venues/i)
    ).toBeInTheDocument()
  })

  it('renders honest proof placeholder instead of fake testimonials', () => {
    render(<HomePage />)
    expect(screen.getByText(/We don't use fabricated testimonials/i)).toBeInTheDocument()
  })

  it('links submit flow from hero when submit feature is enabled', () => {
    render(<HomePage />)
    expect(screen.getByRole('link', { name: /Submit an open mic/i })).toHaveAttribute(
      'href',
      '/submit-open-mic#open-mic-form'
    )
  })
})
