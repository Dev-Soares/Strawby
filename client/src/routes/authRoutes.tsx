import { lazy } from 'react'
import { Route } from 'react-router-dom'
import PublicOnlyRoute from '../shared/components/PublicOnlyRoute'
import OnboardingRoute from '../shared/components/OnboardingRoute'

const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignUpPage = lazy(() => import('../pages/SignUpPage'))
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'))
const VerifyEmailPage = lazy(() => import('../pages/VerifyEmailPage'))
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'))
const GoogleCallbackPage = lazy(() => import('../pages/GoogleCallbackPage'))

export const authRoutes = [
  <Route key="login" path="/app/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />,
  <Route key="sign-up" path="/app/create-account" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />,
  <Route key="verify-email" path="/app/verify-email" element={<VerifyEmailPage />} />,
  <Route key="reset-password" path="/app/reset-password" element={<ResetPasswordPage />} />,
  <Route key="google-callback" path="/app/google-callback" element={<GoogleCallbackPage />} />,
  <Route key="onboarding" path="/app/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />,
]
