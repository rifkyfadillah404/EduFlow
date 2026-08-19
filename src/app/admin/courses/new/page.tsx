import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CourseForm } from '@/components/admin/course-form'

export default async function NewCoursePage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="container mx-auto max-w-3xl p-6 py-10">
      <div className="flex items-center gap-2 mb-6 text-sm text-[var(--ink-faint)]">
        <Link href="/admin" className="hover:text-[var(--accent)]">Admin</Link> /
        <Link href="/admin/courses" className="hover:text-[var(--accent)]">Courses</Link> / New
      </div>

      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

      <CourseForm />
    </div>
  )
}
