import PatientCardSkeleton from './PatientCardSkeleton'

const PatientListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <PatientCardSkeleton key={i} />
    ))}
  </div>
)

export default PatientListSkeleton
