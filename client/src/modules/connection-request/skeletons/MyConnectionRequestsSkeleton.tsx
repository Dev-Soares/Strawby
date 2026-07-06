const MyConnectionRequestsSkeleton = () => (
  <div className="mt-6">
    <div className="h-2.5 w-28 rounded bg-neutral-200 dark:bg-neutral-700 mb-3 ml-1 animate-pulse" />
    <div className="flex flex-col gap-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-4"
        >
          <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 w-2/5 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-2.5 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="h-5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
        </div>
      ))}
    </div>
  </div>
)

export default MyConnectionRequestsSkeleton
