/**
 * As sugestões saem de um catálogo local e voltam quase instantâneas — sem uma
 * pausa o balão de "pensando" pisca e a resposta não parece vir de uma IA.
 * A faixa é aleatória de propósito: tempo fixo soa robótico.
 */
const THINKING_MIN_MS = 1400
const THINKING_MAX_MS = 2400

export const thinkingDelay = (): Promise<void> =>
  new Promise((resolve) => {
    const duration = THINKING_MIN_MS + Math.random() * (THINKING_MAX_MS - THINKING_MIN_MS)
    setTimeout(resolve, duration)
  })
