export function rankByRelevance<T extends { name: string; priority?: number }>(
  items: T[],
  query: string,
): T[] {
  const normalized = query.trim().toLowerCase();

  return [...items].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aStarts = aName.startsWith(normalized);
    const bStarts = bName.startsWith(normalized);

    // 1. Match exato no início ganha
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    // 2. Priority maior ganha (TACO=100 > Foundation=80 > CNF=70 > SR=60 > LIVS=50 > OFF=40)
    const aPrio = a.priority ?? 0;
    const bPrio = b.priority ?? 0;
    if (aPrio !== bPrio) return bPrio - aPrio;

    // 3. Alfabético PT-BR
    return aName.localeCompare(bName, 'pt-BR');
  });
}

export function splitSearchWords(query: string): string[] {
  return query.trim().split(/\s+/).filter(Boolean);
}
