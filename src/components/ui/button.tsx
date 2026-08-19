import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 brutal-box',
          'h-10 px-4 py-2',
          variant === 'primary' && 'bg-[#1A1A1A] text-white dark:bg-[#D7E2EA] dark:text-[#0C0C0C] hover:bg-[#B600A8] hover:border-[#B600A8] dark:hover:bg-[#B600A8] dark:hover:border-[#B600A8] dark:hover:text-white',
          variant === 'secondary' && 'bg-transparent text-[var(--ink)] hover:bg-[var(--ink-faintest)]',
          variant === 'outline' && 'bg-transparent text-[var(--ink)] border-[var(--border-color)] hover:bg-[var(--ink-faintest)]',
          variant === 'danger' && 'bg-red-500 text-white border-red-600 hover:bg-red-600',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
