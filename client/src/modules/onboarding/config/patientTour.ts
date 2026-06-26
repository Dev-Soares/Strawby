import type { NavigateFunction } from 'react-router-dom'
import type { StepOptions } from 'shepherd.js'
type TourProxy = { next: () => void; back: () => void; complete: () => void }

const TOTAL = 9

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
    text: 'Vamos fazer um tour rápido — menos de 2 minutos. A navegação fica nas abas no topo (Início, Pontuação, Plano e Perfil) e no menu ☰ no canto, onde estão Alimentos e Ajustes.',
    buttons: firstButton(tour),
  },
  {
    id: 'meal-list',
    attachTo: { element: '[data-tutorial="meal-list"]', on: 'bottom-start' },
    title: `${progress(2)}Suas refeições`,
    text: 'A aba Início é seu dia a dia. Registre cada refeição aqui — café da manhã, almoço, lanche e jantar. Toque em uma refeição para ver os detalhes ou editar os alimentos.',
    buttons: navButtons(tour),
  },
  {
    id: 'daily-summary',
    attachTo: { element: '[data-tutorial="daily-summary"]', on: 'bottom-start' },
    title: `${progress(3)}Resumo do dia`,
    text: 'Ao lado, suas calorias e macros em tempo real. As barras progridem conforme você registra as refeições ao longo do dia.',
    buttons: navButtons(tour),
  },
  {
    id: 'score',
    beforeShowPromise: goTo(navigate, '/app/score'),
    attachTo: { element: '[data-tutorial="score-dashboard"]', on: 'top-start' },
    title: `${progress(4)}Pontuação`,
    text: 'Na aba Pontuação fica seu score diário de 0 a 100, que mede o quanto você seguiu suas metas. Acompanhe sua evolução e consistência ao longo do tempo.',
    buttons: navButtons(tour),
  },
  {
    id: 'plan',
    beforeShowPromise: goTo(navigate, '/app/plan'),
    attachTo: { element: '[data-tutorial="plan-cta"]', on: 'top' },
    title: `${progress(5)}Plano alimentar`,
    text: 'Na aba Plano você define suas metas diárias de calorias e macros. Crie um plano manualmente, gere um a partir dos seus dados corporais ou aguarde seu nutricionista.',
    buttons: navButtons(tour),
  },
  {
    id: 'foods',
    beforeShowPromise: goTo(navigate, '/app/foods'),
    attachTo: { element: '[data-tutorial="foods-tabs"]', on: 'bottom-start' },
    title: `${progress(6)}Alimentos`,
    text: 'Abra o menu ☰ e toque em Alimentos. Aqui você busca na base pública, cria seus próprios alimentos e monta receitas reutilizáveis — tudo nessas abas.',
    buttons: navButtons(tour),
  },
  {
    id: 'profile',
    beforeShowPromise: goTo(navigate, '/app/profile'),
    attachTo: { element: '[data-tutorial="profile-header"]', on: 'bottom-start' },
    title: `${progress(7)}Seu perfil`,
    text: 'Na aba Perfil mantenha seus dados corporais atualizados para cálculos mais precisos, acompanhe seu histórico de peso e veja o nutricionista vinculado.',
    buttons: navButtons(tour),
  },
  {
    id: 'settings',
    beforeShowPromise: goTo(navigate, '/app/settings'),
    attachTo: { element: '[data-tutorial="settings-header"]', on: 'bottom-start' },
    title: `${progress(8)}Ajustes`,
    text: 'No menu ☰, em Ajustes, você gerencia sua conta, ativa notificações, troca o tema claro/escuro e sai do app.',
    buttons: navButtons(tour),
  },
  {
    id: 'done',
    beforeShowPromise: goTo(navigate, '/app/home'),
    title: `${progress(9)}Tudo pronto!`,
    text: 'Você já conhece o Strawby. Comece registrando sua primeira refeição e acompanhe sua evolução dia a dia.',
    buttons: lastButtons(tour),
  },
]
