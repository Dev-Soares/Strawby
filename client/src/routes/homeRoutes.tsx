import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const MainPage = lazy(() => import('../pages/MainPage'))

export const homeRoutes = [
  <Route key="home" path="/app/home" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />,
]
