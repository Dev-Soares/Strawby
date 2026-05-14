export default function DailySummarySkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl sm:rounded-3xl shadow-sm p-5 sm:p-8 space-y-6">
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-28 rounded-full bg-neutral-200" />
          <div className="h-3 w-40 rounded-full bg-neutral-200" />
        </div>
        <div className="h-9 w-24 rounded-2xl bg-neutral-100" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-2.5 w-14 rounded-full bg-neutral-200" />
              <div className="h-5 w-12 rounded-full bg-neutral-200" />
            </div>
            <div className="h-3 rounded-full bg-neutral-100" />
          </div>
        ))}
      </div>
      <div className="h-3 rounded-full bg-neutral-100" />
    </div>
  )
}
