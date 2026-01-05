import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/Badge'

describe('Badge Component', () => {
  it('renders children', () => {
    render(<Badge>Badge Text</Badge>)
    expect(screen.getByText('Badge Text')).toBeInTheDocument()
  })

  it('renders different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toBeInTheDocument()
    
    rerender(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toBeInTheDocument()
    
    rerender(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning')).toBeInTheDocument()
    
    rerender(<Badge variant="error">Error</Badge>)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders different sizes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toBeInTheDocument()
    
    rerender(<Badge size="md">Medium</Badge>)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    expect(document.querySelector('.custom-class')).toBeInTheDocument()
  })
})

