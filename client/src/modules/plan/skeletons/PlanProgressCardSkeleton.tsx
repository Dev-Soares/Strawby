export default function PlanProgressCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-7 animate-pulse transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
        <div className="flex-1">
          <div className="h-4 w-48 rounded bg-neutral-200 dark:bg-neutral-700 mb-2" />
          <div className="h-3 w-64 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/30 p-4">
            <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-700 mb-4" />
            <div className="h-8 w-24 rounded bg-neutral-200 dark:bg-neutral-700 mb-4" />
            <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 mb-2" />
            <div className="h-3 w-28 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
        ))}
      </div>
    </div>
  )
}
