import { Route } from 'react-router-dom'
import FoodsPage from '../pages/FoodsPage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const foodRoutes = [
  <Route key="foods" path="/app/foods" element={<ProtectedRoute><FoodsPage /></ProtectedRoute>} />,
]
