import { useEffect, useRef } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { preloadMascotActions } from '@/shared/config/mascotActions'
import { useAssistantActions } from '../hooks/useAssistantActions'
import { useAssistantThread, WELCOME_MESSAGE_ID } from '../hooks/useAssistantThread'
import type { AddSuggestedMealData } from '../types/snackSuggestion'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import MascotMessage from './MascotMessage'
import MealPreviewCard from './MealPreviewCard'
import PlanGenerationInput from './PlanGenerationInput'
import PlanPreviewCard from './PlanPreviewCard'
import SnackInput from './SnackInput'
import SuggestedMealCards from './SuggestedMealCards'
import SnackSuggestions from './SnackSuggestions'
import AssistantIntentPills from './AssistantIntentPills'

export default function ChatContainer() {
  const {
    step,
    selectMeal,
    selectSnack,
    selectPlan,
    messages,
    isPending,
    submitMeal,
    submitSnack,
    submitPlan,
    addSuggestedMeal,
    confirmDraft,
    discardDraft,
    confirmPlanDraft,
    discardPlanDraft,
    isConfirmingDraft,
    isConfirmingPlan,
    startNewConversation,
    snackResult,
  } = useAssistantActions()

  const { data: user } = useAuth()
  const username = user?.name?.split(' ')[0] ?? 'Strawber'

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isPending, snackResult])

  // Baixa todas as reações na abertura do chat. O `StrawbyMascot` segura a
  // troca até o arquivo estar inteiro na mão, então qualquer ação que não
  // estiver em cache na hora vira espera na frente do usuário — o erro
  // "fora do ar", por exemplo, volta rápido demais pra baixar o `upset` entre
  // o envio e a resposta.
  useEffect(() => {
    preloadMascotActions(['thinking', 'upset', 'celebrate'])
  }, [])

  const lastAssistantMessage = [...messages].reverse().find((message) => message.role === 'assistant')
  const suggestedMeals = lastAssistantMessage?.suggestedMeals
  const hasSuggestedMeals = Boolean(suggestedMeals && suggestedMeals.length > 0)

  const { history, live } = useAssistantThread({ messages, isPending, hasSuggestedMeals })

  // o rascunho só fica de pé enquanto é a última fala — confirmar ou descartar
  // empilha uma mensagem nova e some com o card
  const lastMessage = messages.at(-1)
  const pendingDraft = lastMessage?.status === 'preview' ? lastMessage.draft : undefined
  const pendingPlanDraft =
    lastMessage?.status === 'plan_preview' ? lastMessage.planDraft : undefined

  const welcomeContent = (
    <>
      <span className="font-bold text-red-600 dark:text-red-400">Oi, {username}!</span> Sou o
      assistente Strawby, como posso te ajudar hoje?
    </>
  )

  const result = (() => {
    if (step === 'snack' && snackResult) {
      return (
        <SnackSuggestions
          remaining={snackResult.remaining}
          options={snackResult.options}
          onAdd={(meal) =>
            addSuggestedMeal({
              mealType: meal.mealType as AddSuggestedMealData['mealType'],
              mealName: meal.name,
            })
          }
          isAdding={isPending}
        />
      )
    }

    if (hasSuggestedMeals) return <SuggestedMealCards meals={suggestedMeals ?? []} />

    return null
  })()

  return (
    <div className="relative flex h-full flex-col justify-between gap-3 sm:gap-4">
      {step !== 'choose' && (
        <button
          type="button"
          onClick={startNewConversation}
          className="absolute top-0 right-0 z-10 flex cursor-pointer items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-red-700"
        >
          <Plus size={16} />
          Nova conversa
        </button>
      )}

      <div className="scrollbar-hide flex-1 overflow-y-auto px-1 py-2">
        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {history.map((item) =>
            item.id === WELCOME_MESSAGE_ID ? (
              <ChatMessage key={item.id} role="assistant">
                {welcomeContent}
              </ChatMessage>
            ) : (
              <ChatMessage key={item.id} role={item.role} content={item.content} />
            ),
          )}

          <MascotMessage action={live.action} playback={live.playback} isTyping={live.isTyping}>
            {live.kind === 'welcome' ? welcomeContent : live.content}
          </MascotMessage>

          {pendingDraft && (
            <MealPreviewCard
              draft={pendingDraft}
              onConfirm={(edited) => void confirmDraft(edited)}
              onDiscard={discardDraft}
              isConfirming={isConfirmingDraft}
            />
          )}

          {pendingPlanDraft && (
            <PlanPreviewCard
              draft={pendingPlanDraft}
              onConfirm={(draft) => void confirmPlanDraft(draft)}
              onDiscard={discardPlanDraft}
              isConfirming={isConfirmingPlan}
            />
          )}

          {result}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-3">
        {step === 'choose' ? (
          <AssistantIntentPills
            onSelectMeal={selectMeal}
            onSelectSnack={selectSnack}
            onSelectPlan={selectPlan}
          />
        ) : (
          <>
            {step === 'meal' && (
              <ChatInput onSubmit={submitMeal} isPending={isPending || Boolean(pendingDraft)} />
            )}
            {step === 'snack' && <SnackInput onSubmit={submitSnack} isPending={isPending} />}
            {step === 'plan' && (
              <PlanGenerationInput
                onSubmit={(data) => void submitPlan(data)}
                isPending={isPending || Boolean(pendingPlanDraft)}
              />
            )}
          </>
        )}

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          A IA pode cometer erros. Sempre revise as sugestões antes de adicionar.
        </p>
      </div>
    </div>
  )
}
