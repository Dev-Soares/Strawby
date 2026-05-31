import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import NutritionistPatientPage from '../pages/NutritionistPatientPage'
import NutritionistReportsPage from '../pages/NutritionistReportsPage'

export const nutritionistRoutes = [
  <Route key="nutritionist-patient" path="/app/nutritionist/patient/:patientId" element={<ProtectedRoute><NutritionistPatientPage /></ProtectedRoute>} />,
  <Route key="nutritionist-reports" path="/app/nutritionist/reports" element={<ProtectedRoute><NutritionistReportsPage /></ProtectedRoute>} />,
]
