import type { TourStep } from '../types/tourStep'

/** Tutorial do nutricionista — mesma condução: aba, depois o closeup dentro dela. */
export const NUTRITIONIST_TOUR: TourStep[] = [
  {
    id: 'welcome',
    route: '/app/home',
    prompt: 'Oi de novo! Vou te mostrar sua área profissional! Leva apenas dois minutos.',
    action: 'happy',
    cta: 'Vamos lá',
  },
  {
    id: 'patients',
    route: '/app/home',
    target: 'nav-patients',
    prompt:
      'Esta é a sua tela inicial! Aqui ficam seus pacientes ativos e as solicitações esperando resposta.',
    action: 'idle',
  },
  {
    id: 'reports',
    route: '/app/nutritionist/results',
    target: 'nav-reports',
    prompt: 'Em Resultados eu te mostro o quanto cada paciente está seguindo o plano que você montou!',
    action: 'thinking',
  },
  {
    id: 'profile',
    route: '/app/profile',
    target: 'nav-profile',
    prompt: 'No seu perfil fica toda a sua identidade profissional!',
    action: 'idle',
  },
  {
    id: 'profile-invite',
    route: '/app/profile',
    target: 'profile-invite',
    prompt: 'E este é o código de convite! Compartilhe pra novos pacientes se vincularem a você.',
    action: 'thinking',
  },
  {
    id: 'settings',
    route: '/app/settings',
    target: 'settings-prefs',
    prompt: 'E nos Ajustes, que ficam no menu {menu}, você liga as notificações e troca o tema!',
    action: 'idle',
  },
  {
    id: 'done',
    route: '/app/home',
    prompt: 'Tudo pronto! Quando um paciente pedir conexão, pode deixar que eu te aviso por aqui!',
    action: 'celebrate',
    cta: 'Começar a usar',
  },
]
