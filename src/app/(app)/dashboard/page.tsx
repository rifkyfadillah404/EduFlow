import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          _count: { select: { lessons: true } },
          lessons: { orderBy: { orderIndex: 'asc' }, take: 1 }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  // Count completed lessons per enrolled course
  const progressRows = await prisma.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      lesson: { courseId: { in: enrollments.map(e => e.courseId) } }
    },
    select: { lesson: { select: { courseId: true } } }
  })
  const completedByCourse = progressRows.reduce<Record<string, number>>((acc, r) => {
    acc[r.lesson.courseId] = (acc[r.lesson.courseId] || 0) + 1
    return acc
  }, {})

  const certCount = await prisma.certificate.count({
    where: { userId: session.user.id }
  })


  return (
    <div className="container mx-auto max-w-5xl p-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}</h1>
      <p className="text-[var(--ink-faint)] mb-10">Here&apos;s an overview of your learning journey.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="brutal-box p-6 brutal-shadow bg-[var(--surface-secondary)]">
          <div className="text-4xl font-bold mb-2">{enrollments.length}</div>
          <div className="text-sm font-medium text-[var(--ink-faint)] uppercase tracking-wider">Enrolled Courses</div>
        </div>
        <div className="brutal-box p-6 brutal-shadow bg-[var(--surface-secondary)]">
          <div className="text-4xl font-bold mb-2">{enrollments.filter(e => e.status === 'COMPLETED').length}</div>
          <div className="text-sm font-medium text-[var(--ink-faint)] uppercase tracking-wider">Completed</div>
        </div>
        <div className="brutal-box p-6 brutal-shadow bg-[var(--surface-secondary)]">
          <div className="text-4xl font-bold mb-2">{certCount}</div>
          <div className="text-sm font-medium text-[var(--ink-faint)] uppercase tracking-wider">Certificates</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 border-b border-[var(--border-color)] pb-4">
        <h2 className="text-2xl font-bold">Continue Learning</h2>
        <Link href="/courses" className="text-sm font-semibold hover:text-[var(--accent)]">Browse Catalog →</Link>
      </div>

      <div className="space-y-4">
        {enrollments.length === 0 ? (
          <div className="brutal-box p-10 text-center bg-[var(--surface-secondary)] border-dashed">
             <p className="text-[var(--ink-faint)] mb-4">You haven&apos;t enrolled in any courses yet.</p>
             <Link href="/courses">
               <Button>Find a Course</Button>
             </Link>
          </div>
        ) : (
          enrollments.map(en => {
            const course = en.course
            const firstLesson = course.lessons[0]
            const isCompleted = en.status === 'COMPLETED'
            const totalLessons = course._count.lessons
            const completedLessons = completedByCourse[course.id] || 0
            const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

            return (
              <div key={en.id} className="brutal-box p-6 bg-[var(--surface-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:brutal-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 brutal-box bg-[var(--surface)] uppercase">{course.category}</span>
                    {isCompleted && <span className="text-[10px] font-semibold px-2 py-0.5 brutal-box bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30 uppercase">Completed</span>}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-[var(--ink-faint)] line-clamp-1 mb-4">{course.shortDescription}</p>

                  <div className="flex items-center gap-2">
                     <div className="flex-1 max-w-xs h-2 bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden">
                       <div className="h-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${pct}%` }}></div>
                     </div>
                     <span className="text-xs font-mono text-[var(--ink-faint)]">{pct}%</span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Link href={isCompleted ? `/courses/${course.slug}` : `/learn/${course.slug}/${firstLesson?.slug || ''}`}>
                    <Button variant={isCompleted ? 'outline' : 'primary'} className="w-full sm:w-auto">
                      {isCompleted ? 'Review Course' : 'Resume'}
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
