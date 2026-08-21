import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QuizQuestionForm } from '@/components/admin/quiz-question-form'
import { QuizImportForm } from '@/components/admin/quiz-import-form'
import { deleteQuizQuestionAction } from '@/actions/quiz-actions'

export default async function ManageQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      quizzes: {
        include: { questions: { orderBy: { orderIndex: 'asc' } } }
      }
    }
  })

  if (!course) notFound()

  const quiz = course.quizzes[0]

  return (
    <div className="container mx-auto max-w-4xl p-6 py-10">
      <div className="flex items-center gap-2 mb-6 text-sm text-[var(--ink-faint)]">
        <Link href="/admin" className="hover:text-[var(--accent)]">Admin</Link> /
        <Link href="/admin/courses" className="hover:text-[var(--accent)]">Courses</Link> /
        <Link href={`/admin/courses/${id}/edit`} className="hover:text-[var(--accent)]">Edit</Link> / Quiz
      </div>

      <h1 className="text-3xl font-bold mb-2">Manage Quiz</h1>
      <p className="text-[var(--ink-faint)] mb-8">Course: {course.title}</p>

      {!quiz ? (
        <div className="brutal-box p-8 text-center bg-[var(--surface-secondary)]">
          <p className="mb-4">No quiz created for this course yet.</p>
          <form action={async () => {
            'use server'
            await prisma.quiz.create({
              data: { courseId: id, title: 'Final Quiz', passingScore: 70 }
            })
            redirect(`/admin/courses/${id}/quiz`)
          }}>
            <Button type="submit">Create Final Quiz</Button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="brutal-box p-6 bg-[var(--surface-secondary)]">
            <h2 className="text-xl font-bold mb-4">Quiz Settings</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-[var(--ink-faint)]">Title</label>
                <div className="font-bold">{quiz.title}</div>
              </div>
              <div className="w-32">
                <label className="text-sm font-medium text-[var(--ink-faint)]">Passing Score</label>
                <div className="font-bold">{quiz.passingScore}%</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Questions ({quiz.questions.length})</h2>

            <QuizQuestionForm quizId={quiz.id} courseId={id} />
            <QuizImportForm quizId={quiz.id} courseId={id} />

            <div className="space-y-4">
              {quiz.questions.length === 0 ? (
                <div className="brutal-box p-8 text-center border-dashed text-[var(--ink-faint)]">
                  No questions added yet.
                </div>
              ) : (
                quiz.questions.map((q, idx) => {
                  const options = JSON.parse(q.options) as string[]
                  return (
                    <div key={q.id} className="brutal-box p-6 bg-[var(--surface-secondary)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="font-bold mb-4"><span className="text-[var(--ink-faint)] mr-2">{idx + 1}.</span> {q.question}</div>
                        <form action={deleteQuizQuestionAction.bind(null, q.id, id)}>
                          <Button variant="danger" className="h-8 px-3 text-xs shrink-0">Delete</Button>
                        </form>
                      </div>
                      <div className="space-y-2 pl-6">
                        {options.map((opt, oIdx) => (
                          <div key={oIdx} className={`flex items-center gap-2 p-2 border ${oIdx === q.correctOptionIndex ? 'border-[var(--success)] bg-[var(--success)]/10' : 'border-transparent bg-[var(--surface)]'}`}>
                            {oIdx === q.correctOptionIndex && <span className="text-[var(--success)] text-xs font-bold w-4">✓</span>}
                            {oIdx !== q.correctOptionIndex && <span className="w-4"></span>}
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="mt-4 pl-6 text-sm text-[var(--ink-faint)] italic border-l-2 border-[var(--ink-dimmer)]">
                          Expl: {q.explanation}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
