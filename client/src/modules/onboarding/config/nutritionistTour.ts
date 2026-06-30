import type { NavigateFunction } from 'react-router-dom'
import type { StepOptions } from 'shepherd.js'
type TourProxy = { next: () => void; back: () => void; complete: () => void }

const TOTAL = 7

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

export const createNutritionistSteps = (
  tour: TourProxy,
  navigate: NavigateFunction,
): StepOptions[] => [
  {
    id: 'welcome',
    title: `${progress(1)}Bem-vindo ao Strawby`,
    text: 'Sua área profissional para acompanhar e orientar pacientes. A navegação fica nas abas do topo (Pacientes, Resultados e Perfil) e no menu ☰, onde estão Perfil e Ajustes. Vamos ver tudo em menos de 2 minutos.',
    buttons: firstButton(tour),
  },
  {
    id: 'patient-tabs',
    attachTo: { element: '[data-tutorial="patient-tabs"]', on: 'bottom-start' },
    title: `${progress(2)}Pacientes e solicitações`,
    text: 'A aba Pacientes é sua tela inicial. Aqui você alterna entre os pacientes ativos e as solicitações pendentes — novos pacientes enviam pedidos de conexão que você aceita ou rejeita.',
    buttons: navButtons(tour),
  },
  {
    id: 'patient-list',
    attachTo: { element: '[data-tutorial="patient-list"]', on: 'bottom-start' },
    title: `${progress(3)}Lista de pacientes`,
    text: 'Todos os seus pacientes vinculados aparecem aqui. Clique em qualquer um para ver o histórico alimentar completo, criar planos e acompanhar a adesão.',
    buttons: navButtons(tour),
  },
  {
    id: 'reports',
    beforeShowPromise: goTo(navigate, '/app/nutritionist/results'),
    attachTo: { element: '[data-tutorial="reports-header"]', on: 'bottom-start' },
    title: `${progress(4)}Resultados`,
    text: 'Na aba Resultados você acompanha a adesão de cada paciente ao plano alimentar. O score mostra o quão bem cada um segue as metas definidas.',
    buttons: navButtons(tour),
  },
  {
    id: 'profile',
    beforeShowPromise: goTo(navigate, '/app/profile'),
    attachTo: { element: '[data-tutorial="profile-header"]', on: 'bottom-start' },
    title: `${progress(5)}Seu perfil`,
    text: 'Na aba Perfil fica o seu código de convite — compartilhe com novos pacientes para que eles se vinculem a você.',
    buttons: navButtons(tour),
  },
  {
    id: 'settings',
    beforeShowPromise: goTo(navigate, '/app/settings'),
    attachTo: { element: '[data-tutorial="settings-header"]', on: 'bottom-start' },
    title: `${progress(6)}Ajustes`,
    text: 'No menu ☰, em Ajustes, você gerencia sua conta, ativa notificações, troca o tema claro/escuro e sai do app.',
    buttons: navButtons(tour),
  },
  {
    id: 'done',
    beforeShowPromise: goTo(navigate, '/app/home'),
    title: `${progress(7)}Tudo pronto!`,
    text: 'Você já conhece o painel de nutricionista. Quando um paciente enviar uma solicitação de conexão, você será notificado aqui.',
    buttons: lastButtons(tour),
  },
]
