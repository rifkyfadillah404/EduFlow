import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EnrollButton } from '@/components/courses/enroll-button'
import { BookOpen, CheckCircle, Clock } from 'lucide-react'

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true } },
      lessons: {
        orderBy: { orderIndex: 'asc' },
      },
      quizzes: true,
    },
  })

  if (!course || !course.isPublished) notFound()

  // Check enrollment
  let isEnrolled = false
  let completedLessonIds: string[] = []

  if (session?.user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    })
    isEnrolled = !!enrollment

    if (isEnrolled) {
      const progress = await prisma.lessonProgress.findMany({
        where: {
          userId: session.user.id,
          lessonId: { in: course.lessons.map(l => l.id) },
        },
        select: { lessonId: true },
      })
      completedLessonIds = progress.map(p => p.lessonId)
    }
  }

  const allCompleted = course.lessons.length > 0 && completedLessonIds.length === course.lessons.length

  return (
    <div className="container mx-auto max-w-5xl p-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="brutal-box p-8 bg-[var(--surface-secondary)] brutal-shadow">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold px-2 py-1 brutal-box bg-[var(--surface)] uppercase">{course.category}</span>
              <span className="text-xs font-semibold px-2 py-1 brutal-box bg-[var(--surface)] uppercase">{course.level}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-[var(--ink-faint)] mb-6">{course.shortDescription}</p>
            <div className="flex items-center gap-2 text-sm text-[var(--ink-faint)]">
              <span>Instructor: <span className="font-semibold text-[var(--ink)]">{course.instructor.name}</span></span>
            </div>
          </div>

          <div className="brutal-box p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">About this course</h2>
            <div className="prose prose-neutral max-w-none text-[var(--ink)] whitespace-pre-wrap">
              {course.description}
            </div>
          </div>

          <div className="brutal-box p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-[var(--accent)]" />
              Curriculum
            </h2>
            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.includes(lesson.id)
                const canAccess = isEnrolled || lesson.isPreview

                return (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border border-[var(--border-color)] bg-[var(--surface-secondary)] group">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 border border-[var(--border-color)] flex items-center justify-center bg-[var(--surface)] text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {lesson.title}
                          {!isEnrolled && lesson.isPreview && (
                            <span className="text-[10px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 brutal-box">PREVIEW</span>
                          )}
                        </div>
                        <div className="text-xs text-[var(--ink-faint)] flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> ~5 min read
                        </div>
                      </div>
                    </div>
                    <div>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-[var(--success)]" />
                      ) : canAccess ? (
                        <Link href={`/learn/${course.slug}/${lesson.slug}`}>
                          <Button variant="outline" className="h-8 px-3 text-xs">View</Button>
                        </Link>
                      ) : (
                        <div className="h-5 w-5 border border-[var(--border-color)]"></div>
                      )}
                    </div>
                  </div>
                )
              })}

              {course.quizzes.length > 0 && (
                <div className="flex items-center justify-between p-4 border border-[var(--border-color)] bg-[var(--surface-secondary)] mt-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 border border-[var(--accent-orange)] bg-[var(--accent-orange)]/10 text-[var(--accent-orange)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                      ★
                    </div>
                    <div>
                      <div className="font-medium">{course.quizzes[0].title}</div>
                      <div className="text-xs text-[var(--ink-faint)] mt-1">Final Assessment</div>
                    </div>
                  </div>
                  <div>
                    {isEnrolled && allCompleted ? (
                      <Link href={`/courses/${course.slug}/quiz`}>
                        <Button variant="outline" className="h-8 px-3 text-xs border-[var(--accent-orange)] text-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/10">Take Quiz</Button>
                      </Link>
                    ) : (
                      <div className="text-xs text-[var(--ink-faint)] px-2">Complete lessons first</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="brutal-box p-6 sticky top-8 bg-[var(--surface-secondary)] brutal-shadow">
            <div className="aspect-video bg-[var(--surface)] border border-[var(--border-color)] mb-6 flex items-center justify-center relative overflow-hidden">
               <BookOpen className="h-12 w-12 text-[var(--ink-dim)] relative z-10" />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--ink-faint)]">Lessons</span>
                <span className="font-bold">{course.lessons.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--ink-faint)]">Level</span>
                <span className="font-bold">{course.level}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--ink-faint)]">Access</span>
                <span className="font-bold">Lifetime</span>
              </div>
            </div>

            {session ? (
              isEnrolled ? (
                <div className="space-y-3">
                  <div className="bg-[var(--surface)] p-3 text-center border border-[var(--border-color)] text-sm font-medium">
                    You are enrolled
                  </div>
                  <Link href={`/learn/${course.slug}/${course.lessons[0]?.slug || ''}`} className="block">
                    <Button className="w-full">Continue Learning</Button>
                  </Link>
                </div>
              ) : (
                <EnrollButton courseId={course.id} />
              )
            ) : (
              <Link href={`/login?callbackUrl=/courses/${course.slug}`} className="block">
                <Button className="w-full">Log In to Enroll</Button>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
