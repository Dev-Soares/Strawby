import { Client } from 'pg'

const url = 'postgresql://postgres.lifnpwplayvorftlnvil:J54Zxn7l6CD3anMh@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true'

async function main() {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
  await client.connect()

  const tables = await client.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'Food'
    ORDER BY ordinal_position
  `)
  console.log('Food columns:')
  console.table(tables.rows)

  const count = await client.query('SELECT COUNT(*) FROM "Food"')
  console.log('Total foods:', count.rows[0].count)

  const sample = await client.query('SELECT id, name, calories, protein, carbs, fat, source FROM "Food" ORDER BY priority DESC LIMIT 20')
  console.log('Sample foods:')
  console.table(sample.rows)

  await client.end()
}

main().catch(err => { console.error(err); process.exit(1) })
