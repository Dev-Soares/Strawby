import { Client } from 'pg'

const url = 'postgresql://postgres.lifnpwplayvorftlnvil:J54Zxn7l6CD3anMh@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true'

const names = [
  'Torrada integral',
  'Grão de bico cozido',
  'Café infusão 5%',
  'Chá preto infusão 5%',
  'Leite em pó desnatado',
  'Leite de vaca desnatado',
  'Iogurte natural desnatado',
  'Iogurte grego natural',
  'Requeijão light',
  'Gelatina',
  'Achocolatado em pó',
  'Canela em pó',
  'Bolo de banana',
  'Macarrão caseiro cozido',
  'Peixe filé congelado assado',
  'Atum em conserva',
  'Sopa de legumes',
  'Legumes cozidos',
  'Legumes refogados',
  'Brócolis cozido',
  'Abóbora cabotian cozida',
  'Tomate cru',
  'Tomate cereja cru',
  'Alface americana crua',
  'Molho de tomate',
  'Molho de salada light',
  'Creme de leite light',
]

async function main() {
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
  await client.connect()

  for (const name of names) {
    const { rows } = await client.query(
      `SELECT id, name, calories, protein, carbs, fat, source FROM "Food" WHERE unaccent(lower(name)) = unaccent(lower($1)) LIMIT 1`,
      [name],
    )
    console.log(`${name}: ${rows.length > 0 ? rows[0].id : 'NOT FOUND'}`)
  }

  await client.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
