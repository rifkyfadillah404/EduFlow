'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function markLessonCompleteAction(lessonId: string, courseSlug: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    update: {}, // if exists, do nothing (or update completedAt if you want)
    create: {
      userId: session.user.id,
      lessonId,
    },
  })

  // We should also check if all lessons are complete to update enrollment status,
  // but for MVP we will let the Quiz completion handle the final status check.

  revalidatePath(`/learn/${courseSlug}`)
  revalidatePath('/dashboard')
}

// Admin actions
export async function createLessonAction(courseId: string, prevState: unknown, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // get max order index
  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { orderIndex: 'desc' },
  })

  const orderIndex = lastLesson ? lastLesson.orderIndex + 1 : 0

  await prisma.lesson.create({
    data: {
      courseId,
      title,
      slug,
      contentType: formData.get('contentType') as Parameters<typeof prisma.lesson.create>[0]['data']['contentType'],
      body: formData.get('body') as string,
      videoUrl: formData.get('videoUrl') as string,
      isPreview: formData.get('isPreview') === 'on',
      orderIndex,
    },
  })

  revalidatePath(`/admin/courses/${courseId}/lessons`)
}

export async function deleteLessonAction(id: string, courseId: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  await prisma.lesson.delete({ where: { id } })
  revalidatePath(`/admin/courses/${courseId}/lessons`)
}
