import { prisma } from '@/lib/prisma'
import Link from 'next/link'
 

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      instructor: { select: { name: true } },
      _count: { select: { lessons: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto max-w-6xl p-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">Course Catalog</h1>
        <p className="text-[var(--ink-faint)] max-w-2xl">Browse our collection of courses and start learning today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link href={`/courses/${course.slug}`} key={course.id} className="group">
            <div className="brutal-box h-full flex flex-col transition-all duration-200 group-hover:brutal-shadow group-hover:-translate-y-1">
              <div className="h-40 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-center relative overflow-hidden">
                <span className="font-mono text-4xl text-[var(--ink-dim)]">{course.category.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-1 brutal-box bg-[var(--surface-secondary)] uppercase tracking-wider">{course.category}</span>
                  <span className="text-xs font-semibold px-2 py-1 brutal-box bg-[var(--surface-secondary)] uppercase tracking-wider">{course.level}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h2>
                <p className="text-sm text-[var(--ink-faint)] line-clamp-2 mb-4 flex-1">
                  {course.shortDescription}
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--ink-faint)] mt-auto pt-4 border-t border-[var(--border-color)]">
                  <span>By {course.instructor.name}</span>
                  <span>{course._count.lessons} lessons</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 brutal-box">
          <p className="text-[var(--ink-faint)]">No courses available at the moment.</p>
        </div>
      )}
    </div>
  )
}
