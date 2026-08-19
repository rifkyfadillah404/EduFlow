import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { CourseForm } from '@/components/admin/course-form'
import { Button } from '@/components/ui/button'

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const course = await prisma.course.findUnique({
    where: { id },
  })

  if (!course) notFound()

  return (
    <div className="container mx-auto max-w-3xl p-6 py-10">
      <div className="flex items-center gap-2 mb-6 text-sm text-[var(--ink-faint)]">
        <Link href="/admin" className="hover:text-[var(--accent)]">Admin</Link> /
        <Link href="/admin/courses" className="hover:text-[var(--accent)]">Courses</Link> / Edit
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <div className="flex gap-2">
           <Link href={`/admin/courses/${id}/lessons`}>
             <Button variant="outline">Manage Lessons</Button>
           </Link>
           <Link href={`/admin/courses/${id}/quiz`}>
             <Button variant="outline">Manage Quiz</Button>
           </Link>
        </div>
      </div>

      <CourseForm initialData={course} />
    </div>
  )
}
