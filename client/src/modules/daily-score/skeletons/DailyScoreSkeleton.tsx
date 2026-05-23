const DailyScoreSkeleton = () => (
  <div className="space-y-4 sm:space-y-5">
    <div className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 sm:p-8 flex flex-col gap-4 transition-colors duration-300">
      <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5 mt-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="aspect-4/5 sm:aspect-5/7 rounded-2xl bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300"
          />
        ))}
      </div>
    </div>
    <div className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 sm:p-8 flex flex-col gap-4 transition-colors duration-300">
      <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
      <div className="flex items-center gap-4 mt-2">
        <div className="h-12 w-32 rounded bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
      </div>
      <div className="h-3 w-full rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
      <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full mt-1">
        <div className="h-10 rounded bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
        <div className="h-10 rounded bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
      </div>
    </div>
  </div>
)

export default DailyScoreSkeleton
