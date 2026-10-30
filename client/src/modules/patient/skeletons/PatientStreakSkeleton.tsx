export default function PatientStreakSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8 transition-colors duration-300">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="h-9 w-9 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-32 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div className="h-33 w-33 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="w-full flex-1 flex flex-col items-center gap-3 sm:items-start">
          <div className="h-12 w-24 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-36 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-16 w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800/60" />
        </div>
      </div>
    </div>
  )
}
