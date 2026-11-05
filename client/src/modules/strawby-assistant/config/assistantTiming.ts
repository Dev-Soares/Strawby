/**
 * As sugestões saem de um catálogo local e voltam quase instantâneas — sem uma
 * pausa o balão de "pensando" pisca e a resposta não parece vir de uma IA.
 * A faixa é aleatória de propósito: tempo fixo soa robótico.
 */
const THINKING_MIN_MS = 1400
const THINKING_MAX_MS = 2400

/**
 * Confirmações salvam em poucos milissegundos: sem um piso o "pensando" pisca
 * e some antes de ser lido. A pausa é bem menor que a de uma resposta — aqui o
 * usuário já decidiu e só espera o aceite.
 */
const ACTION_MIN_MS = 650
const ACTION_MAX_MS = 950

const randomDelay = (min: number, max: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, min + Math.random() * (max - min))
  })

export const thinkingDelay = (): Promise<void> => randomDelay(THINKING_MIN_MS, THINKING_MAX_MS)

export const actionDelay = (): Promise<void> => randomDelay(ACTION_MIN_MS, ACTION_MAX_MS)
