'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <div className="w-full max-w-sm mx-auto p-6 brutal-box brutal-shadow mt-12 bg-[var(--surface)]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-sm text-[var(--ink-faint)]">Enter your credentials to continue</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input id="email" name="email" type="email" placeholder="student@eduflow.dev" required />
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
          {pending ? 'Logging in...' : 'Log In'}
        </Button>

        <div className="text-center text-sm mt-4 text-[var(--ink-faint)]">
          Demo: admin@eduflow.dev or student@eduflow.dev / password123
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        Don&apos;t have an account? <Link href="/register" className="text-[var(--accent)] font-medium hover:underline">Sign up</Link>
      </div>
    </div>
  )
}
