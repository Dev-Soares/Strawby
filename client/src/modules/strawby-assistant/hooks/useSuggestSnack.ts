import { useMutation } from '@tanstack/react-query'
import { suggestSnackService } from '../service/suggestSnackService'
import type { SuggestSnackData, SuggestSnackResponse } from '../types/snackSuggestion'

export const useSuggestSnack = () => {
  return useMutation<SuggestSnackResponse, Error, SuggestSnackData>({
    mutationFn: suggestSnackService,
  })
}
