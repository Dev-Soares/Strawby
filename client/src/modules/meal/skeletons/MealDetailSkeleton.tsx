export default function MealDetailSkeleton() {
  return (
    <div className="px-4 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="flex-1">
          <div className="h-8 w-48 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-2" />
          <div className="h-4 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        </div>
      </div>

      {/* Observações skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-5 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-24 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Totals skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-5 w-40 rounded-md bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-4 transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
              <div className="h-6 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Items skeleton */}
      <div className="mb-4 flex animate-pulse items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-5 w-28 rounded-md bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-5 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <div className="h-8 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-8 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-8 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
