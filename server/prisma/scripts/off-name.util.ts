/**
 * Limpa warts comuns de nomes de produtos do Open Food Facts:
 *   - repetição de marca: "X - Danone - Danone - Danone" -> "X - Danone"
 *   - código de barras embutido: "Coca ... 7894900027488" -> "Coca ..."
 *   - cauda de marketing: "Leve Mais Pague Menos", "Lv Pg"
 *
 * Módulo puro (sem efeitos colaterais) — pode ser importado com segurança.
 */
export function cleanOffName(raw: string): string {
  let name = raw.replace(/\s+/g, ' ').trim()

  // Dedup de segmentos separados por " - " (mantém 1ª ocorrência, case-insensitive)
  const segs = name.split(/\s+-\s+/)
  const seen = new Set<string>()
  const dedup: string[] = []
  for (const s of segs) {
    const key = s.toLowerCase()
    if (key && !seen.has(key)) {
      seen.add(key)
      dedup.push(s)
    }
  }
  name = dedup.join(' - ')

  name = name
    .replace(/\b\d{8,}\b/g, '') // códigos de barras
    .replace(/\bleve\s+mais\s+pague\s+menos\b/gi, '')
    .replace(/\bleve\s+\d+\s+pague\s+\d+\b/gi, '')
    .replace(/\blv\s+pg\b/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*$/, '') // separador solto no fim
    .replace(/^\s*-\s*/, '')
    .trim()

  return name
}
