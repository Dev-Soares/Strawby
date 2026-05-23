const RecipeFormSkeleton = () => (
  <div className="animate-pulse max-w-2xl space-y-6">
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-colors duration-300">
      <div className="h-3 w-32 rounded bg-neutral-100 dark:bg-neutral-800 mb-3" />
      <div className="h-8 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
    </div>
    <div className="h-14 w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
  </div>
)

export default RecipeFormSkeleton
