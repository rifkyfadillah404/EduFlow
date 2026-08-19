import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { QuizForm } from '@/components/quiz/quiz-form'

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      quizzes: {
        include: {
          questions: { orderBy: { orderIndex: 'asc' } }
        }
      }
    }
  })

  if (!course || course.quizzes.length === 0) notFound()

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      }
    }
  })

  if (!enrollment) redirect(`/courses/${slug}`)

  const quiz = course.quizzes[0]

  // Check if they already passed
  const previousAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId: session.user.id,
      quizId: quiz.id,
      passed: true
    }
  })

  // If they already passed, show the certificate link
  if (previousAttempt) {
    const cert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        }
      }
    })

    return (
      <div className="container mx-auto max-w-3xl p-6 py-12 text-center">
        <div className="brutal-box p-12 bg-[var(--surface-secondary)] brutal-shadow border-green-500">
          <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Congratulations! 🎉</h1>
          <p className="text-[var(--ink-faint)] mb-8">
            Score: {previousAttempt.score}% ({previousAttempt.correctCount}/{previousAttempt.totalQuestions}) — you passed!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {cert && (
              <Link href={`/certificates/${cert.certificateCode}`}>
                <button className="brutal-box px-6 py-3 font-medium bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)] hover:bg-[var(--accent-hover)]">View Certificate</button>
              </Link>
            )}
            <Link href={`/courses/${slug}`}>
              <button className="brutal-box px-6 py-3 font-medium hover:bg-[var(--surface)]">Back to Course</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Passing questions to client component safely (excluding correct options/answers if we were strict,
  // but for MVP doing client-side state then submitting to server is fine. We will submit array of answers).
  const questions = quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options) as string[]
  }))

  return (
    <div className="container mx-auto max-w-3xl p-6 py-10">
      <Link href={`/courses/${slug}`} className="text-sm font-semibold hover:text-[var(--accent)] flex items-center gap-1 mb-8">
        <ChevronLeft className="h-4 w-4" /> Back to course
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-[var(--ink-faint)]">
          Answer {questions.length} questions. You need {quiz.passingScore}% to pass and earn your certificate.
        </p>
      </div>

      <QuizForm
        quizId={quiz.id}
        courseId={course.id}
        courseSlug={slug}
        questions={questions}
        passingScore={quiz.passingScore}
      />
    </div>
  )
}
