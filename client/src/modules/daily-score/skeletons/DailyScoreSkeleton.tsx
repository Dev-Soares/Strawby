const DailyScoreSkeleton = () => (
  <div className="space-y-4 sm:space-y-5">
    <div className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 sm:p-8 flex flex-col gap-4">
      <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5 mt-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="aspect-4/5 sm:aspect-5/7 rounded-2xl bg-neutral-200 dark:bg-neutral-700"
          />
        ))}
      </div>
    </div>
    <div className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 sm:p-8 flex flex-col gap-4">
      <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex items-center gap-4 mt-2">
        <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  </div>
)

export default DailyScoreSkeleton
