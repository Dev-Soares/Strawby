const BestStreakCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-5 px-1 flex flex-col gap-2">
      <div className="h-5 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
      <div className="h-3 w-44 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    </div>
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="w-25 h-25 rounded-2xl bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
      <div className="h-14 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-1 transition-colors duration-300" />
      <div className="h-4 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    </div>
  </div>
)

export default BestStreakCardSkeleton
