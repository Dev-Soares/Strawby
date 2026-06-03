import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UNAUTHORIZED_EVENT } from '../../api/axios'

const PUBLIC_PATHS = ['/', '/app/login', '/app/create-account']

const UnauthorizedListener = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = () => {
      if (!PUBLIC_PATHS.includes(location.pathname)) {
        navigate('/app/login', { replace: true })
      }
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handler)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler)
  }, [navigate, location.pathname])

  return null
}

export default UnauthorizedListener
