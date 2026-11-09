import { useMemo } from 'react'
import type { AssistantMessage, AssistantMessageRole } from '../types/chat'
import type { MascotAction, MascotPlayback } from '@/shared/types/mascotAction'

/** A saudação não vem da API — ela abre toda conversa. */
export const WELCOME_MESSAGE_ID = 'welcome'

export type ThreadItem = {
  id: string
  role: AssistantMessageRole
  content: string
}

/** Última fala da thread — é a única que carrega o mascote. */
type LiveTurn = {
  action: MascotAction
  playback: MascotPlayback
  isTyping: boolean
  /** `welcome` é montado no componente porque depende do nome do usuário. */
  kind: 'welcome' | 'typing' | 'text'
  content?: string
}

const TYPING_TURN: LiveTurn = {
  action: 'thinking',
  playback: 'loop',
  isTyping: true,
  kind: 'typing',
}

/** Como o mascote reage à última fala do assistente. */
const reaction = ({
  isWelcome,
  isPrompt,
  hasFailed,
  hasCreatedMeal,
  hasSuggestedMeals,
}: {
  isWelcome: boolean
  isPrompt: boolean
  hasFailed: boolean
  hasCreatedMeal: boolean
  hasSuggestedMeals: boolean
}): Pick<LiveTurn, 'action' | 'playback'> => {
  // acena uma vez e volta pro idle — repetir deixa ele dando oi sem parar
  if (isWelcome) return { action: 'happy', playback: 'settle' }
  // perguntou algo (ou montou um rascunho) e espera o usuário responder
  if (isPrompt) return { action: 'idle', playback: 'loop' }
  // a decepção não volta pro idle — fica parada no último frame
  if (hasFailed) return { action: 'upset', playback: 'once' }
  // refeição entrou no diário: comemora sem parar
  if (hasCreatedMeal || hasSuggestedMeals) return { action: 'celebrate', playback: 'loop' }
  // `happy` é o aceno — fora da saudação viraria "oi" no meio da conversa
  return { action: 'idle', playback: 'loop' }
}

interface UseAssistantThreadParams {
  messages: AssistantMessage[]
  isPending: boolean
  hasSuggestedMeals: boolean
}

/**
 * Divide a conversa em histórico + fala viva.
 *
 * O mascote acompanha só a fala viva, no fim da thread. Quando chega mensagem
 * nova, a fala anterior desce pro histórico e vira um balão comum — nada é
 * reescrito no caminho.
 */
export const useAssistantThread = ({
  messages,
  isPending,
  hasSuggestedMeals,
}: UseAssistantThreadParams) => {
  return useMemo(() => {
    const items: ThreadItem[] = [
      { id: WELCOME_MESSAGE_ID, role: 'assistant', content: '' },
      ...messages.map(({ id, role, content }) => ({ id, role, content })),
    ]

    if (isPending) return { history: items, live: TYPING_TURN }

    const lastItem = items.at(-1)

    // enquanto a resposta não chega, o mascote fica pensando no fim da thread
    if (lastItem?.role !== 'assistant') return { history: items, live: TYPING_TURN }

    const isWelcome = lastItem.id === WELCOME_MESSAGE_ID
    const status = messages.at(-1)?.status
    const hasFailed =
      status === 'not_found' ||
      status === 'not_understood' ||
      status === 'unavailable' ||
      status === 'quota_exceeded'

    const live: LiveTurn = {
      ...reaction({
        isWelcome,
        isPrompt: status === 'prompt' || status === 'preview' || status === 'plan_preview',
        hasFailed,
        hasCreatedMeal: status === 'created',
        hasSuggestedMeals,
      }),
      isTyping: false,
      kind: isWelcome ? 'welcome' : 'text',
      content: lastItem.content,
    }

    return { history: items.slice(0, -1), live }
  }, [messages, isPending, hasSuggestedMeals])
}
