/**
 * Normaliza um texto para comparação de busca: minúsculo, sem acentos,
 * pontuação convertida em espaço (TACO usa "Iogurte, natural" — a vírgula
 * quebraria a detecção de palavra-inteira no ranking).
 */
export function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitSearchWords(query: string): string[] {
  return query.trim().split(/\s+/).filter(Boolean);
}

/**
 * Reordena resultados já filtrados pelo banco. A hierarquia espelha o ORDER BY
 * de FoodService.search() — se divergir, esta função desfaz a ordenação do SQL:
 *
 *   1. Priority maior ganha (TACO=100 > IBGE_POF=95 > OFF=90)
 *   2. Match exato (nome normalizado === query) ganha
 *   3. Nome que começa com a query ganha
 *   4. Cobertura: nome que contém mais palavras da query ganha
 *   5. Nome mais curto ganha (mais específico, menos "ruído")
 *   6. Alfabético pt-BR
 *
 * Priority vem antes do match exato de propósito: fonte curada (TACO) tem macro
 * confiável, enquanto um rótulo genérico de OFF ("Feijão", sem variedade) casa
 * exato mas entrega dado pior.
 */
export function rankByRelevance<T extends { name: string; priority?: number }>(
  items: T[],
  query: string,
): T[] {
  const q = normalizeForSearch(query);
  const queryWords = q.split(/\s+/).filter(Boolean);

  return [...items].sort((a, b) => {
    const aName = normalizeForSearch(a.name);
    const bName = normalizeForSearch(b.name);

    const aPrio = a.priority ?? 0;
    const bPrio = b.priority ?? 0;
    if (aPrio !== bPrio) return bPrio - aPrio;

    const aExact = aName === q;
    const bExact = bName === q;
    if (aExact !== bExact) return aExact ? -1 : 1;

    const aStarts = aName.startsWith(q);
    const bStarts = bName.startsWith(q);
    if (aStarts !== bStarts) return aStarts ? -1 : 1;

    const aCover = wordCoverage(aName, queryWords);
    const bCover = wordCoverage(bName, queryWords);
    if (aCover !== bCover) return bCover - aCover;

    if (aName.length !== bName.length) return aName.length - bName.length;

    return aName.localeCompare(bName, 'pt-BR');
  });
}

/**
 * Conta quantas palavras da query aparecem como palavra inteira no nome.
 */
function wordCoverage(name: string, queryWords: string[]): number {
  let count = 0;
  for (const w of queryWords) {
    if (new RegExp(`(^|\\s)${escapeRegExp(w)}(\\s|$)`).test(name)) count++;
  }
  return count;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
