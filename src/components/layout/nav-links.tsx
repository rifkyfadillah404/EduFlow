'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/actions/auth-actions'

function active(path: string, href: string, exact = false) {
  return exact ? path === href : path === href || path.startsWith(href + '/')
}

export function NavLinks({ role }: { role: string | null }) {
  const path = usePathname()
  const signedIn = role !== null
  const isAdmin = role === 'ADMIN'

  const rowCls = (a: boolean) =>
    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ' +
    (a ? 'bg-[var(--ink)] text-[var(--on-accent)]' : 'text-[var(--ink)] hover:bg-[var(--ink-faintest)]')

  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <p className="landing-mono px-3 pt-4 pb-1 text-[10px] text-[var(--ink-faint)]">{label}</p>
      {children}
    </div>
  )

  return (
    <nav className="flex flex-col gap-1 p-2">
      <Section label="Public">
        <Link href="/" className={rowCls(active(path, '/', true))}>Home</Link>
        <Link href="/courses" className={rowCls(active(path, '/courses'))}>Catalog</Link>
      </Section>

      {signedIn && (
        <Section label="Learning">
          <Link href="/dashboard" className={rowCls(active(path, '/dashboard'))}>Dashboard</Link>
        </Section>
      )}

      {isAdmin && (
        <Section label="Admin">
          <Link href="/admin" className={rowCls(active(path, '/admin', true))}>Overview</Link>
          <Link href="/admin/courses" className={rowCls(active(path, '/admin/courses'))}>Manage Courses</Link>
        </Section>
      )}

      {signedIn ? (
        <Section label="Account">
          <form action={logoutAction}>
            <button type="submit" className={rowCls(false)}>Log Out</button>
          </form>
        </Section>
      ) : (
        <Section label="Account">
          <Link href="/login" className={rowCls(active(path, '/login'))}>Log In</Link>
          <Link href="/register" className={rowCls(active(path, '/register'))}>Sign Up</Link>
        </Section>
      )}
    </nav>
  )
}