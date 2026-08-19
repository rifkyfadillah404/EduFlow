'use client'

import { useActionState } from 'react'
import { registerAction } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, null)

  return (
    <div className="w-full max-w-sm mx-auto p-6 brutal-box brutal-shadow mt-12 bg-[var(--surface)]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-sm text-[var(--ink-faint)]">Join EduFlow to start learning</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">Full Name</label>
          <Input id="name" name="name" type="text" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" placeholder="student@example.com" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </div>

        {state?.error && (
          <div className="text-sm text-[var(--error)] font-medium p-2 border border-[var(--error)]/20 bg-[var(--error)]/10 brutal-box">
            {state.error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        Already have an account? <Link href="/login" className="text-[var(--accent)] font-medium hover:underline">Log in</Link>
      </div>
    </div>
  )
}
