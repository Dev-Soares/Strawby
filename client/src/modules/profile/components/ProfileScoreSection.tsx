import { Fire, Trophy } from '@phosphor-icons/react'
import { useGetPatientStreak } from '@/modules/patient/hooks/useGetPatientStreak'

function getStreakLabel(currentStreak: number) {
  if (currentStreak === 0) return 'Nenhum dia consecutivo'
  if (currentStreak === 1) return 'Primeiro dia!'
  return 'Dias consecutivos'
}

export default function ProfileScoreSection() {
  const { data: streak, isPending } = useGetPatientStreak()

  return (
    <section className="mb-5 px-1">
      <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 transition-colors duration-300">
        Sequência
      </p>

      {isPending ? (
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-200 dark:bg-neutral-800 shrink-0 transition-colors duration-300" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-20 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
            <div className="h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center shrink-0 shadow-md shadow-red-200 dark:shadow-red-950/40 transition-colors duration-300">
              <Fire size={22} weight="fill" className="text-white" />
            </div>

            <div>
              <div className="flex items-baseline gap-1.5 leading-none mb-1">
                <span className="font-display text-3xl font-extrabold text-red-500 dark:text-red-400 transition-colors duration-300">
                  {streak?.currentStreak ?? 0}
                </span>
                <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 transition-colors duration-300">
                  dias
                </span>
              </div>
              <p className="text-xs font-semibold text-red-400 dark:text-red-500 transition-colors duration-300">
                {getStreakLabel(streak?.currentStreak ?? 0)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 transition-colors duration-300">
            <Trophy size={20} weight="duotone" className="text-yellow-500 shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-yellow-500/70 leading-none mb-1 transition-colors duration-300">
                Melhor streak
              </p>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="font-display text-xl font-extrabold text-yellow-500 transition-colors duration-300">
                  {streak?.bestStreak ?? 0}
                </span>
                <span className="text-xs font-bold text-yellow-500/70 transition-colors duration-300">
                  dias
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
