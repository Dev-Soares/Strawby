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

export default function ProfileAvatar({ name }: Props) {
  return (
    <div data-tutorial="profile-avatar" className="flex flex-col items-center text-center mb-10">
      <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-lg">
        <span className="font-display text-3xl font-extrabold text-white tracking-tight">
          {getInitials(name)}
        </span>
      </div>
      <h1 className="font-display text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight mt-1">
        {name}
      </h1>
    </div>
  )
}
