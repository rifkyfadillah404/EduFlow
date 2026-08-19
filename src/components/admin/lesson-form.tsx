'use client'

import { useActionState } from 'react'
import { createLessonAction } from '@/actions/lesson-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LessonForm({ courseId }: { courseId: string }) {
  const action = createLessonAction.bind(null, courseId)
  const [, formAction, pending] = useActionState(action as any, null)

  return (
    <form action={formAction} className="brutal-box p-6 bg-[var(--surface-secondary)] space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Lesson Title</label>
        <Input name="title" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content Type</label>
        <select
          name="contentType"
          className="flex h-10 w-full brutal-box px-3 py-2 text-sm text-[var(--ink)] focus-visible:outline-none focus-visible:border-[var(--accent)]"
        >
          <option value="TEXT">Text (Markdown)</option>
          <option value="VIDEO">Video Embed</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Body (Markdown)</label>
        <textarea
          name="body"
          rows={10}
          className="flex w-full brutal-box px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus-visible:outline-none focus-visible:border-[var(--accent)] font-mono"
          placeholder="# Hello World..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Video URL (optional)</label>
        <Input name="videoUrl" type="url" placeholder="https://youtube.com/..." />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="isPreview"
          name="isPreview"
          className="w-4 h-4 accent-[var(--accent)]"
        />
        <label htmlFor="isPreview" className="text-sm font-medium cursor-pointer">
          Free Preview (Available without enrollment)
        </label>
      </div>

      <div className="pt-4 border-t border-[var(--border-color)]">
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Adding...' : 'Add Lesson'}
        </Button>
      </div>
    </form>
  )
}
