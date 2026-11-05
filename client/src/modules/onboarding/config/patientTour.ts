import type { TourStep } from '../types/tourStep'

/**
 * Tutorial do paciente.
 *
 * Cada aba entra em dois tempos: o mascote encosta no botão que leva até ela e
 * depois dá um closeup no que importa dentro da tela. Telas sem aba própria
 * (Alimentos, Ajustes) apontam para o menu, que é por onde se chega nelas.
 */
export const PATIENT_TOUR: TourStep[] = [
  {
    id: 'welcome',
    route: '/app/home',
    prompt: 'Oi de novo! Posso te mostrar como o Strawby pode te ajudar? Leva apenas dois minutos.',
    action: 'happy',
    cta: 'Vamos lá',
  },
  {
    id: 'home',
    route: '/app/home',
    target: 'nav-home',
    prompt: 'Bora começar por aqui! O Início é a sua tela do dia.',
    action: 'idle',
  },
  {
    id: 'home-meals',
    route: '/app/home',
    target: 'home-meals',
    prompt: 'Nesta lista entram suas refeições! É só adicionar o que você comeu.',
    action: 'idle',
  },
  {
    id: 'home-summary',
    route: '/app/home',
    target: 'home-summary',
    prompt: 'E olha só: aqui eu vou somando os nutrientes do dia enquanto você registra!',
    action: 'thinking',
  },
  {
    id: 'score',
    route: '/app/score',
    target: 'nav-score',
    prompt: 'Agora a parte divertida: a Pontuação mostra sua consistência dia a dia!',
    action: 'idle',
  },
  {
    id: 'score-today',
    route: '/app/score',
    target: 'score-today',
    prompt: 'Esta é a nota de hoje, de 0 a 10! Ela diz o quanto você seguiu suas metas.',
    action: 'thinking',
  },
  {
    id: 'score-streak',
    route: '/app/score',
    target: 'score-streak',
    prompt: 'E esta é a sua sequência! Cada dia registrado faz ela crescer mais um pouco.',
    action: 'idle',
  },
  {
    id: 'plan',
    route: '/app/plan',
    target: 'nav-plan',
    prompt: 'No Plano ficam suas metas diárias de calorias e macros!',
    action: 'idle',
  },
  {
    id: 'plan-generate',
    route: '/app/plan',
    target: 'plan-generate',
    prompt: 'Aperte aqui que eu calculo tudo pelos seus dados! Seu nutricionista também pode montar pra você.',
    action: 'thinking',
  },
  {
    id: 'foods-tabs',
    route: '/app/foods',
    target: 'foods-tabs',
    prompt:
      'Esta é a tela de Alimentos, lá no menu {menu}! Busque na base pública, crie os seus e monte receitas.',
    action: 'thinking',
  },
  {
    id: 'profile',
    route: '/app/profile',
    target: 'nav-profile',
    prompt: 'No Perfil ficam seus dados e toda a sua evolução!',
    action: 'idle',
  },
  {
    id: 'profile-weight',
    route: '/app/profile',
    target: 'profile-weight',
    prompt: 'Registre seu peso de vez em quando! Essa curva aqui mostra se o plano tá funcionando.',
    action: 'thinking',
  },
  {
    id: 'profile-body',
    route: '/app/profile',
    target: 'profile-body',
    prompt: 'E são estes dados que eu uso nas contas, então mantenha tudo em dia!',
    action: 'idle',
  },
  {
    id: 'settings',
    route: '/app/settings',
    target: 'settings-prefs',
    prompt: 'E nos Ajustes, também pelo menu {menu}, você liga as notificações e troca o tema!',
    action: 'idle',
  },
  {
    id: 'done',
    route: '/app/home',
    prompt: 'É isso! Precisou de mim, é só me chamar neste botão aqui do canto. Tô sempre por perto!',
    action: 'happy',
    cta: 'Começar a usar',
    assistantHandoff: true,
  },
]
