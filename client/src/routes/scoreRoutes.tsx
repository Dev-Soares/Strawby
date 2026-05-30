import { Route } from 'react-router-dom'
import ScorePage from '../pages/ScorePage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const scoreRoutes = [
  <Route key="score" path="/app/score" element={<ProtectedRoute><ScorePage /></ProtectedRoute>} />,
]
