/**
 * Aplica cleanOffName() aos nomes de produtos OFF já no banco — remove
 * repetição de marca, código de barras embutido e cauda de marketing.
 *
 * Atualiza só as linhas cujo nome muda. Sem --fix é relatório (dry-run).
 *
 * Uso:
 *   pnpm --filter server normalize:off        → relatório
 *   pnpm --filter server normalize:off:fix    → aplica
 */
import 'dotenv/config'
import pg from 'pg'
import { cleanOffName } from './off-name.util'

const FIX = process.argv.includes('--fix')

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})

async function main() {
  const { rows } = await pool.query<{ id: string; name: string }>(
    `SELECT id, name FROM "Food" WHERE source = 'OFF'`,
  )

  const changes: { id: string; from: string; to: string }[] = []
  for (const r of rows) {
    const cleaned = cleanOffName(r.name)
    if (cleaned && cleaned !== r.name) changes.push({ id: r.id, from: r.name, to: cleaned })
  }

  console.log(`OFF analisados: ${rows.length}`)
  console.log(`Nomes a normalizar: ${changes.length}\n`)
  console.log('Amostra:')
  for (const c of changes.slice(0, 12)) console.log(`  "${c.from}"\n  -> "${c.to}"\n`)

  if (!FIX) {
    console.log('DRY-RUN — use --fix para aplicar.')
    return
  }

  const now = new Date()
  for (const c of changes) {
    await pool.query(`UPDATE "Food" SET name = $1, "updatedAt" = $2 WHERE id = $3`, [
      c.to,
      now,
      c.id,
    ])
  }
  console.log(`\nAtualizados: ${changes.length}`)
}

main()
  .catch((e) => {
    console.error('Erro ao normalizar nomes OFF:', e)
    process.exit(1)
  })
  .finally(() => pool.end())
