function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface Props {
  name: string
  email?: string
  role?: string
}

export default function ProfileAvatar({ name, role }: Props) {
  return (
    <div data-tutorial="profile-avatar" className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-red-500 to-rose-700 flex items-center justify-center shrink-0 shadow-md shadow-red-200/50 dark:shadow-red-950/30">
        <span className="font-display text-xl font-extrabold text-white tracking-tight">
          {getInitials(name)}
        </span>
      </div>

      <div>
        <h1 className="font-display text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
          {name}
        </h1>
        {role && (
          <span className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
              {role === 'patient' ? 'Paciente' : 'Nutricionista'}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
