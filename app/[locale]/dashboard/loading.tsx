export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl animate-pulse">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="h-8 w-44 bg-elevated rounded-xl mb-2" />
          <div className="h-4 w-64 bg-elevated rounded-lg" />
        </div>
        <div className="h-8 w-20 bg-elevated rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-card border border-border rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
