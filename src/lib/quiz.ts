export function calculateQuizScore(
  answers: number[],
  correctAnswers: number[]
): { score: number; correctCount: number; totalQuestions: number; passed: boolean } {
  const totalQuestions = correctAnswers.length
  const correctCount = answers.reduce(
    (count, answer, i) => count + (answer === correctAnswers[i] ? 1 : 0),
    0
  )
  const score = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100)
  return { score, correctCount, totalQuestions, passed: score >= 70 }
}

export function generateCertificateCode(courseId: string, userId: string) {
  const short = (s: string) => s.slice(-6).toUpperCase()
  return `EDU-${short(courseId)}-${short(userId)}`
}
