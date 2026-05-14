export default function PlanMealsSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white border border-neutral-200 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-neutral-100" />
            <div className="h-6 w-16 rounded-full bg-neutral-100" />
          </div>
          <div className="h-12 w-32 rounded bg-neutral-100" />
          <div className="h-4 w-24 rounded bg-neutral-100" />
          <div className="flex gap-2 pt-2">
            <div className="h-8 w-20 rounded-full bg-neutral-100" />
            <div className="h-8 w-20 rounded-full bg-neutral-100" />
            <div className="h-8 w-20 rounded-full bg-neutral-100" />
          </div>
          <div className="h-10 rounded-lg bg-neutral-100 mt-2" />
        </div>
      ))}
    </div>
  )
}
