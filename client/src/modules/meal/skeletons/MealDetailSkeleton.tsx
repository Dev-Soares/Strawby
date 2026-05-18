export default function MealDetailSkeleton() {
  return (
    <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-neutral-200 animate-pulse" />
        <div className="flex-1">
          <div className="h-8 w-48 rounded-lg bg-neutral-200 animate-pulse mb-2" />
          <div className="h-4 w-32 rounded-md bg-neutral-200 animate-pulse" />
        </div>
      </div>

      {/* Totals card skeleton */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 mb-6 animate-pulse">
        <div className="h-6 w-40 rounded-lg bg-neutral-200 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-16 rounded bg-neutral-200" />
              <div className="h-7 w-20 rounded bg-neutral-200" />
              <div className="h-2 w-full rounded-full bg-neutral-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Items skeleton */}
      <div className="h-5 w-32 rounded-md bg-neutral-200 animate-pulse mb-4" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-40 rounded bg-neutral-200" />
              <div className="h-5 w-16 rounded bg-neutral-200" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-6 rounded-lg bg-neutral-200" />
              <div className="h-6 rounded-lg bg-neutral-200" />
              <div className="h-6 rounded-lg bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
