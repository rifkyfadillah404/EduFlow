'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourseAction(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const course = await prisma.course.create({
    data: {
      title,
      slug,
      shortDescription: formData.get('shortDescription') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as Parameters<typeof prisma.course.create>[0]['data']['level'],
      isPublished: formData.get('isPublished') === 'on',
      createdBy: session.user.id,
    },
  })

  revalidatePath('/admin/courses')
  redirect(`/admin/courses/${course.id}/edit`)
}

export async function updateCourseAction(id: string, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  await prisma.course.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      shortDescription: formData.get('shortDescription') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as Parameters<typeof prisma.course.create>[0]['data']['level'],
      isPublished: formData.get('isPublished') === 'on',
    },
  })

  revalidatePath(`/admin/courses/${id}/edit`)
  revalidatePath('/admin/courses')
  revalidatePath('/courses')
  redirect('/admin/courses')
}

export async function deleteCourseAction(id: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  await prisma.course.delete({
    where: { id },
  })

  revalidatePath('/admin/courses')
  revalidatePath('/courses')
}
