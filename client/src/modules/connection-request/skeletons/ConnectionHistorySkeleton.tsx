const ConnectionHistorySkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse flex items-center gap-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 p-4"
      >
        <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 w-2/5 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-2.5 w-3/5 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
      </div>
    ))}
  </div>
)

export default ConnectionHistorySkeleton
