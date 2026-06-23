/**
 * Mantém na tabela Food apenas alimentos com nome em pt-BR REAL (fontes
 * brasileiras nativas) e remove as fontes estrangeiras traduzidas
 * automaticamente, cujos nomes vêm quebrados ("parte magra only, aparada to
 * 0\" gordura", "Mjuk kaka pepparkaka", "Poultry presunto") e poluem a busca.
 *
 * MANTIDAS (pt-BR nativo):
 *   - TACO     (NEPA/Unicamp)
 *   - IBGE_POF (Pesquisa de Orçamentos Familiares)
 *   - OFF      (rótulos de produtos brasileiros)
 *
 * REMOVIDAS (tradução automática):
 *   - USDA_FOUNDATION, USDA_SR_LEGACY, CNF, LIVS
 *
 * SEGURANÇA:
 *   - Alimentos referenciados por FoodItem são preservados (não orfanar dados
 *     de refeições/receitas reais), mesmo que sejam de fonte removida.
 *   - Sem --fix é só relatório: conta e mostra, NÃO deleta.
 *
 * Uso:
 *   pnpm --filter server clean:foods         → relatório (dry-run)
 *   pnpm --filter server clean:foods:fix     → executa a remoção
 */
import 'dotenv/config'
import pg from 'pg'

const FIX = process.argv.includes('--fix')

// Fontes em pt-BR nativo que ficam no banco.
const KEEP_SOURCES = ['TACO', 'IBGE_POF', 'OFF']

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})

function keepList(): string {
  return KEEP_SOURCES.map((s) => `'${s}'`).join(', ')
}

// Alvo: tudo que NÃO é fonte pt-BR e NÃO está referenciado por FoodItem.
function buildWhere(): string {
  return `source::text NOT IN (${keepList()})
    AND id NOT IN (SELECT "foodId" FROM "FoodItem" WHERE "foodId" IS NOT NULL)`
}

async function report() {
  const total = await pool.query('SELECT count(*)::int c FROM "Food"')
  console.log(`Total de alimentos: ${total.rows[0].c}\n`)

  const bySource = await pool.query(
    `SELECT source::text src, count(*)::int c FROM "Food" GROUP BY source ORDER BY c DESC`,
  )
  console.log('Distribuição atual:')
  for (const r of bySource.rows) {
    const tag = KEEP_SOURCES.includes(r.src) ? 'MANTÉM' : 'remove'
    console.log(`  ${String(r.c).padStart(6)} | ${tag} | ${r.src}`)
  }

  const where = buildWhere()
  const toDelete = await pool.query(`SELECT count(*)::int c FROM "Food" WHERE ${where}`)
  const referenced = await pool.query(
    `SELECT count(*)::int c FROM "Food" WHERE source::text NOT IN (${keepList()})
       AND id IN (SELECT "foodId" FROM "FoodItem" WHERE "foodId" IS NOT NULL)`,
  )
  const remaining = total.rows[0].c - toDelete.rows[0].c

  console.log(`\nA remover: ${toDelete.rows[0].c}`)
  console.log(`Preservados por estarem em uso (FoodItem): ${referenced.rows[0].c}`)
  console.log(`Restará no banco: ${remaining}`)
}

async function fix() {
  const where = buildWhere()
  const before = await pool.query('SELECT count(*)::int c FROM "Food"')
  const res = await pool.query(`DELETE FROM "Food" WHERE ${where}`)
  const after = await pool.query('SELECT count(*)::int c FROM "Food"')
  console.log(`Removidos: ${res.rowCount}`)
  console.log(`Total: ${before.rows[0].c} -> ${after.rows[0].c}`)

  const bySource = await pool.query(
    `SELECT source::text src, count(*)::int c FROM "Food" GROUP BY source ORDER BY c DESC`,
  )
  console.log('Distribuição final:')
  for (const r of bySource.rows) console.log(`  ${String(r.c).padStart(6)} | ${r.src}`)
}

async function main() {
  if (FIX) {
    console.log('Executando limpeza (--fix)...\n')
    await fix()
  } else {
    console.log('RELATÓRIO (dry-run — nada será deletado). Use --fix para executar.\n')
    await report()
  }
}

main()
  .catch((e) => {
    console.error('Erro ao limpar alimentos:', e)
    process.exit(1)
  })
  .finally(() => pool.end())
