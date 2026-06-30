import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))

export const profileRoutes = [
  <Route key="profile" path="/app/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />,
  <Route key="settings" path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />,
]
