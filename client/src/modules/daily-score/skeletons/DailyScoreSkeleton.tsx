import DailyScoreCardSkeleton from './DailyScoreCardSkeleton'
import PatientStreakSkeleton from '../../patient/skeletons/PatientStreakSkeleton'

const DailyScoreSkeleton = () => (
  <div>
    <div className="animate-pulse h-11 w-40 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 mb-6 sm:mb-8 transition-colors duration-300" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      <DailyScoreCardSkeleton />
      <PatientStreakSkeleton />
    </div>
  </div>
)

export default DailyScoreSkeleton
