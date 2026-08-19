'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { enrollAction } from '@/actions/enrollment-actions'
import { useRouter } from 'next/navigation'

export function EnrollButton({ courseId }: { courseId: string }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleEnroll() {
    setIsPending(true)
    try {
      const res = await enrollAction(courseId)
      if (res.success && res.firstLessonSlug) {
        router.push(`/learn/${courseId}/${res.firstLessonSlug}`) // Not perfect routing mapping but redirects
        // Better: Wait for page revalidation
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      className="w-full"
      onClick={handleEnroll}
      disabled={isPending}
    >
      {isPending ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  )
}
