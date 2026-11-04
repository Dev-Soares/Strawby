import { Fragment } from 'react'
import { Menu } from 'lucide-react'

/**
 * Ícones que podem aparecer no meio de uma fala, escritos como `{menu}` no
 * texto do passo. Falar "lá no menu" sem mostrar o botão obriga o usuário a
 * adivinhar qual dos cantos é o menu.
 */
const ICONS = {
  menu: (
    <Menu
      size={17}
      strokeWidth={3}
      className="inline-block shrink-0 translate-y-[-1px] text-neutral-900 dark:text-neutral-100"
    />
  ),
}

const TOKEN = /\{(menu)\}/g

export default function TourPromptText({ text }: { text: string }) {
  const parts = text.split(TOKEN)

  return (
    <>
      {parts.map((part, index) =>
        // o split intercala texto e nome do ícone: os ímpares são os tokens
        index % 2 === 1 ? (
          <Fragment key={index}>{ICONS[part as keyof typeof ICONS]}</Fragment>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}
