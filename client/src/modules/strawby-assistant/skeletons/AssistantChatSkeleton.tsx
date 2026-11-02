export default function AssistantChatSkeleton() {
  return (
    <div className="flex h-[calc(100dvh-14rem)] flex-col justify-between gap-4 sm:h-[calc(100dvh-16rem)]">
      <div className="flex-1 space-y-8 overflow-hidden px-1 py-2">
        <div className="flex items-start gap-3">
          <div className="h-32 w-32 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800 sm:h-40 sm:w-40" />
          <div className="space-y-3">
            <div className="h-16 w-64 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-14 w-72 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="h-12 w-56 animate-pulse rounded-2xl rounded-br-none bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="flex items-start gap-3">
          <div className="h-32 w-32 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800 sm:h-40 sm:w-40" />
          <div className="h-16 w-72 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <div className="h-14 w-full animate-pulse rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}
