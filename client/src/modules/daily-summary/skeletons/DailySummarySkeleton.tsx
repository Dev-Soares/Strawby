export default function DailySummarySkeleton() {
  return (
    <div className="animate-pulse @container bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl shadow-sm p-5 sm:p-8 transition-colors duration-300">
      <div className="space-y-1.5 mb-6 sm:mb-8">
        <div className="h-4 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-40 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2 sm:gap-7">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-3 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="ml-auto h-3 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800" />
            </div>
            <div className="h-7 w-28 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800" />
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-neutral-100 dark:border-neutral-800">
        <div className="h-3 w-56 rounded-full bg-neutral-100 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
