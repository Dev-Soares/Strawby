import { Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import FaqPage from '../pages/FaqPage'
import PrivacyPage from '../pages/PrivacyPage'
import TermsPage from '../pages/TermsPage'

export const publicRoutes = [
  <Route key="landing" path="/" element={<LandingPage />} />,
  <Route key="faq" path="/faq" element={<FaqPage />} />,
  <Route key="privacy" path="/privacy" element={<PrivacyPage />} />,
  <Route key="terms" path="/terms" element={<TermsPage />} />,
]
