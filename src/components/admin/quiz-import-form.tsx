'use client'

import { useActionState } from 'react'
import { importQuizQuestionsAction } from '@/actions/quiz-actions'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Download } from 'lucide-react'
import { useState } from 'react'

const EXAMPLE = JSON.stringify([
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctOptionIndex: 1,
    explanation: 'Basic arithmetic',
  },
  {
    question: 'Capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctOptionIndex: 2,
  },
], null, 2)

export function QuizImportForm({ quizId, courseId }: { quizId: string; courseId: string }) {
  const [state, formAction, pending] = useActionState(importQuizQuestionsAction, null)
  const [open, setOpen] = useState(false)

  function downloadTemplate() {
    const blob = new Blob([EXAMPLE], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'quiz-template.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)} className="mb-6">
        Import from JSON
      </Button>
    )
  }

  return (
    <div className="brutal-box p-6 bg-[var(--surface-secondary)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Import Questions</h3>
        <button onClick={() => setOpen(false)} className="text-[var(--ink-faint)] hover:text-[var(--ink)]">
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="quizId" value={quizId} />
        <input type="hidden" name="courseId" value={courseId} />

        <div className="text-xs text-[var(--ink-faint)] space-y-1">
          <p>Format: JSON array. Each object needs <code>question</code>, <code>options</code> (4 strings), <code>correctOptionIndex</code> (0-3).</p>
          <p><code>explanation</code> is optional.</p>
          <button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline">
            <Download className="h-3 w-3" /> Download template
          </button>
        </div>

        <textarea
          name="json"
          rows={10}
          required
          placeholder={EXAMPLE}
          className="w-full border border-[var(--border-color)] bg-[var(--surface)] p-3 text-xs font-mono resize-y"
        />

        {state?.error && (
          <div className="text-sm text-[var(--error)] font-medium p-2 border border-[var(--error)]/20 bg-[var(--error)]/10 brutal-box">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="text-sm text-[var(--success)] font-medium p-2 border border-[var(--success)]/20 bg-[var(--success)]/10 brutal-box">
            {state.success}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? 'Importing...' : 'Import'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
