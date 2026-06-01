export default function PlanSkeleton() {
  return (
    <div className="animate-pulse space-y-5 px-4 sm:px-6 py-8 max-w-2xl mx-auto">
      <div className="space-y-1.5">
        <div className="h-7 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3.5 w-56 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
        <div className="space-y-1">
          <div className="h-4 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-36 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3">
        <div className="h-4 w-36 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
        <div className="h-4 w-44 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3.5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3.5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800" />
          </div>
        ))}
      </div>

      <div className="h-14 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
    </div>
  )
}
