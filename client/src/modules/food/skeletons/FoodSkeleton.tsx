export default function FoodSkeleton() {
  return (
    <div className="space-y-4 transition-colors duration-300">
      <div className="animate-pulse h-4 w-36 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 transition-colors duration-300">
            {/* nome + por 100g */}
            <div className="mb-3 space-y-1.5">
              <div className="animate-pulse h-4 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="animate-pulse h-3 w-14 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* calorias */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="animate-pulse h-3 w-3 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
              <div className="animate-pulse h-6 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="animate-pulse h-3 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* macros */}
            <div className="flex gap-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex-1 flex flex-col items-center gap-1">
                  <div className="animate-pulse h-2.5 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="animate-pulse h-4 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
