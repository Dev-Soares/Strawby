import { Client } from 'pg'

const url = 'postgresql://postgres.lifnpwplayvorftlnvil:J54Zxn7l6CD3anMh@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true'

async function main() {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
  await client.connect()

  const terms = process.argv.slice(2)
  for (const term of terms) {
    console.log(`\n--- Searching: ${term} ---`)
    const { rows } = await client.query(
      `SELECT id, name, calories, protein, carbs, fat, source FROM "Food" WHERE unaccent(lower(name)) LIKE unaccent(lower($1)) LIMIT 20`,
      [`%${term}%`],
    )
    console.table(rows)
  }

  await client.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
