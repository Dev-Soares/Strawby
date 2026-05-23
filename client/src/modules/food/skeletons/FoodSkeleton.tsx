export default function FoodSkeleton() {
  return (
    <div className="space-y-4 transition-colors duration-300">
      <div className="animate-pulse h-4 w-36 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 space-y-2.5 transition-colors duration-300">
            <div className="animate-pulse h-4 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
            <div className="animate-pulse h-3 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
            <div className="animate-pulse h-3.5 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  )
}
