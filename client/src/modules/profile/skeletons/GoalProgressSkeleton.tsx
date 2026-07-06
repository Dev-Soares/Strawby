export default function GoalProgressSkeleton() {
  return (
    <section className="mb-5">
      <div className="px-1 mb-4">
        <div className="h-6 w-40 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-1.5" />
        <div className="h-4 w-52 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>

      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5">
        <div className="flex items-center gap-3 mb-6 animate-pulse">
          <div className="w-11 h-11 rounded-2xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-2.5 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-5 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        <div className="h-3 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse mb-3" />
        <div className="flex items-center justify-between mb-5 animate-pulse">
          <div className="h-3 w-12 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3 w-20 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3 w-12 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="h-11 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </section>
  )
}
