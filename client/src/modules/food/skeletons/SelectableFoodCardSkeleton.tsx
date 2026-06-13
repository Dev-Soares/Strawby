export default function SelectableFoodCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 relative transition-colors duration-300">
      <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-neutral-200 dark:bg-neutral-800" />

      <div className="mb-3 pr-10 space-y-1.5">
        <div className="h-4 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-14 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <div className="h-3 w-3 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
        <div className="h-6 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="flex gap-4">
        {[0, 1, 2].map((j) => (
          <div key={j} className="flex-1 flex flex-col items-center gap-1">
            <div className="h-2.5 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
