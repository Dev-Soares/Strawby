export default function PatientDiarySkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
        ))}
      </div>
    </div>
  )
}
