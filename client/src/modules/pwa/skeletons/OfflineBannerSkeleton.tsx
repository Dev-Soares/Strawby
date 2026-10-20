const OfflineBannerSkeleton = () => (
  <div className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
    <div className="flex w-full max-w-md animate-pulse items-center gap-3 rounded-full border border-neutral-200 bg-white/95 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/95">
      <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="h-3.5 w-40 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-3 w-52 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="h-8 w-20 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700" />
    </div>
  </div>
)

export default OfflineBannerSkeleton
