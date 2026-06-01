export default function PatientStreakSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center text-center py-2 gap-3">
      <div className="h-35 w-35 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex items-end gap-1.5 justify-center">
        <div className="h-16 w-16 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800 mb-2" />
      </div>
      <div className="h-3 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-16 w-32 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
    </div>
  )
}
