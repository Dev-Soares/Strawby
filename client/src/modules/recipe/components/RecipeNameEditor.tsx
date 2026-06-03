import { CookingPot, PencilSimple, Check } from '@phosphor-icons/react'

type Props = {
  name: string
  isEditing: boolean
  editName: string
  isPending: boolean
  onChange: (value: string) => void
  onStart: () => void
  onSave: () => void
  onCancel: () => void
}

export default function RecipeNameEditor({
  name, isEditing, editName, isPending, onChange, onStart, onSave, onCancel,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-50 dark:bg-rose-950/40 transition-colors duration-300">
        <CookingPot size={22} weight="bold" className="text-rose-600" />
      </div>
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editName}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave()
              if (e.key === 'Escape') onCancel()
            }}
            autoFocus
            disabled={isPending}
            className="flex-1 text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-100 bg-transparent outline-none border-b-2 border-rose-400 pb-1 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isPending ? (
              <span className="inline-block w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
            ) : (
              <Check size={16} weight="bold" className="text-rose-600" />
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight leading-none truncate">
            {name}
          </h1>
          <button
            type="button"
            onClick={onStart}
            className="w-8 h-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0"
          >
            <PencilSimple size={14} weight="bold" className="text-neutral-400 dark:text-neutral-500" />
          </button>
        </div>
      )}
    </div>
  )
}
