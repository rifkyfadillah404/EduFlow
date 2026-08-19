'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function enrollAction(courseId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { orderIndex: 'asc' }, take: 1 } },
  })

  if (!course) throw new Error('Course not found')
  if (!course.isPublished) throw new Error('Course not published')

  try {
    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        status: 'ACTIVE',
      },
    })
  } catch {
    // Unique constraint violation means already enrolled, which is fine
  }

  revalidatePath('/dashboard')
  revalidatePath('/my-courses')
  revalidatePath(`/courses/${course.slug}`)

  return {
    success: true,
    firstLessonSlug: course.lessons[0]?.slug
  }
}
