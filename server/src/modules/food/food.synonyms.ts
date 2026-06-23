/**
 * Grupos de sinônimos de alimentos (regionalismos e variações comuns pt-BR).
 *
 * Cada grupo lista termos equivalentes. Na busca, se a query corresponde a um
 * termo do grupo (igual ou contém o termo como palavra), os outros termos são
 * adicionados como alternativas (OR), cobrindo casos que nenhuma fonte de dados
 * indexa sozinha — ex: alguém busca "aipim" mas o alimento está cadastrado como
 * "mandioca".
 *
 * Termos devem estar em minúsculo e sem acento — a query é normalizada antes de
 * comparar.
 */
export const FOOD_SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ['mandioca', 'aipim', 'macaxeira'],
  ['tangerina', 'mexerica', 'bergamota', 'mimosa', 'pocan'],
  ['abobora', 'jerimum'],
  ['amendoim', 'mendoim'],
  ['gergelim', 'sesamo'],
  ['refrigerante', 'refri'],
  ['bolacha', 'biscoito'],
  ['sanduiche', 'sanduba'],
  ['pao frances', 'paozinho', 'cacetinho', 'pao de sal'],
  ['mexilhao', 'marisco'],
  ['mocoto', 'mao de vaca'],
  ['inhame', 'cara'],
] as const

/**
 * Expande a query normalizada adicionando frases sinônimas conhecidas.
 * Retorna sempre a query original como primeiro item, seguida das alternativas
 * (sem duplicatas). Casa por palavra inteira para evitar falsos positivos
 * (ex: "cara" não casa dentro de "caramelo").
 */
export function expandQuerySynonyms(normalizedQuery: string): string[] {
  const result = [normalizedQuery]
  const seen = new Set(result)

  for (const group of FOOD_SYNONYM_GROUPS) {
    const matched = group.some((term) => containsAsWord(normalizedQuery, term))
    if (!matched) continue
    for (const term of group) {
      if (!seen.has(term)) {
        seen.add(term)
        result.push(term)
      }
    }
  }
  return result
}

function containsAsWord(haystack: string, term: string): boolean {
  if (haystack === term) return true
  return new RegExp(`(^|\\s)${escapeRegExp(term)}(\\s|$)`).test(haystack)
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
