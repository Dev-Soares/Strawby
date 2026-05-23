const RecipeDetailSkeleton = () => (
  <div className="animate-pulse px-4 sm:px-10 lg:px-16 pt-10 pb-8 sm:py-12 max-w-3xl mx-auto">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0" />
      <div className="flex-1">
        <div className="h-10 w-48 rounded bg-neutral-100 dark:bg-neutral-800 mb-2" />
        <div className="h-4 w-24 rounded bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>

    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 mb-6 transition-colors duration-300">
      <div className="h-4 w-32 rounded bg-neutral-100 dark:bg-neutral-800 mb-5" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-3 w-16 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-6 w-12 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>

    <div className="h-4 w-40 rounded bg-neutral-100 dark:bg-neutral-800 mb-4" />
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 transition-colors duration-300">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="h-4 w-32 rounded bg-neutral-100 dark:bg-neutral-800 mb-2" />
              <div className="h-3 w-16 rounded bg-neutral-100 dark:bg-neutral-800" />
            </div>
            <div className="h-6 w-12 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-8 rounded bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-8 rounded bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default RecipeDetailSkeleton
