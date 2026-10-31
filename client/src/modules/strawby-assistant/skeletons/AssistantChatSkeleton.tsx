export default function AssistantChatSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-14rem)] flex-col justify-between gap-4 sm:h-[calc(100dvh-16rem)]">
      <div className="flex-1 space-y-6 overflow-hidden px-1 py-2">
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="h-28 w-28 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-8 w-56 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="mx-auto max-w-md space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800"
            />
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <div className="h-14 w-full animate-pulse rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
