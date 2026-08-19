'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { calculateQuizScore, generateCertificateCode } from '@/lib/quiz'
import { revalidatePath } from 'next/cache'

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
