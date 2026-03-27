import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-9xl font-bold font-display gradient-text mb-4 leading-none">404</p>
      <h1 className="text-2xl font-bold text-text mb-2">Page not found</h1>
      <p className="text-text-muted mb-8 max-w-sm text-sm leading-relaxed">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
