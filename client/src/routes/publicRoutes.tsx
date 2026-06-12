import { Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import StandaloneRedirect from '../shared/components/StandaloneRedirect'
import FaqPage from '../pages/FaqPage'
import PrivacyPage from '../pages/PrivacyPage'
import TermsPage from '../pages/TermsPage'
import NotFoundPage from '../pages/NotFoundPage'

export const publicRoutes = [
  <Route key="landing" path="/" element={<StandaloneRedirect><LandingPage /></StandaloneRedirect>} />,
  <Route key="faq" path="/faq" element={<FaqPage />} />,
  <Route key="privacy" path="/privacy" element={<PrivacyPage />} />,
  <Route key="terms" path="/terms" element={<TermsPage />} />,
  <Route key="not-found" path="*" element={<NotFoundPage />} />,
]
