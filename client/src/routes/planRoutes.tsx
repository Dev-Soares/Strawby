import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const PlanPage = lazy(() => import('../pages/PlanPage'))

export const planRoutes = [
  <Route key="plan" path="/app/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />,
]
