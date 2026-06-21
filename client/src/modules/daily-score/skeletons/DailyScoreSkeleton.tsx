const DailyScoreSkeleton = () => (
  <div className="animate-pulse space-y-6 sm:space-y-8">
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="h-35 w-35 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
      <div className="h-10 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
      <div className="h-3 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-3 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
        <div className="w-33 h-33 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-2 transition-colors duration-300" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="h-3 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
        <div className="w-28 h-28 rounded-full bg-neutral-200 dark:bg-neutral-800 mt-2 transition-colors duration-300" />
      </div>
    </div>
  </div>
)

export default DailyScoreSkeleton
