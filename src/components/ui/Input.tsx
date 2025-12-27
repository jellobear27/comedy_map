'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#A0A0A0] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full bg-[#1A0033]/30 border border-[#7B2FF7]/30 rounded-xl
              px-4 py-3.5 text-white placeholder-[#A0A0A0]
              transition-all duration-300
              focus:outline-none focus:border-[#7B2FF7] focus:shadow-[0_0_0_3px_rgba(123,47,247,0.2)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-12' : ''}
              ${error ? 'border-[#FF6B6B] focus:border-[#FF6B6B] focus:shadow-[0_0_0_3px_rgba(255,107,107,0.2)]' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-[#FF6B6B]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

