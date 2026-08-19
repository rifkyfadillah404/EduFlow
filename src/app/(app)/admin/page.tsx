import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboardPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  // Stats
  const courseCount = await prisma.course.count()
  const studentCount = await prisma.user.count({ where: { role: 'STUDENT' } })
  const enrollmentCount = await prisma.enrollment.count()
  const completionCount = await prisma.enrollment.count({ where: { status: 'COMPLETED' } })

  return (
    <div className="container mx-auto max-w-6xl p-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-[var(--ink-faint)]">Manage your courses, lessons, and students.</p>
        </div>
        <Link href="/admin/courses/new">
          <Button>Create Course</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="brutal-box p-6 brutal-shadow bg-[var(--surface-secondary)]">
          <div className="text-3xl font-bold mb-1">{courseCount}</div>
          <div className="text-xs font-semibold text-[var(--ink-faint)] uppercase">Courses</div>
        </div>
        <div className="brutal-box p-6 brutal-shadow bg-[var(--surface-secondary)]">
          <div className="text-3xl font-bold mb-1">{studentCount}</div>
          <div className="text-xs font-semibold text-[var(--ink-faint)] uppercase">Students</div>
        </div>
        <div className="brutal-box p-6 brutal-shadow bg-[var(--surface-secondary)]">
          <div className="text-3xl font-bold mb-1">{enrollmentCount}</div>
          <div className="text-xs font-semibold text-[var(--ink-faint)] uppercase">Enrollments</div>
        </div>
        <div className="brutal-box p-6 brutal-shadow bg-[var(--surface-secondary)]">
          <div className="text-3xl font-bold mb-1">{completionCount}</div>
          <div className="text-xs font-semibold text-[var(--ink-faint)] uppercase">Completions</div>
        </div>
      </div>

      <div className="brutal-box bg-[var(--surface-secondary)]">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className="text-xl font-bold">Quick Links</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
           <Link href="/admin/courses" className="brutal-box p-6 hover:bg-[var(--surface)] transition-colors">
             <h3 className="font-bold mb-2">Manage Courses</h3>
             <p className="text-sm text-[var(--ink-faint)]">Edit, publish, or delete your existing courses.</p>
           </Link>
           <Link href="/courses" className="brutal-box p-6 hover:bg-[var(--surface)] transition-colors">
             <h3 className="font-bold mb-2">View Public Catalog</h3>
             <p className="text-sm text-[var(--ink-faint)]">See how your courses appear to students.</p>
           </Link>
        </div>
      </div>
    </div>
  )
}
