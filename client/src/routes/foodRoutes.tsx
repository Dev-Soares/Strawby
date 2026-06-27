import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const FoodsPage = lazy(() => import('../pages/FoodsPage'))

export const foodRoutes = [
  <Route key="foods" path="/app/foods" element={<ProtectedRoute><FoodsPage /></ProtectedRoute>} />,
]
