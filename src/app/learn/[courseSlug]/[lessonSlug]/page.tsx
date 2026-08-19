import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, ChevronLeft, ChevronRight,  } from 'lucide-react'
import { MarkCompleteButton } from '@/components/lessons/mark-complete-button'

export default async function LessonPage({ params }: { params: Promise<{ courseSlug: string, lessonSlug: string }> }) {
  const { courseSlug, lessonSlug } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      lessons: { orderBy: { orderIndex: 'asc' } }
    }
  })

  if (!course) notFound()

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      }
    }
  })

  const currentLesson = course.lessons.find(l => l.slug === lessonSlug)
  if (!currentLesson) notFound()

  // If not enrolled and not preview, block access
  if (!enrollment && !currentLesson.isPreview) {
    redirect(`/courses/${courseSlug}`)
  }

  // Get progress
  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      lessonId: { in: course.lessons.map(l => l.id) }
    },
    select: { lessonId: true }
  })
  const completedIds = progress.map(p => p.lessonId)
  const isCompleted = completedIds.includes(currentLesson.id)

  const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id)
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

  // Calculate percentage
  const percentage = Math.round((completedIds.length / course.lessons.length) * 100)

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-80 flex-col border-r border-[var(--border-color)] bg-[var(--surface-secondary)] overflow-y-auto">
        <div className="p-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--surface-secondary)] z-10">
          <Link href={`/courses/${courseSlug}`} className="text-sm font-semibold hover:text-[var(--accent)] transition-colors flex items-center gap-1 mb-2">
            <ChevronLeft className="h-4 w-4" /> Back to course
          </Link>
          <h2 className="font-bold line-clamp-1">{course.title}</h2>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-[var(--surface)] border border-[var(--border-color)] overflow-hidden">
              <div className="h-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="text-xs font-mono">{percentage}%</span>
          </div>
        </div>
        <div className="p-2 space-y-1">
          {course.lessons.map((lesson, idx) => {
            const isActive = lesson.id === currentLesson.id
            const isDone = completedIds.includes(lesson.id)
            return (
              <Link key={lesson.id} href={`/learn/${courseSlug}/${lesson.slug}`}>
                <div className={`flex items-center gap-3 p-3 text-sm transition-colors border ${isActive ? 'bg-[var(--surface)] border-[var(--border-color)] font-medium' : 'border-transparent hover:bg-[var(--surface)] hover:border-[var(--border-color)]'}`}>
                  {isDone ? (
                     <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                     <Circle className="h-4 w-4 text-[var(--ink-faint)] flex-shrink-0" />
                  )}
                  <span className="line-clamp-2">
                    <span className="text-[var(--ink-faint)] mr-2">{idx + 1}.</span>
                    {lesson.title}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[var(--surface)]">
        <div className="w-full max-w-3xl mx-auto p-6 md:p-10 pb-32">

          {/* Mobile breadcrumb */}
          <div className="md:hidden mb-6 flex items-center gap-2">
            <Link href={`/courses/${courseSlug}`} className="text-sm font-semibold hover:text-[var(--accent)] flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Course
            </Link>
          </div>

          <div className="mb-8">
            <div className="text-sm text-[var(--accent)] font-semibold mb-2">Lesson {currentIndex + 1} of {course.lessons.length}</div>
            <h1 className="text-3xl md:text-4xl font-bold">{currentLesson.title}</h1>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none mb-12 bg-[var(--surface-secondary)] p-6 md:p-8 brutal-box">
            {/* Extremely simple markdown rendering for MVP. A real app would use react-markdown. */}
            <div dangerouslySetInnerHTML={{ __html: currentLesson.body?.replace(/\n/g, '<br/>') || '' }} className="whitespace-pre-wrap font-sans" />
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-color)]">
            <div className="w-full sm:w-auto">
               <MarkCompleteButton
                 lessonId={currentLesson.id}
                 courseSlug={courseSlug}
                 isCompleted={isCompleted}
                 disabled={!enrollment}
               />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {prevLesson && (
                <Link href={`/learn/${courseSlug}/${prevLesson.slug}`} className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full"><ChevronLeft className="h-4 w-4 mr-1" /> Prev</Button>
                </Link>
              )}
              {nextLesson ? (
                <Link href={`/learn/${courseSlug}/${nextLesson.slug}`} className="flex-1 sm:flex-none">
                  <Button className="w-full">Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              ) : (
                percentage === 100 ? (
                  <Link href={`/courses/${courseSlug}/quiz`} className="flex-1 sm:flex-none">
                     <Button className="w-full bg-[var(--accent-orange)] text-white hover:bg-[#A33D00] hover:border-[#A33D00]">Take Quiz</Button>
                  </Link>
                ) : (
                  <div className="text-sm text-[var(--ink-faint)] px-4">Complete all lessons for quiz</div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
