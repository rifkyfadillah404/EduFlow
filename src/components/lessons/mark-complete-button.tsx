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
      <div className="flex items-center gap-2 text-green-500 font-medium px-4 py-2 brutal-box bg-green-500/10 border-green-500/30">
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
      className="w-full border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
    >
      {isPending ? 'Saving...' : 'Mark as Complete'}
    </Button>
  )
}
