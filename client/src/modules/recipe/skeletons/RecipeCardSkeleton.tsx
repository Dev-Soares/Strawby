const RecipeCardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col transition-colors duration-300">
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0" />
        <div className="h-5 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
      </div>
      <div className="h-8 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-6 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        <div className="h-6 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>
    <div className="border-t border-neutral-100 dark:border-neutral-800 px-5 py-3 transition-colors duration-300">
      <div className="h-4 w-1/4 rounded bg-neutral-100 dark:bg-neutral-800" />
    </div>
  </div>
)

export default RecipeCardSkeleton
