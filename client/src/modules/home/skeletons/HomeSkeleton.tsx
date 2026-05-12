export default function HomeSkeleton() {
  return (
    <div className="animate-pulse px-6 sm:px-10 lg:px-16 py-10 sm:py-12 min-h-screen space-y-5">
      <div className="space-y-2 mb-10">
        <div className="h-3 w-24 rounded-full bg-neutral-200" />
        <div className="h-12 w-64 rounded-full bg-neutral-200" />
        <div className="h-7 w-72 rounded-full bg-neutral-200" />
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden">
        <div className="bg-red-600 px-6 sm:px-8 pt-8 pb-5 rounded-t-[2rem]">
          <div className="space-y-1.5">
            <div className="h-5 w-28 rounded-full bg-white/20" />
            <div className="h-4 w-40 rounded-full bg-white/20" />
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
            {[...Array(7)].map((_, i) => (
              <div
                key={`d-${i}`}
                className="flex flex-col rounded-xl border border-neutral-100 overflow-hidden aspect-[5/6]"
              >
                <div className="h-5 bg-neutral-100" />
                <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
                  <div className="h-5 w-4 rounded-full bg-neutral-200" />
                  <div className="h-1.5 w-1.5 rounded-full bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl p-8 space-y-6 shadow-sm">
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

        <div className="space-y-3">
          <div className="flex justify-between px-1">
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded-full bg-neutral-200" />
              <div className="h-3 w-28 rounded-full bg-neutral-200" />
            </div>
            <div className="h-4 w-20 rounded-full bg-neutral-200" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-white rounded-3xl p-5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 rounded-full bg-neutral-200" />
                <div className="h-2.5 w-48 rounded-full bg-neutral-200" />
              </div>
              <div className="h-5 w-14 rounded-full bg-neutral-200" />
            </div>
          ))}
          <div className="h-14 rounded-3xl border border-dashed border-neutral-200" />
        </div>
      </div>
    </div>
  )
}
