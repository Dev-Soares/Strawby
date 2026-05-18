export default function RouteSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      {/* Header shimmer */}
      <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center gap-4">
        <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <div className="h-4 w-24 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <div className="ml-auto h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>

      {/* Content shimmer */}
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="h-10 w-48 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-32 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
        <div className="h-64 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
  )
}
