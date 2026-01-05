import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '@/components/ui/Input'

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input id="test" label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input id="test" placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Input id="test" onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders different input types', () => {
    const { rerender } = render(<Input id="test" type="text" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    
    rerender(<Input id="test" type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    
    rerender(<Input id="test" type="password" />)
    // Password inputs don't have a textbox role
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>
    render(<Input id="test" icon={<TestIcon />} />)
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('renders as required', () => {
    render(<Input id="test" required />)
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('applies custom className', () => {
    render(<Input id="test" className="custom-class" />)
    // The className is applied to the wrapper
    expect(document.querySelector('.custom-class')).toBeInTheDocument()
  })
})

