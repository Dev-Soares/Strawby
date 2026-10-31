import { useState } from 'react'

function checkIsIos(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
}

export function useIosInstall() {
  const [isIos] = useState(() => checkIsIos())

  return {
    isIos,
    shouldShowGuide: true,
  }
}
