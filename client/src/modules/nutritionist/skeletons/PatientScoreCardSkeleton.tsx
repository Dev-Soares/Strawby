const PatientScoreCardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex flex-col gap-4 transition-colors duration-300">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="h-4 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-40 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="h-9 w-14 rounded-xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
    </div>
    <div className="flex flex-col gap-2">
      <div className="h-2.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    </div>
  </div>
)

export default PatientScoreCardSkeleton
