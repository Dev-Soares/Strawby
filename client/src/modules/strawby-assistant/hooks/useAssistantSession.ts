import { useContext } from 'react'
import { AssistantSessionContext } from '../contexts/assistant-session-context'

export const useAssistantSession = () => {
  const context = useContext(AssistantSessionContext)

  if (!context) {
    throw new Error(
      'useAssistantSession precisa estar dentro de AssistantSessionProvider',
    )
  }

  return context
}
