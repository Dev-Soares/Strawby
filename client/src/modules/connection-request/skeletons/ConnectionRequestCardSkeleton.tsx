const ConnectionRequestCardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex flex-col gap-3 transition-colors duration-300">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="h-4 w-28 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-3 w-40 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </div>
    </div>
    <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
    <div className="flex gap-2">
      <div className="h-8 flex-1 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-8 flex-1 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
    </div>
  </div>
)

export default ConnectionRequestCardSkeleton
