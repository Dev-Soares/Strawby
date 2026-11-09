import { useGoogleSignIn } from '../hooks/useGoogleSignIn'
import { isGoogleAuthEnabled } from '../config/google'
import GoogleAuthButton from './GoogleAuthButton'

interface GoogleAuthSectionProps {
  label: string
}

function GoogleAuthSectionContent({ label }: GoogleAuthSectionProps) {
  const { signIn } = useGoogleSignIn()

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">ou</span>
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      </div>

      <GoogleAuthButton label={label} onClick={signIn} />
    </>
  )
}

export default function GoogleAuthSection({ label }: GoogleAuthSectionProps) {
  if (!isGoogleAuthEnabled) return null
  return <GoogleAuthSectionContent label={label} />
}
