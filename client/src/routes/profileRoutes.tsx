import { Route } from 'react-router-dom'
import ProfilePage from '../pages/ProfilePage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const profileRoutes = [
  <Route key="profile" path="/app/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />,
]
