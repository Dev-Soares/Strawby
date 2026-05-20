import { useState, useEffect } from 'react'

export function useIosInstall() {
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    setIsIos(/iphone|ipad|ipod/.test(ua))
  }, [])

  return {
    isIos,
    shouldShowGuide: true,
  }
}
