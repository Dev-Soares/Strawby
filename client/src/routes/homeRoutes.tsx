import { Route } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const homeRoutes = [
  <Route key="home" path="/app/home" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />,
]
