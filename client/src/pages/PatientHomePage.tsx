import { DayProvider } from '../modules/daily-summary/contexts/DayContext'
import PatientHomeContent from '../modules/home/components/PatientHomeContent'

export default function PatientHomePage() {
  return (
    <DayProvider>
      <PatientHomeContent />
    </DayProvider>
  )
}
