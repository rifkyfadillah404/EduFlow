export function calculateProgress(completedLessons: number, totalLessons: number) {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}
