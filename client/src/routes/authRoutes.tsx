import { Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import PublicOnlyRoute from '../shared/components/PublicOnlyRoute'

export const authRoutes = [
  <Route key="login" path="/app/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />,
  <Route key="sign-up" path="/app/create-account" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />,
]
