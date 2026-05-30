import { Route } from 'react-router-dom'
import PlanPage from '../pages/PlanPage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const planRoutes = [
  <Route key="plan" path="/app/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />,
]
