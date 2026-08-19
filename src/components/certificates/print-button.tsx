'use client'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="brutal-box px-6 py-3 font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-orange)] transition-colors"
    >
      Print / Save PDF
    </button>
  )
}