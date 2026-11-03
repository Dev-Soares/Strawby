import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MacroChips from './MacroChips'
import SnackSuggestionCard from './SnackSuggestionCard'
import type { SuggestedSnack, MealTotals } from '../types/snackSuggestion'

interface SnackSuggestionsProps {
  remaining: MealTotals | null
  options: SuggestedSnack[]
  onAdd?: (meal: SuggestedSnack) => void
  isAdding?: boolean
}

const SWIPE_THRESHOLD = 60

const slideVariants = {
  enter: (direction: number) => ({ x: direction * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -40, opacity: 0 }),
}

export default function SnackSuggestions({
  remaining,
  options,
  onAdd,
  isAdding,
}: SnackSuggestionsProps) {
  // carrossel: um card por vez — arrastar no celular, setas no desktop
  const [[slide, direction], setSlide] = useState<[number, number]>([0, 0])

  // uma rodada nova de sugestões pode vir com menos opções que a anterior —
  // sem o clamp o índice guardado apontaria para um card inexistente
  const index = Math.min(slide, Math.max(options.length - 1, 0))

  // navegação circular: passar da última volta para a primeira, e vice-versa
  const move = (step: number) => {
    const next = (index + step + options.length) % options.length
    setSlide([next, step])
  }

  const goTo = (next: number) => {
    if (next === index) return
    setSlide([next, next > index ? 1 : -1])
  }

  if (options.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Não consegui sugerir lanches no momento.
        </p>
      </div>
    )
  }

  const option = options[index]

  return (
    <div className="space-y-2">
      {remaining && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-1">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Restam hoje
          </span>
          <MacroChips totals={remaining} />
        </div>
      )}

      <div className="relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) move(1)
              if (info.offset.x > SWIPE_THRESHOLD) move(-1)
            }}
            className="cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <SnackSuggestionCard
              option={option}
              onAdd={onAdd ? () => onAdd(option) : undefined}
              isAdding={isAdding}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {options.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <CarouselArrow direction="prev" onClick={() => move(-1)} />

          <div className="flex items-center gap-1.5">
            {options.map((item, dotIndex) => (
              <button
                key={`${item.name}-${dotIndex}`}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Ver opção ${dotIndex + 1}`}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-200 ${
                  dotIndex === index
                    ? 'w-5 bg-red-600 dark:bg-red-500'
                    : 'w-1.5 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600'
                }`}
              />
            ))}
          </div>

          <CarouselArrow direction="next" onClick={() => move(1)} />
        </div>
      )}
    </div>
  )
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Opção anterior' : 'Próxima opção'}
      className="hidden h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors duration-200 hover:bg-neutral-50 sm:flex dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      <Icon size={16} />
    </button>
  )
}
