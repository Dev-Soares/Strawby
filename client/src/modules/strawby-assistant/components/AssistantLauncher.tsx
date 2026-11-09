import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useAssistantSession } from '../hooks/useAssistantSession'
import AssistantDrawer from './AssistantDrawer'

/**
 * Botão flutuante do assistente.
 * Fica acima da TabBar (`z-50`) e abaixo do drawer (`z-80`), encostado no canto
 * inferior direito. No mobile a folga de baixo tem que livrar a TabBar.
 */
const buttonClass =
  'group fixed right-5 bottom-24 sm:right-6 sm:bottom-6 z-60 flex h-19 w-19 sm:h-20 sm:w-20 items-center justify-center rounded-full transition-[transform,opacity] duration-200 active:scale-95 cursor-pointer'

/**
 * Parado é o frame 0 da animação; no hover entra a animação inteira.
 *
 * Os dois arquivos já vêm recortados no mesmo enquadramento (gerados juntos),
 * então aqui é só preencher o botão — sem conta de escala no CSS, que era o
 * que fazia as camadas saírem de registro.
 */
const MASCOT_FRAME = 'pointer-events-none absolute inset-0 h-full w-full select-none'

const WAVE_SRC = '/mascot/happy-framed.webp'
const STILL_SRC = '/mascot/happy-framed-still.webp'

function LauncherMascot({ isHovered }: { isHovered: boolean }) {
  const src = isHovered ? WAVE_SRC : STILL_SRC

  return (
    <>
      <span className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-xl shadow-neutral-900/25 ring-2 ring-white transition-transform duration-300 group-hover:scale-105 dark:shadow-black/60 dark:ring-neutral-900">
        <img src={src} alt="" aria-hidden draggable={false} className={MASCOT_FRAME} />
      </span>

      {/* cópia sem recorte, cortada na altura do peito: é o que deixa o braço
          sair da moldura sem as pernas aparecerem embaixo */}
      {isHovered && (
        <img
          src={WAVE_SRC}
          alt=""
          aria-hidden
          draggable={false}
          className={`${MASCOT_FRAME} [clip-path:inset(0_0_50%_0)]`}
        />
      )}

      <span className="pointer-events-none absolute top-1/2 right-full mr-4 hidden -translate-y-1/2 translate-x-3 rounded-2xl rounded-br-sm bg-red-600 px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-white opacity-0 shadow-lg shadow-red-600/30 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Oi! Como posso te ajudar?
      </span>
    </>
  )
}

interface AssistantLauncherProps {
  /** Esconde junto com header/TabBar quando o BlobMenu esta aberto. */
  hidden?: boolean
}

export default function AssistantLauncher({ hidden = false }: AssistantLauncherProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { pathname } = useLocation()
  const { data: user } = useAuth()
  // o drawer vive no contexto: a página do Plano também precisa abri-lo
  const { isDrawerOpen, openDrawer, closeDrawer } = useAssistantSession()

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  // O assistente e do paciente, e na propria tela do chat o botao so atrapalha
  // (no mobile ele cobre o input).
  if (user?.role === 'nutritionist') return null
  if (pathname === '/app/assistant') return null

  const visibility = hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'

  return (
    <>
      <Link
        to="/app/assistant"
        className={`${buttonClass} ${visibility} sm:hidden`}
        aria-label="Abrir assistente Strawby"
      >
        <LauncherMascot isHovered={false} />
      </Link>

      <button
        type="button"
        onClick={openDrawer}
        {...hoverProps}
        className={`${buttonClass} ${visibility} hidden sm:flex`}
        aria-label="Abrir assistente Strawby"
      >
        <LauncherMascot isHovered={isHovered} />
      </button>

      <div className="hidden sm:block">
        <AssistantDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      </div>
    </>
  )
}
