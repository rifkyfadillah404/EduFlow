import Link from 'next/link'
import { auth } from '@/lib/auth'
import { BookOpen } from 'lucide-react'
import { NavLinks } from './nav-links'
import { MobileNav } from './mobile-nav'

export async function Sidebar() {
  const session = await auth()
  const role = session?.user?.role ?? null
  const nav = <NavLinks role={role} />

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 z-50 hidden h-svh w-64 shrink-0 flex-col overflow-y-auto border-r border-[var(--border-color)] bg-[var(--background)] md:flex">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border-faint)] px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <BookOpen className="h-5 w-5 text-[var(--accent)]" />
            <span>EduFlow</span>
          </Link>
        </div>
        <div className="flex-1">{nav}</div>
        <p className="landing-mono shrink-0 border-t border-[var(--border-faint)] px-4 py-3 text-[10px] text-[var(--ink-faint)]">
          © 2026 EduFlow
        </p>
      </aside>

      {/* Mobile top bar + drawer */}
      <MobileNav>{nav}</MobileNav>
    </>
  )
}