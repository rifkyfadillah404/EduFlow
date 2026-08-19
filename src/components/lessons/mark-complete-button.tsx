'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { markLessonCompleteAction } from '@/actions/lesson-actions'
import { CheckCircle } from 'lucide-react'

export function MarkCompleteButton({
  lessonId,
  courseSlug,
  isCompleted,
  disabled
}: {
  lessonId: string
  courseSlug: string
  isCompleted: boolean
  disabled: boolean
}) {
  const [isPending, setIsPending] = useState(false)

  async function handleMarkComplete() {
    setIsPending(true)
    try {
      await markLessonCompleteAction(lessonId, courseSlug)
    } finally {
      setIsPending(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-[var(--success)] font-medium px-4 py-2 brutal-box bg-[var(--success)]/10 border-[var(--success)]/30">
        <CheckCircle className="h-5 w-5" />
        Completed
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleMarkComplete}
      disabled={disabled || isPending}
      className="w-full border-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
    >
      {isPending ? 'Saving...' : 'Mark as Complete'}
    </Button>
  )
}
