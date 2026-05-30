export default function PatientHomeSkeleton() {
  return (
    <div className="animate-pulse px-4 sm:px-10 lg:px-16 pt-10 pb-8 min-h-screen">
      <div className="h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-800 mb-4" />
      <div className="h-10 w-64 rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
      <div className="h-6 w-48 rounded bg-neutral-200 dark:bg-neutral-800 mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-64 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
