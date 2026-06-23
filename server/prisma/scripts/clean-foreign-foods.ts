/**
 * Remove produtos com rótulo em ESPANHOL (chilenos/peruanos/argentinos
 * mis-taggeados como Brasil no OFF: "Aceite de Oliva", "Leche Descremada",
 * "Alfajor Sin Azúcar", "Ají de Gallina con arroz"...). Não são comuns no
 * Brasil e nunca casam numa busca pt-BR ("azeite"/"leite"/"queijo"), só poluem.
 *
 * NÃO mexe em nomes com inglês — lá há muito produto BR real com marca em
 * inglês (Perdigão "Mini Chicken", "Carne Seca Jerked Beef").
 *
 * SEGURANÇA: preserva alimentos referenciados por FoodItem. Sem --fix é só
 * relatório.
 *
 * Uso:
 *   pnpm --filter server clean:foreign        → relatório (dry-run)
 *   pnpm --filter server clean:foreign:fix    → executa
 */
import 'dotenv/config'
import pg from 'pg'

const FIX = process.argv.includes('--fix')

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})

// Tokens de alta confiança que produto pt-BR NUNCA usa (equivalente pt entre []).
// Comparados sobre unaccent(name) para pegar acento (azúcar, jugo...).
const ES_TOKENS = [
  'con', // [com]
  'sin', // [sem]
  'leche', // [leite]
  'queso', // [queijo]
  'pollo', // [frango]
  'gallina', // [galinha]
  'cerdo', // [porco]
  'aceite', // [azeite/óleo]
  'almendras', // [amêndoas]
  'durazno', // [pêssego]
  'frutilla', // [morango]
  'palta', // [abacate]
  'jugo', // [suco]
  'galletas', // [biscoitos]
  'descremada', // [desnatada]
  'azucar anadida', // [açúcar adicionado]
  'dulce de leche', // [doce de leite]
]

function whereClause(): string {
  const toks = ES_TOKENS.map((t) => `unaccent(name) ~* '\\m${t.replace(/ /g, '\\s')}\\M'`)
  return `(${toks.join(' OR ')})
    AND id NOT IN (SELECT "foodId" FROM "FoodItem" WHERE "foodId" IS NOT NULL)`
}

async function report() {
  const where = whereClause()
  const total = await pool.query('SELECT count(*)::int c FROM "Food"')
  const hit = await pool.query(`SELECT count(*)::int c FROM "Food" WHERE ${where}`)
  console.log(`Total: ${total.rows[0].c}`)
  console.log(`A remover (espanhol): ${hit.rows[0].c}`)
  console.log(`Restará: ${total.rows[0].c - hit.rows[0].c}\n`)

  console.log('Amostra do que SERIA removido:')
  for (const r of (await pool.query(
    `SELECT name FROM "Food" WHERE ${where} ORDER BY random() LIMIT 25`,
  )).rows) console.log(`  ${r.name}`)
}

async function fix() {
  const where = whereClause()
  const before = await pool.query('SELECT count(*)::int c FROM "Food"')
  const res = await pool.query(`DELETE FROM "Food" WHERE ${where}`)
  const after = await pool.query('SELECT count(*)::int c FROM "Food"')
  console.log(`Removidos: ${res.rowCount}`)
  console.log(`Total: ${before.rows[0].c} -> ${after.rows[0].c}`)
}

async function main() {
  if (FIX) {
    console.log('Executando remoção (--fix)...\n')
    await fix()
  } else {
    console.log('RELATÓRIO (dry-run — nada deletado). Use --fix para executar.\n')
    await report()
  }
}

main()
  .catch((e) => {
    console.error('Erro ao remover estrangeiros:', e)
    process.exit(1)
  })
  .finally(() => pool.end())
