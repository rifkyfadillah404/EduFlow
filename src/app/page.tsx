import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24 pb-20">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
          Learn without limits on <span className="text-[var(--accent)]">EduFlow</span>
        </h1>
        <p className="text-xl text-[var(--ink-faint)] max-w-2xl mx-auto mb-10">
          The minimal learning management system for building and completing online courses. Explore our catalog or log in to continue learning.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link href="/courses">
            <Button className="h-12 px-8 text-base">Browse Catalog</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="h-12 px-8 text-base bg-[var(--surface)]">Log In</Button>
          </Link>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
        <div className="brutal-box p-6 brutal-shadow">
          <div className="h-12 w-12 bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center brutal-box mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Structured Courses</h3>
          <p className="text-[var(--ink-faint)]">Learn through carefully curated step-by-step lessons.</p>
        </div>
        <div className="brutal-box p-6 brutal-shadow">
          <div className="h-12 w-12 bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] flex items-center justify-center brutal-box mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Test Your Knowledge</h3>
          <p className="text-[var(--ink-faint)]">Complete the final quiz to verify your understanding.</p>
        </div>
        <div className="brutal-box p-6 brutal-shadow">
          <div className="h-12 w-12 bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center brutal-box mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Earn Certificates</h3>
          <p className="text-[var(--ink-faint)]">Get a digital certificate upon passing the course.</p>
        </div>
      </div>
    </div>
  )
}
