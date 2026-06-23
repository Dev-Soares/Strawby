import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGoogleCallback } from '@/modules/auth/hooks/useGoogleCallback'
import Spinner from '@/shared/components/Spinner'

export default function GoogleCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { mutate } = useGoogleCallback()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const code = params.get('code')
    if (!code) {
      navigate('/app/login', { replace: true })
      return
    }

    mutate(code)
  }, [params, mutate, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
      <Spinner size={32} className="border-neutral-300 border-t-red-600" />
    </div>
  )
}
