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
          variant === 'primary' && 'bg-[var(--accent)] text-[var(--on-accent)] font-semibold hover:bg-[var(--accent-hover)] border-[var(--accent)]',
          variant === 'secondary' && 'bg-transparent text-[var(--ink)] hover:bg-[var(--ink-faintest)]',
          variant === 'outline' && 'bg-transparent text-[var(--ink)] border-[var(--border-color)] hover:bg-[var(--ink-faintest)]',
          variant === 'danger' && 'bg-[var(--error)] text-[#EFE9DD] border-[var(--error)] hover:bg-[var(--error-hover)]',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
