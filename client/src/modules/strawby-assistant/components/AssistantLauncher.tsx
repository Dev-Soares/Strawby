import { useState } from 'react'
import { Link } from 'react-router-dom'
import AssistantDrawer from './AssistantDrawer'

/**
 * Botão flutuante do assistente.
 * Fica acima da TabBar (`z-50`) e abaixo do drawer (`z-80`), encostado no canto
 * inferior direito. No mobile a folga de baixo tem que livrar a TabBar.
 */
const buttonClass =
  'group fixed right-5 bottom-24 sm:right-6 sm:bottom-6 z-60 flex h-19 w-19 sm:h-20 sm:w-20 items-center justify-center rounded-full transition-transform duration-200 active:scale-95 cursor-pointer'

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

export default function AssistantLauncher() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  return (
    <>
      <Link
        to="/app/assistant"
        className={`${buttonClass} sm:hidden`}
        aria-label="Abrir assistente Strawby"
      >
        <LauncherMascot isHovered={false} />
      </Link>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        {...hoverProps}
        className={`${buttonClass} hidden sm:flex`}
        aria-label="Abrir assistente Strawby"
      >
        <LauncherMascot isHovered={isHovered} />
      </button>

      <div className="hidden sm:block">
        <AssistantDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  )
}
