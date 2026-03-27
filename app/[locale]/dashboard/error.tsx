"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-6xl font-bold font-display gradient-text mb-4 leading-none">Oops</p>
      <h2 className="text-xl font-bold text-text mb-2">Something went wrong</h2>
      <p className="text-text-muted mb-8 max-w-sm text-sm leading-relaxed">
        An unexpected error occurred in the dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-elevated border border-border text-text-muted font-semibold text-sm hover:text-text transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
