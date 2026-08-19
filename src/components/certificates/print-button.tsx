'use client'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="brutal-box px-6 py-3 font-medium bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-orange)] hover:text-[var(--accent-orange-text)] transition-colors"
    >
      Print / Save PDF
    </button>
  )
}