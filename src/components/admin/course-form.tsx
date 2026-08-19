'use client'

import { useActionState } from 'react'
import { createCourseAction, updateCourseAction } from '@/actions/course-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function CourseForm({ initialData }: { initialData?: any }) {
  // Bind action if updating
  const action = initialData
    ? updateCourseAction.bind(null, initialData.id)
    : createCourseAction

  const [, formAction, pending] = useActionState(action as any, null)

  return (
    <form action={formAction} className="brutal-box p-6 bg-[var(--surface-secondary)] space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input name="title" defaultValue={initialData?.title} required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Short Description (Summary)</label>
        <Input name="shortDescription" defaultValue={initialData?.shortDescription || ''} required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Full Description (Markdown)</label>
        <textarea
          name="description"
          defaultValue={initialData?.description || ''}
          rows={6}
          required
          className="flex w-full brutal-box px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus-visible:outline-none focus-visible:border-[var(--accent)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Input name="category" defaultValue={initialData?.category} placeholder="e.g. Web Development" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Level</label>
          <select
            name="level"
            defaultValue={initialData?.level || 'BEGINNER'}
            className="flex h-10 w-full brutal-box px-3 py-2 text-sm text-[var(--ink)] focus-visible:outline-none focus-visible:border-[var(--accent)]"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          defaultChecked={initialData?.isPublished}
          className="w-4 h-4 accent-[var(--accent)]"
        />
        <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
          Publish this course (visible to students)
        </label>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : (initialData ? 'Update Course' : 'Create Course')}
        </Button>
      </div>
    </form>
  )
}
