export default function GuildLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl animate-pulse">
      {/* Guild header */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
        <div className="w-[72px] h-[72px] rounded-2xl bg-elevated shrink-0" />
        <div>
          <div className="h-7 w-48 bg-elevated rounded-xl mb-2" />
          <div className="h-6 w-24 bg-elevated rounded-full" />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border h-28" />
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border h-48" />
        ))}
      </div>
      {/* Quick access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-card border border-border" />
        ))}
      </div>
    </div>
  )
}
