import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import NutritionistPatientPage from '../pages/NutritionistPatientPage'

export const nutritionistRoutes = [
  <Route key="nutritionist-patient" path="/app/nutritionist/patient/:patientId" element={<ProtectedRoute><NutritionistPatientPage /></ProtectedRoute>} />,
]
