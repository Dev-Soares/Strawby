/**
 * Auditoria em massa da tabela Food: procura nomes que NÃO são pt-BR nativo
 * (resíduo em inglês/sueco, lixo, nutrição implausível). Apenas relatório.
 *
 * Uso: pnpm --filter server tsx prisma/scripts/audit-foods.ts
 */
import 'dotenv/config'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})

// Palavras que em pt-BR praticamente não aparecem em nome de alimento —
// sinalizam rótulo importado/tradução. Word-boundary, case-insensitive.
const EN_TOKENS = [
  'with', 'and', 'the', 'for', 'from', 'made', 'your', 'our', 'free',
  'low', 'high', 'fat', 'sugar', 'salt', 'flavour', 'flavored', 'flavor',
  'roasted', 'grilled', 'baked', 'fried', 'smoked', 'sliced', 'creamy',
  'crunchy', 'cheese', 'chicken', 'beef', 'pork', 'milk', 'water', 'white',
  'brown', 'wheat', 'whole', 'gluten', 'protein bar', 'snack', 'drink',
  'juice', 'powder', 'cooked', 'raw', 'fresh', 'frozen', 'canned',
]

const SWEDISH_RE = `[åäöøæ]|\\m(och|med|kokt|stekt|sås|grön|röd|kaka|fil)\\M`

async function q(sql: string, ...params: unknown[]): Promise<number> {
  const { rows } = await pool.query(`SELECT count(*)::int c FROM "Food" WHERE ${sql}`, params)
  return rows[0].c
}

async function sample(sql: string, n = 12): Promise<{ name: string; src: string }[]> {
  const { rows } = await pool.query(
    `SELECT name, source::text src FROM "Food" WHERE ${sql} ORDER BY random() LIMIT ${n}`,
  )
  return rows
}

async function main() {
  const total = await pool.query('SELECT count(*)::int c FROM "Food"')
  console.log(`TOTAL: ${total.rows[0].c}\n`)

  const bySource = await pool.query(
    `SELECT source::text src, count(*)::int c FROM "Food" GROUP BY source ORDER BY c DESC`,
  )
  console.log('Por fonte:')
  for (const r of bySource.rows) console.log(`  ${String(r.c).padStart(6)} | ${r.src}`)

  // 1. Token em inglês (boundary). Conta nomes com >=1 e com >=2 tokens (mais suspeito).
  const enClauses = EN_TOKENS.map((t) => `name ~* '\\m${t.replace(/ /g, '\\s')}\\M'`)
  const enAny = `(${enClauses.join(' OR ')})`
  console.log(`\n[1] Nomes com >=1 palavra inglesa: ${await q(enAny)}`)

  console.log('Por fonte (>=1 token EN):')
  const enBySrc = await pool.query(
    `SELECT source::text src, count(*)::int c FROM "Food" WHERE ${enAny} GROUP BY source ORDER BY c DESC`,
  )
  for (const r of enBySrc.rows) console.log(`  ${String(r.c).padStart(6)} | ${r.src}`)
  console.log('Amostra:')
  for (const r of await sample(enAny)) console.log(`  [${r.src}] ${r.name}`)

  // 2. Resíduo em sueco/escandinavo
  const sw = `name ~* '${SWEDISH_RE}'`
  console.log(`\n[2] Resíduo sueco/escandinavo: ${await q(sw)}`)
  for (const r of await sample(sw, 8)) console.log(`  [${r.src}] ${r.name}`)

  // 3. Nutrição implausível (macros somam muito ou kcal absurda)
  const implausible = `(protein + carbs + fat > 105) OR calories > 950 OR calories < 0`
  console.log(`\n[3] Nutrição implausível: ${await q(implausible)}`)
  for (const r of await sample(implausible, 8)) console.log(`  [${r.src}] ${r.name}`)

  // 4. Tudo zero (sem dado aproveitável)
  console.log(
    `\n[4] Sem dado nutricional (tudo zero): ${await q('calories=0 AND protein=0 AND carbs=0 AND fat=0')}`,
  )

  // 5. Nome suspeito: caractere estranho, só caixa-alta longa, muitos dígitos
  const weird = `(name ~ '[%@#*|<>{}\\[\\]\\\\]' OR (name = upper(name) AND length(name) > 30) OR name ~ '\\d{8,}')`
  console.log(`\n[5] Nome com símbolo estranho / CAPS longo / barcode: ${await q(weird)}`)
  for (const r of await sample(weird, 8)) console.log(`  [${r.src}] ${r.name}`)

  // 6. Nome muito curto (1-2 chars) ou muito longo (>80)
  console.log(`\n[6] Nome curtíssimo (<3): ${await q('length(name) < 3')}`)
  console.log(`    Nome longuíssimo (>80): ${await q('length(name) > 80')}`)
  for (const r of await sample('length(name) > 80', 6)) console.log(`  [${r.src}] ${r.name}`)
}

main()
  .catch((e) => {
    console.error('Erro na auditoria:', e)
    process.exit(1)
  })
  .finally(() => pool.end())
