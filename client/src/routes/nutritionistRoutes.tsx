import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import NutritionistPatientPage from '../pages/NutritionistPatientPage'
import NutritionistReportsPage from '../pages/NutritionistReportsPage'
import NutritionistPatientReportPage from '../pages/NutritionistPatientReportPage'

export const nutritionistRoutes = [
  <Route key="nutritionist-patient" path="/app/nutritionist/patient/:patientId" element={<ProtectedRoute><NutritionistPatientPage /></ProtectedRoute>} />,
  <Route key="nutritionist-reports" path="/app/nutritionist/results" element={<ProtectedRoute><NutritionistReportsPage /></ProtectedRoute>} />,
  <Route key="nutritionist-patient-report" path="/app/nutritionist/results/:patientId" element={<ProtectedRoute><NutritionistPatientReportPage /></ProtectedRoute>} />,
]
