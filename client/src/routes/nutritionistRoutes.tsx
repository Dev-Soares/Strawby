import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const NutritionistPatientPage = lazy(() => import('../pages/NutritionistPatientPage'))
const NutritionistReportsPage = lazy(() => import('../pages/NutritionistReportsPage'))
const NutritionistPatientReportPage = lazy(() => import('../pages/NutritionistPatientReportPage'))

export const nutritionistRoutes = [
  <Route key="nutritionist-patient" path="/app/nutritionist/patient/:patientId" element={<ProtectedRoute><NutritionistPatientPage /></ProtectedRoute>} />,
  <Route key="nutritionist-reports" path="/app/nutritionist/results" element={<ProtectedRoute><NutritionistReportsPage /></ProtectedRoute>} />,
  <Route key="nutritionist-patient-report" path="/app/nutritionist/results/:patientId" element={<ProtectedRoute><NutritionistPatientReportPage /></ProtectedRoute>} />,
]
