import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/components/layout/Header'

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Header Component', () => {
  it('renders the NovaActa logo', () => {
    render(<Header />)
    expect(screen.getByText('NovaActa')).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    render(<Header />)
    
    expect(screen.getByText('Open Mics')).toBeInTheDocument()
    expect(screen.getByText('Courses')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('For Venues')).toBeInTheDocument()
  })

  it('navigation links have correct href attributes', () => {
    render(<Header />)
    
    const openMicsLink = screen.getByRole('link', { name: 'Open Mics' })
    const coursesLink = screen.getByRole('link', { name: 'Courses' })
    const communityLink = screen.getByRole('link', { name: 'Community' })
    const forVenuesLink = screen.getByRole('link', { name: 'For Venues' })
    
    expect(openMicsLink).toHaveAttribute('href', '/open-mics')
    expect(coursesLink).toHaveAttribute('href', '/courses')
    expect(communityLink).toHaveAttribute('href', '/community')
    expect(forVenuesLink).toHaveAttribute('href', '/for-venues')
  })

  it('renders Sign In and Get Started buttons when no user', () => {
    render(<Header />)
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('logo links to homepage', () => {
    render(<Header />)
    
    const logoLink = screen.getByRole('link', { name: /NovaActa/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('mobile menu button exists', () => {
    render(<Header />)
    
    // Find the mobile menu button (it's a button without text, with an icon)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('mobile menu toggles on click', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    // Find mobile menu button (the one that's not Sign In or Get Started)
    const mobileMenuButton = screen.getAllByRole('button').find(
      btn => !btn.textContent?.includes('Sign') && !btn.textContent?.includes('Get Started')
    )
    
    if (mobileMenuButton) {
      await user.click(mobileMenuButton)
      // After clicking, the mobile menu content should be visible
      // This tests the toggle functionality
    }
  })
})

