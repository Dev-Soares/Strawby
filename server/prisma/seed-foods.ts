import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/client.js'
import { FoodEntry, normalizeForCompare } from './sources/common.js'
import { loadTaco } from './sources/taco.js'
import { loadUsdaFoundation, loadUsdaSrLegacy } from './sources/usda.js'
import { loadCnf } from './sources/cnf.js'
import { loadLivsmedelsverket } from './sources/livs.js'
import { loadOpenFoodFacts } from './sources/off.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const BATCH_SIZE = 500

// Lê nomes já no banco para dedup incremental
async function fetchExistingNames(): Promise<Set<string>> {
  const foods = await db.food.findMany({ select: { name: true } })
  return new Set(foods.map((f) => normalizeForCompare(f.name)))
}

async function insertSource(label: string, foods: FoodEntry[], existing: Set<string>): Promise<number> {
  if (foods.length === 0) {
    console.log(`[${label}] Nada para inserir`)
    return 0
  }

  // Dedup interno + contra banco
  const unique: FoodEntry[] = []
  for (const food of foods) {
    const key = normalizeForCompare(food.name)
    if (!key) continue
    if (existing.has(key)) continue
    existing.add(key)
    unique.push(food)
  }

  console.log(`[${label}] ${unique.length} únicos (${foods.length - unique.length} duplicados pulados)`)

  let inserted = 0
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE)
    try {
      const result = await db.food.createMany({ data: batch, skipDuplicates: true })
      inserted += result.count
      console.log(`[${label}] Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(unique.length / BATCH_SIZE)}: ${result.count} inseridos`)
    } catch (err: any) {
      console.error(`[${label}] Erro inserindo lote ${Math.floor(i / BATCH_SIZE) + 1}:`, err.message)
    }
  }
  return inserted
}

// Executor de fonte com try/catch isolado — falha de uma não derruba outras
async function runSource(
  label: string,
  loader: () => Promise<FoodEntry[]> | FoodEntry[],
  existing: Set<string>,
): Promise<number> {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📥 ${label}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  const start = Date.now()
  try {
    const foods = await loader()
    const inserted = await insertSource(label, foods, existing)
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.log(`[${label}] ✅ ${inserted} inseridos em ${elapsed}s`)
    return inserted
  } catch (err: any) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.error(`[${label}] ❌ Falhou após ${elapsed}s: ${err.message}`)
    return 0
  }
}

async function main() {
  console.log('🌱 Seed sequencial de alimentos (checkpoint por fonte)\n')

  console.log('🗑️  Limpando tabela Food...')
  await db.food.deleteMany()

  const existing = await fetchExistingNames()
  console.log(`[INIT] ${existing.size} nomes já no banco (deve ser 0 após delete)\n`)

  const totals = {
    taco: 0,
    foundation: 0,
    cnf: 0,
    srLegacy: 0,
    off: 0,
    livs: 0,
  }

  // Ordem: TACO primeiro (BR), depois fontes whole-foods de qualidade, OFF e LIVS por último
  totals.taco = await runSource('TACO', loadTaco, existing)
  totals.foundation = await runSource('USDA Foundation', loadUsdaFoundation, existing)
  totals.cnf = await runSource('CNF Canada', loadCnf, existing)
  totals.srLegacy = await runSource('USDA SR Legacy', loadUsdaSrLegacy, existing)
  totals.off = await runSource('OFF Brasil', loadOpenFoodFacts, existing)
  totals.livs = await runSource('LIVS Suécia', () => loadLivsmedelsverket(2500), existing)

  const total = Object.values(totals).reduce((a, b) => a + b, 0)

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ SEED CONCLUÍDO')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  TACO (priority 100):           ${totals.taco}`)
  console.log(`  USDA Foundation (priority 80): ${totals.foundation}`)
  console.log(`  CNF Canada (priority 70):      ${totals.cnf}`)
  console.log(`  USDA SR Legacy (priority 60):  ${totals.srLegacy}`)
  console.log(`  OFF Brasil (priority 40):      ${totals.off}`)
  console.log(`  LIVS Suécia (priority 50):     ${totals.livs}`)
  console.log(`  TOTAL:                         ${total}`)
}

main()
  .catch((err) => {
    console.error('❌ Erro fatal no seed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
    await pool.end()
  })
