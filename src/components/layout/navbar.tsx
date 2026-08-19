import Link from 'next/link'
import { auth } from '@/lib/auth'
import { logoutAction } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <BookOpen className="h-5 w-5 text-[var(--accent)]" />
          <span>EduFlow</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/courses" className="text-sm font-medium hover:text-[var(--accent)]">
            Catalog
          </Link>
          {session?.user ? (
            <>
              {session.user.role === 'ADMIN' ? (
                <Link href="/admin" className="text-sm font-medium hover:text-[var(--accent)]">
                  Admin
                </Link>
              ) : null}
              <Link href="/dashboard" className="text-sm font-medium hover:text-[var(--accent)]">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <Button variant="outline" className="h-8 px-3 text-xs">Log Out</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-[var(--accent)]">
                Log In
              </Link>
              <Link href="/register">
                <Button className="h-8 px-3 text-xs">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
