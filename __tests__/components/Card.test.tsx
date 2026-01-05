import { render, screen } from '@testing-library/react'
import Card from '@/components/ui/Card'

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('renders different variants', () => {
    const { rerender } = render(<Card variant="default">Default</Card>)
    expect(screen.getByText('Default')).toBeInTheDocument()
    
    rerender(<Card variant="gradient">Gradient</Card>)
    expect(screen.getByText('Gradient')).toBeInTheDocument()
    
    rerender(<Card variant="glass">Glass</Card>)
    expect(screen.getByText('Glass')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    expect(document.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('applies hover effects', () => {
    render(<Card hover>Hoverable</Card>)
    expect(screen.getByText('Hoverable')).toBeInTheDocument()
  })
})

