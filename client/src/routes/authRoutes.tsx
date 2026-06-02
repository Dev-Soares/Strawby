import { Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import VerifyEmailPage from '../pages/VerifyEmailPage'
import CheckEmailPage from '../pages/CheckEmailPage'
import PublicOnlyRoute from '../shared/components/PublicOnlyRoute'

export const authRoutes = [
  <Route key="login" path="/app/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />,
  <Route key="sign-up" path="/app/create-account" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />,
  <Route key="check-email" path="/app/check-email" element={<CheckEmailPage />} />,
  <Route key="verify-email" path="/app/verify-email" element={<VerifyEmailPage />} />,
]
