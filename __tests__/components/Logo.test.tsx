import { render, screen } from '@testing-library/react'
import Logo from '@/components/ui/Logo'

describe('Logo Component', () => {
  it('renders without crashing', () => {
    render(<Logo />)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders with custom size', () => {
    render(<Logo size={48} />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('width', '48')
    expect(svg).toHaveAttribute('height', '48')
  })

  it('applies custom className', () => {
    render(<Logo className="custom-class" />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })

  it('contains gradient definition', () => {
    render(<Logo />)
    const gradient = document.querySelector('#micGradient')
    expect(gradient).toBeInTheDocument()
  })
})

