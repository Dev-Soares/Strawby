const BestStreakCardSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center justify-center py-6">
    <div className="h-4 w-36 sm:h-5 sm:w-44 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    <div className="mt-3 sm:mt-5 flex items-center gap-3 sm:gap-5">
      <div className="h-11 w-11 sm:h-18 sm:w-18 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-12 w-20 sm:h-16 sm:w-28 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
    </div>
    <div className="mt-4 sm:mt-6 h-3 w-56 sm:w-72 max-w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
  </div>
)

export default BestStreakCardSkeleton
