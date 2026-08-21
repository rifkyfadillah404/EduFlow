'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { calculateQuizScore, generateCertificateCode } from '@/lib/quiz'
import { revalidatePath } from 'next/cache'

export async function createQuizAction(courseId: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  await prisma.quiz.create({
    data: { courseId, title: 'Final Quiz', passingScore: 70 },
  })

  revalidatePath(`/admin/courses/${courseId}/quiz`)
}

export async function createQuizQuestionAction(prevState: unknown, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  const quizId = formData.get('quizId') as string
  const courseId = formData.get('courseId') as string
  const question = formData.get('question') as string
  const options = [
    formData.get('option0') as string,
    formData.get('option1') as string,
    formData.get('option2') as string,
    formData.get('option3') as string,
  ]
  const correctOptionIndex = parseInt(formData.get('correctOptionIndex') as string, 10)
  const explanation = (formData.get('explanation') as string) || null

  if (!question || options.some(o => !o) || isNaN(correctOptionIndex)) {
    return { error: 'All fields required' }
  }

  const last = await prisma.quizQuestion.findFirst({
    where: { quizId },
    orderBy: { orderIndex: 'desc' },
  })

  await prisma.quizQuestion.create({
    data: {
      quizId,
      question,
      options: JSON.stringify(options),
      correctOptionIndex,
      explanation,
      orderIndex: last ? last.orderIndex + 1 : 0,
    },
  })

  revalidatePath(`/admin/courses/${courseId}/quiz`)
}

export async function deleteQuizQuestionAction(questionId: string, courseId: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  await prisma.quizQuestion.delete({ where: { id: questionId } })
  revalidatePath(`/admin/courses/${courseId}/quiz`)
}

export async function submitQuizAction(quizId: string, courseId: string, answers: number[]) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { orderIndex: 'asc' } } },
  })

  if (!quiz) throw new Error('Quiz not found')

  const correctAnswers = quiz.questions.map(q => q.correctOptionIndex)
  const result = calculateQuizScore(answers, correctAnswers)

  // Save attempt
  await prisma.quizAttempt.create({
    data: {
      quizId,
      userId: session.user.id,
      score: result.score,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      passed: result.passed,
      answers: JSON.stringify(answers),
    },
  })

  let certificateCode = null

  // If passed, mark enrollment as completed and generate certificate
  if (result.passed) {
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    // Generate certificate if not exists
    const existingCert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    if (!existingCert) {
      const code = generateCertificateCode(courseId, session.user.id)
      const cert = await prisma.certificate.create({
        data: {
          userId: session.user.id,
          courseId,
          certificateCode: code,
        },
      })
      certificateCode = cert.certificateCode
    } else {
      certificateCode = existingCert.certificateCode
    }
  }

  revalidatePath('/dashboard')

  return { ...result, certificateCode }
}
