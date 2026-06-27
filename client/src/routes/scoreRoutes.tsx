import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const ScorePage = lazy(() => import('../pages/ScorePage'))

export const scoreRoutes = [
  <Route key="score" path="/app/score" element={<ProtectedRoute><ScorePage /></ProtectedRoute>} />,
]
