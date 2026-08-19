'use client'

import { useState } from 'react'
import { submitQuizAction } from '@/actions/quiz-actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Question = {
  id: string
  question: string
  options: string[]
}

export function QuizForm({
  quizId,
  courseId,
  courseSlug,
  questions,
  passingScore
}: {
  quizId: string
  courseId: string
  courseSlug: string
  questions: Question[]
  passingScore: number
}) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [isPending, setIsPending] = useState(false)
  const [result, setResult] = useState<{ score: number, passed: boolean, certificateCode?: string } | null>(null)

  const handleSelect = (qIndex: number, optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[qIndex] = optionIndex
    setAnswers(newAnswers)
  }

  const allAnswered = answers.every(a => a !== -1)

  const handleSubmit = async () => {
    setIsPending(true)
    try {
      const res = await submitQuizAction(quizId, courseId, answers)
      setResult(res as any) // ignore type for now
    } catch (e) {
      console.error(e)
      alert("Failed to submit quiz.")
    } finally {
      setIsPending(false)
    }
  }

  if (result) {
    return (
      <div className={`brutal-box p-8 md:p-12 brutal-shadow text-center ${result.passed ? 'border-green-500' : 'border-[var(--accent-orange)]'}`}>
        <div className="text-6xl font-bold mb-2">{result.score}%</div>
        <h2 className="text-2xl font-bold mb-4">
          {result.passed ? 'Congratulations, you passed!' : 'Keep trying!'}
        </h2>
        <p className="text-[var(--ink-faint)] mb-8">
          You needed {passingScore}% to pass.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {result.passed ? (
            <>
              {result.certificateCode && (
                 <Link href={`/certificates/${result.certificateCode}`}>
                   <Button className="w-full sm:w-auto bg-[#2E90FA] hover:bg-[#1B7CE0] border-[#2E90FA]">View Certificate</Button>
                 </Link>
              )}
              <Link href={`/dashboard`}>
                <Button variant="outline" className="w-full sm:w-auto">Go to Dashboard</Button>
              </Link>
            </>
          ) : (
            <>
              <Button onClick={() => { setResult(null); setAnswers(new Array(questions.length).fill(-1)) }}>
                Retry Quiz
              </Button>
              <Link href={`/courses/${courseSlug}`}>
                <Button variant="outline" className="w-full sm:w-auto">Review Course</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {questions.map((q, qIndex) => (
        <div key={q.id} className="brutal-box p-6 bg-[var(--surface-secondary)]">
          <h3 className="text-lg font-bold mb-4">
            <span className="text-[var(--ink-faint)] mr-2">{qIndex + 1}.</span>
            {q.question}
          </h3>
          <div className="space-y-3">
            {q.options.map((opt, oIndex) => {
              const isSelected = answers[qIndex] === oIndex
              return (
                <label
                  key={oIndex}
                  className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                      : 'border-[var(--border-color)] hover:bg-[var(--surface)]'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={oIndex}
                    checked={isSelected}
                    onChange={() => handleSelect(qIndex, oIndex)}
                    className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                  />
                  <span className={isSelected ? 'font-medium' : ''}>{opt}</span>
                </label>
              )
            })}
          </div>
        </div>
      ))}

      <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
        <Button
          
          onClick={handleSubmit}
          disabled={!allAnswered || isPending}
          className="w-full sm:w-auto px-12"
        >
          {isPending ? 'Submitting...' : 'Submit Answers'}
        </Button>
      </div>
    </div>
  )
}
