const PrivateFoodSkeleton = () => (
  <div className="animate-pulse rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-3 transition-colors duration-300">
    <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    <div className="flex gap-4 mt-2">
      <div className="h-8 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
      <div className="h-8 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
      <div className="h-8 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
    </div>
  </div>
)

export default PrivateFoodSkeleton
