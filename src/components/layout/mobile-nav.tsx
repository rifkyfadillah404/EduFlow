'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, X } from 'lucide-react'

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border-color)] bg-[var(--background)] px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <BookOpen className="h-5 w-5 text-[var(--accent)]" />
          <span>EduFlow</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center border border-[var(--border-color)]"
        >
          <span className="text-[var(--ink)] text-xl leading-none">☰</span>
        </button>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-[#141C2B]/40 md:hidden transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[var(--border-color)] bg-[var(--background)] transition-transform duration-200 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--border-color)] px-4">
          <Link href="/" onClick={close} className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <BookOpen className="h-5 w-5 text-[var(--accent)]" />
            <span>EduFlow</span>
          </Link>
          <button onClick={close} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center border border-[var(--border-color)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" onClick={(e) => {
          const el = e.target as HTMLElement
          if (el.closest('a')) close()
        }}>
          {children}
        </div>
        <p className="landing-mono border-t border-[var(--border-faint)] px-4 py-3 text-[10px] text-[var(--ink-faint)]">© 2026 EduFlow</p>
      </div>
    </>
  )
}