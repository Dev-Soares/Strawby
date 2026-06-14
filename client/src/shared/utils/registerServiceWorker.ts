export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  const checkForUpdate = () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.update().catch(() => {}))
    })
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate()
  })

  window.addEventListener('focus', checkForUpdate)

  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })
}
