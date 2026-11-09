const DEVICE_ID_KEY = 'strawby_device_id'

/**
 * Identificador estável do aparelho, usado como chave do token FCM no backend.
 *
 * O FCM rotaciona o token e cada rotação criava um registro novo — o mesmo
 * aparelho recebia a push duplicada. Com o deviceId o backend substitui o
 * registro em vez de somar um.
 */
export function getDeviceId(): string {
  const stored = localStorage.getItem(DEVICE_ID_KEY)
  if (stored) return stored

  const deviceId = crypto.randomUUID()
  localStorage.setItem(DEVICE_ID_KEY, deviceId)
  return deviceId
}
