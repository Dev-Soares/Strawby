export default function GoalProgressSkeleton() {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-6 animate-pulse">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="animate-pulse">
        <div className="h-10 w-28 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-5 h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <div className="mt-2.5 flex items-center justify-between">
          <div className="h-3 w-12 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-3 w-12 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="mt-6 h-24 w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </section>
  )
}
