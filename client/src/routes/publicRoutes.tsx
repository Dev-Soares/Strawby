import { lazy } from 'react'
import { Route } from 'react-router-dom'
import StandaloneRedirect from '../shared/components/StandaloneRedirect'

const LandingPage = lazy(() => import('../pages/LandingPage'))
const FaqPage = lazy(() => import('../pages/FaqPage'))
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'))
const TermsPage = lazy(() => import('../pages/TermsPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export const publicRoutes = [
  <Route key="landing" path="/" element={<StandaloneRedirect><LandingPage /></StandaloneRedirect>} />,
  <Route key="faq" path="/faq" element={<FaqPage />} />,
  <Route key="privacy" path="/privacy" element={<PrivacyPage />} />,
  <Route key="terms" path="/terms" element={<TermsPage />} />,
  <Route key="not-found" path="*" element={<NotFoundPage />} />,
]
