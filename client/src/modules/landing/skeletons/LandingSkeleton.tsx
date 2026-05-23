export default function LandingSkeleton() {
  return (
    <div className="animate-pulse min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-28">
        <div className="h-24 w-2/3 bg-neutral-100 rounded-2xl mb-6" />
        <div className="h-4 w-96 bg-neutral-100 rounded-lg mb-4" />
        <div className="h-4 w-72 bg-neutral-100 rounded-lg mb-10" />
        <div className="flex gap-4">
          <div className="h-14 w-40 bg-neutral-100 rounded-xl" />
          <div className="h-14 w-44 bg-neutral-100 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
