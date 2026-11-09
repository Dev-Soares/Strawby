/**
 * Baixa a imagem fora da árvore, uma vez por `src`.
 *
 * Existe por causa dos WebP animados do mascote: o navegador começa a tocar
 * assim que os primeiros frames chegam, então o `onLoad` da `<img>` na tela
 * chega com a animação já andada. Esperar aqui garante que o arquivo inteiro
 * está em cache antes de ele entrar em cena.
 */
const requests = new Map<string, Promise<void>>()

export const preloadImage = (src: string): Promise<void> => {
  const pending = requests.get(src)
  if (pending) return pending

  const image = new Image()

  const request = new Promise<void>((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true })

    // falha de rede não pode deixar quem espera travado nem o mascote sumido:
    // resolve mesmo assim e solta o cache pra <img> da tela tentar de novo
    image.addEventListener('error', () => {
      requests.delete(src)
      resolve()
    }, { once: true })

    image.src = src
  })

  requests.set(src, request)

  return request
}
