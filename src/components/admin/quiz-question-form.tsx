'use client'

import { useActionState } from 'react'
import { createQuizQuestionAction } from '@/actions/quiz-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export function QuizQuestionForm({
  quizId,
  courseId,
}: {
  quizId: string
  courseId: string
}) {
  // @ts-expect-error -- useActionState overload mismatch; action works at runtime
  const [state, formAction, pending] = useActionState(createQuizQuestionAction, null)
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="mb-6">
        Add Question
      </Button>
    )
  }

  return (
    <div className="brutal-box p-6 bg-[var(--surface-secondary)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">New Question</h3>
        <button onClick={() => setOpen(false)} className="text-[var(--ink-faint)] hover:text-[var(--ink)]">
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="quizId" value={quizId} />
        <input type="hidden" name="courseId" value={courseId} />

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="question">Question</label>
          <textarea
            id="question"
            name="question"
            rows={2}
            required
            placeholder="What is..."
            className="w-full border border-[var(--border-color)] bg-[var(--surface)] p-3 text-sm font-sans resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="space-y-1">
              <label className="text-xs font-medium text-[var(--ink-faint)]">Option {i + 1}</label>
              <Input
                name={`option${i}`}
                required
                placeholder={`Option ${i + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="correctOptionIndex">Correct answer</label>
          <select
            id="correctOptionIndex"
            name="correctOptionIndex"
            required
            className="w-full border border-[var(--border-color)] bg-[var(--surface)] p-3 text-sm font-sans"
          >
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="explanation">Explanation (optional)</label>
          <textarea
            id="explanation"
            name="explanation"
            rows={2}
            placeholder="Why this is the correct answer..."
            className="w-full border border-[var(--border-color)] bg-[var(--surface)] p-3 text-sm font-sans resize-none"
          />
        </div>

        {state?.error && (
          <div className="text-sm text-[var(--error)] font-medium p-2 border border-[var(--error)]/20 bg-[var(--error)]/10 brutal-box">
            {state.error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Question'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}