import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminCoursesPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { lessons: true, enrollments: true } }
    }
  })

  return (
    <div className="container mx-auto max-w-6xl p-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm text-[var(--ink-faint)]">
            <Link href="/admin" className="hover:text-[var(--accent)]">Admin</Link> / Courses
          </div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
        </div>
        <Link href="/admin/courses/new">
          <Button>Create Course</Button>
        </Link>
      </div>

      <div className="brutal-box bg-[var(--surface-secondary)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--surface)]">
              <th className="p-4 font-semibold text-sm">Course</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Lessons</th>
              <th className="p-4 font-semibold text-sm">Enrollments</th>
              <th className="p-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--ink-faint)]">
                  No courses found. Create your first course!
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4">
                    <div className="font-bold">{course.title}</div>
                    <div className="text-xs text-[var(--ink-faint)] mt-1">{course.category} • {course.level}</div>
                  </td>
                  <td className="p-4">
                    {course.isPublished ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4">{course._count.lessons}</td>
                  <td className="p-4">{course._count.enrollments}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button variant="outline" className="h-8 px-3 text-xs">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
