import type { NavigateFunction } from 'react-router-dom'
import type Shepherd from 'shepherd.js'

type StepOptions = Shepherd.Step.StepOptions
type TourProxy = { next: () => void; back: () => void; complete: () => void }

const TOTAL = 8

const progress = (n: number) =>
  `<span class="shepherd-step-progress">${n} de ${TOTAL}</span>`

const goTo = (navigate: NavigateFunction, route: string, delay = 550) => () => {
  navigate(route)
  return new Promise<void>((resolve) => setTimeout(resolve, delay))
}

const navButtons = (tour: TourProxy) => [
  { text: 'Anterior', classes: 'shepherd-btn-prev', action: () => tour.back() },
  { text: 'Próximo', classes: 'shepherd-btn-next', action: () => tour.next() },
]

const firstButton = (tour: TourProxy) => [
  { text: 'Vamos lá', classes: 'shepherd-btn-next', action: () => tour.next() },
]

const lastButtons = (tour: TourProxy) => [
  { text: 'Anterior', classes: 'shepherd-btn-prev', action: () => tour.back() },
  { text: 'Começar a usar', classes: 'shepherd-btn-next', action: () => tour.complete() },
]

export const createPatientSteps = (
  tour: TourProxy,
  navigate: NavigateFunction,
): StepOptions[] => [
  {
    id: 'welcome',
    title: `${progress(1)}Bem-vindo ao Strawby`,
    text: 'Vamos fazer um tour completo pelo app — vai levar menos de 2 minutos. Você vai ver todas as funcionalidades principais.',
    buttons: firstButton(tour),
  },
  {
    id: 'daily-summary',
    attachTo: { element: '[data-tutorial="daily-summary"]', on: 'bottom-start' },
    title: `${progress(2)}Resumo do dia`,
    text: 'Aqui estão suas calorias e macros em tempo real. As barras progridem conforme você registra as refeições ao longo do dia.',
    buttons: navButtons(tour),
  },
  {
    id: 'meal-list',
    attachTo: { element: '[data-tutorial="meal-list"]', on: 'bottom-start' },
    title: `${progress(3)}Suas refeições`,
    text: 'Registre cada refeição aqui — café da manhã, almoço, lanche e jantar. Toque em uma refeição para ver os detalhes nutricionais ou editar os alimentos.',
    buttons: navButtons(tour),
  },
  {
    id: 'score',
    beforeShowPromise: goTo(navigate, '/app/score'),
    attachTo: { element: '[data-tutorial="score-dashboard"]', on: 'top-start' },
    title: `${progress(4)}Pontuação nutricional`,
    text: 'Seu score diário de 0 a 100 mede o quanto você seguiu suas metas. Aqui você acompanha a evolução ao longo do tempo e vê sua consistência.',
    buttons: navButtons(tour),
  },
  {
    id: 'foods',
    beforeShowPromise: goTo(navigate, '/app/foods'),
    attachTo: { element: '[data-tutorial="foods-tabs"]', on: 'bottom-start' },
    title: `${progress(5)}Alimentos`,
    text: 'Busque qualquer alimento na base pública para adicionar às refeições. Você também pode criar alimentos personalizados e montar receitas reutilizáveis.',
    buttons: navButtons(tour),
  },
  {
    id: 'plan',
    beforeShowPromise: goTo(navigate, '/app/plan'),
    attachTo: { element: '[data-tutorial="plan-cta"]', on: 'top' },
    title: `${progress(6)}Plano alimentar`,
    text: 'Configure suas metas diárias de calorias e macros. Você pode criar um plano manualmente, gerar um baseado nos seus dados corporais ou aguardar seu nutricionista.',
    buttons: navButtons(tour),
  },
  {
    id: 'profile',
    beforeShowPromise: goTo(navigate, '/app/profile'),
    attachTo: { element: '[data-tutorial="profile-avatar"]', on: 'bottom' },
    title: `${progress(7)}Seu perfil`,
    text: 'Mantenha seus dados corporais atualizados para cálculos mais precisos. Aqui você também gerencia o nutricionista vinculado e as configurações da conta.',
    buttons: navButtons(tour),
  },
  {
    id: 'done',
    beforeShowPromise: goTo(navigate, '/app/home'),
    title: `${progress(8)}Tudo pronto!`,
    text: 'Você já conhece o Strawby. Comece registrando sua primeira refeição e acompanhe sua evolução dia a dia.',
    buttons: lastButtons(tour),
  },
]
