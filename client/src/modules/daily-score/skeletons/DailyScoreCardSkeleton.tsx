const DailyScoreCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4 sm:p-8 flex flex-col gap-4 transition-colors duration-300">
    <div className="h-5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    <div className="flex items-center gap-4 mt-2">
      <div className="h-12 w-32 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    </div>
    <div className="h-3 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
  </div>
)

export default DailyScoreCardSkeleton
