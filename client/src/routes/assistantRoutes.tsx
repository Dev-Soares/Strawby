import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const AssistantPage = lazy(() => import('../pages/AssistantPage'))

export const assistantRoutes = [
  <Route key="assistant" path="/app/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />,
]
