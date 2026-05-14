export default function MealListSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex justify-between px-1">
        <div className="space-y-1.5">
          <div className="h-4 w-36 rounded-full bg-neutral-200" />
          <div className="h-3 w-28 rounded-full bg-neutral-200" />
        </div>
        <div className="h-4 w-20 rounded-full bg-neutral-200" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-neutral-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 rounded-full bg-neutral-200" />
            <div className="h-2.5 w-48 rounded-full bg-neutral-200" />
          </div>
          <div className="h-5 w-14 rounded-full bg-neutral-200" />
        </div>
      ))}
      <div className="h-14 rounded-2xl sm:rounded-3xl border border-dashed border-neutral-200" />
    </div>
  )
}
