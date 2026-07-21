import { api } from '@/api/axios'
import type { OnboardingData } from '../types/onboarding'
import { TERMS_VERSION } from './signUpService'

export const completeOnboardingService = async (data: OnboardingData): Promise<void> => {
  const payload = { ...data, termsVersion: TERMS_VERSION }
  await api.post('/user/onboarding', payload)
}
