import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { LessonForm } from '@/components/admin/lesson-form'
import { deleteLessonAction } from '@/actions/lesson-actions'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default async function ManageLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { orderIndex: 'asc' } } }
  })

  if (!course) notFound()

  return (
    <div className="container mx-auto max-w-5xl p-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-6 text-sm text-[var(--ink-faint)]">
          <Link href="/admin" className="hover:text-[var(--accent)]">Admin</Link> /
          <Link href="/admin/courses" className="hover:text-[var(--accent)]">Courses</Link> /
          <Link href={`/admin/courses/${id}/edit`} className="hover:text-[var(--accent)]">Edit</Link> / Lessons
        </div>

        <h1 className="text-3xl font-bold mb-2">Manage Lessons</h1>
        <p className="text-[var(--ink-faint)] mb-8">Course: {course.title}</p>

        <div className="space-y-4">
          {course.lessons.length === 0 ? (
            <div className="brutal-box p-8 text-center bg-[var(--surface-secondary)] text-[var(--ink-faint)] border-dashed">
              No lessons added yet.
            </div>
          ) : (
            course.lessons.map((lesson, idx) => (
              <div key={lesson.id} className="brutal-box p-4 bg-[var(--surface-secondary)] flex items-center justify-between group hover:brutal-shadow transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--surface)] text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold">{lesson.title}</h3>
                    <div className="text-xs text-[var(--ink-faint)] mt-1 flex gap-2">
                      <span className="uppercase">{lesson.contentType}</span>
                      {lesson.isPreview && <span className="text-[var(--accent)]">PREVIEW</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <form action={deleteLessonAction.bind(null, lesson.id, course.id)}>
                    <Button variant="danger" className="h-8 w-8 p-0" title="Delete Lesson">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="sticky top-20">
        <h2 className="text-xl font-bold mb-4">Add New Lesson</h2>
        <LessonForm courseId={course.id} />
      </div>
    </div>
  )
}
