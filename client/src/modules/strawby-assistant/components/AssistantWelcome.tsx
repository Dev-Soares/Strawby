import { useAuth } from '@/modules/auth/hooks/useAuth'
import AssistantResponse from './AssistantResponse'

export default function AssistantWelcome() {
  const { data: user } = useAuth()
  const username = user?.name?.split(' ')[0] ?? 'Strawber'

  return (
    <AssistantResponse
      content={
        <>
          <span className="font-bold text-red-600 dark:text-red-400">
            Oi, {username}!
          </span>{' '}
          Sou o assistente Strawby, como posso te ajudar hoje?
        </>
      }
      contentKey="welcome"
    />
  )
}
