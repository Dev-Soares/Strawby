import { useMutation } from '@tanstack/react-query'
import { suggestSubstitutionService } from '../service/suggestSubstitutionService'
import type { SuggestSubstitutionData, SuggestSubstitutionResponse } from '../types/substitution'

export const useSuggestSubstitution = () => {
  return useMutation<SuggestSubstitutionResponse, Error, SuggestSubstitutionData>({
    mutationFn: suggestSubstitutionService,
  })
}
