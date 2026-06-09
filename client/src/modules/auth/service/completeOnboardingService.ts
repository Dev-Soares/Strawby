import { api } from '@/api/axios'
import type { OnboardingData } from '../types/onboarding'

export const completeOnboardingService = async (data: OnboardingData): Promise<void> => {
  await api.post('/user/onboarding', data)
}
