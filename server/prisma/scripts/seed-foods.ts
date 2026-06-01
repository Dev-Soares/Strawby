/**
 * Seed de alimentos — todas as fontes, com checkpoint para retomar após falha.
 *
 * Uso:
 *   npx tsx prisma/seed-foods.ts           → retoma do checkpoint se existir
 *   npx tsx prisma/seed-foods.ts --fresh   → limpa o banco e começa do zero
 *   npx tsx prisma/seed-foods.ts --dry-run → apenas conta, não insere
 */
import 'dotenv/config'
import pg from 'pg'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { FoodEntry, normalizeForCompare } from './sources/common.js'
import { loadTaco } from './sources/taco.js'
import { loadUsdaFoundation, loadUsdaSrLegacy, loadUsdaSurvey } from './sources/usda.js'
import { loadCnf } from './sources/cnf.js'
import { loadLivsmedelsverket } from './sources/livs.js'
import { loadOpenFoodFacts } from './sources/off.js'
import { loadCiqual } from './sources/ciqual.js'
import { loadCofid } from './sources/cofid.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CHECKPOINT_FILE = join(__dirname, 'seed-checkpoint.json')
const BATCH_SIZE = 500

const FRESH   = process.argv.includes('--fresh')
const DRY_RUN = process.argv.includes('--dry-run')

// ─── DB ──────────────────────────────────────────────────────────────────────

const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL })

async function countFoods(): Promise<number> {
  const { rows } = await pool.query('SELECT COUNT(*) FROM "Food"')
  return parseInt(rows[0].count)
}

async function fetchExistingNames(): Promise<Set<string>> {
  const { rows } = await pool.query('SELECT name FROM "Food"')
  return new Set(rows.map((r: any) => normalizeForCompare(r.name)))
}

async function insertBatch(batch: FoodEntry[]): Promise<number> {
  if (DRY_RUN || batch.length === 0) return batch.length

  const values: any[] = []
  const placeholders: string[] = []

  const now = new Date()
  batch.forEach((f, i) => {
    const base = i * 16
    placeholders.push(
      `($${base+1},$${base+2},$${base+3},$${base+4}::\"FoodSource\",$${base+5},$${base+6},$${base+7},$${base+8},$${base+9},$${base+10},$${base+11},$${base+12},$${base+13},$${base+14},$${base+15},$${base+16})`
    )
    values.push(
      crypto.randomUUID(), f.name, f.nameOriginal, f.source,
      f.sourceId, f.category, f.priority,
      f.calories, f.protein, f.carbs, f.fat,
      f.fiber ?? null, f.sodium ?? null,
      f.sourceId ? `${f.source}:${f.sourceId}` : null,
      now, now,
    )
  })

  const { rowCount } = await pool.query(`
    INSERT INTO "Food" (
      id, name, "nameOriginal", source, "sourceId", category, priority,
      calories, protein, carbs, fat, fiber, sodium, "sourceUrl",
      "createdAt", "updatedAt"
    ) VALUES ${placeholders.join(',')}
    ON CONFLICT DO NOTHING
  `, values)

  return rowCount ?? 0
}

// ─── Checkpoint ──────────────────────────────────────────────────────────────

interface Checkpoint {
  startedAt: string
  completed: Record<string, number>
}

function loadCheckpoint(): Checkpoint | null {
  if (FRESH || !existsSync(CHECKPOINT_FILE)) return null
  try {
    return JSON.parse(readFileSync(CHECKPOINT_FILE, 'utf-8'))
  } catch {
    return null
  }
}

function saveCheckpoint(cp: Checkpoint): void {
  writeFileSync(CHECKPOINT_FILE, JSON.stringify(cp, null, 2))
}

// ─── Inserção por fonte ───────────────────────────────────────────────────────

async function runSource(
  label: string,
  loader: () => Promise<FoodEntry[]> | FoodEntry[],
  existing: Set<string>,
  cp: Checkpoint,
): Promise<number> {
  if (cp.completed[label] !== undefined) {
    console.log(`\n[${label}] ✅ Já concluído (${cp.completed[label]} inseridos) — pulando`)
    return cp.completed[label]
  }

  console.log(`\n${'━'.repeat(50)}`)
  console.log(`📥 ${label}`)
  console.log('━'.repeat(50))

  const start = Date.now()
  let foods: FoodEntry[]
  try {
    foods = await loader()
  } catch (err: any) {
    console.error(`[${label}] ❌ Falha ao carregar: ${err.message}`)
    cp.completed[label] = 0
    saveCheckpoint(cp)
    return 0
  }

  // Dedup: filtra já existentes (cross-source)
  const unique: FoodEntry[] = []
  for (const food of foods) {
    const key = normalizeForCompare(food.name)
    if (!key) continue
    if (existing.has(key)) continue
    existing.add(key)
    unique.push(food)
  }

  const skipped = foods.length - unique.length
  console.log(`[${label}] ${unique.length} únicos (${skipped} duplicados pulados)`)

  let inserted = 0
  const total = unique.length
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE)
    try {
      const count = await insertBatch(batch)
      inserted += count
      const pct  = Math.round(((i + batch.length) / total) * 100)
      const eta  = total > 0 ? Math.round(((Date.now() - start) / (i + batch.length)) * (total - i - batch.length) / 1000) : 0
      process.stdout.write(`\r[${label}] ${pct}% — ${inserted} inseridos ${eta > 0 ? `(~${eta}s restantes)` : ''}   `)
    } catch (err: any) {
      console.error(`\n[${label}] Erro no lote ${Math.floor(i / BATCH_SIZE) + 1}: ${err.message}`)
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n[${label}] ✅ ${inserted} inseridos em ${elapsed}s`)

  cp.completed[label] = inserted
  saveCheckpoint(cp)
  return inserted
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Seed monstruoso de alimentos')
  console.log(DRY_RUN ? '   [DRY RUN — sem inserção]' : `   DB: ${process.env.DIRECT_URL?.split('@')[1]?.split('/')[0] ?? 'desconhecido'}`)

  const cp = loadCheckpoint() ?? { startedAt: new Date().toISOString(), completed: {} }

  if (FRESH && !DRY_RUN) {
    console.log('\n🗑️  --fresh: limpando tabela Food...')
    await pool.query('DELETE FROM "Food"')
    writeFileSync(CHECKPOINT_FILE, JSON.stringify({ startedAt: new Date().toISOString(), completed: {} }, null, 2))
    Object.keys(cp.completed).forEach(k => delete cp.completed[k])
  }

  const beforeCount = await countFoods()
  console.log(`\n📊 Foods no banco antes: ${beforeCount}`)
  if (Object.keys(cp.completed).length > 0) {
    console.log('   Checkpoint encontrado:', JSON.stringify(cp.completed))
  }

  // Carrega nomes existentes para dedup cross-source
  console.log('\n🔍 Carregando nomes existentes para dedup...')
  const existing = await fetchExistingNames()
  console.log(`   ${existing.size} nomes carregados`)

  const totals: Record<string, number> = {}

  // Ordem: menor → maior variabilidade de nome (dedup mais eficiente)
  // ── Fontes de alta qualidade primeiro (melhor dedup cross-source)
  totals.taco       = await runSource('TACO',            loadTaco,             existing, cp)
  totals.foundation = await runSource('USDA Foundation', loadUsdaFoundation,   existing, cp)
  totals.ciqual     = await runSource('Ciqual França',   loadCiqual,           existing, cp)
  totals.cofid      = await runSource('CoFID UK',        loadCofid,            existing, cp)
  totals.cnf        = await runSource('CNF Canada',      loadCnf,              existing, cp)
  totals.srLegacy   = await runSource('USDA SR Legacy',  loadUsdaSrLegacy,     existing, cp)
  totals.survey     = await runSource('USDA Survey',     loadUsdaSurvey,       existing, cp)
  totals.livs       = await runSource('LIVS Suécia',     loadLivsmedelsverket, existing, cp)
  totals.off        = await runSource('OFF Brasil',      loadOpenFoodFacts,    existing, cp)

  const afterCount  = await countFoods()
  const total       = Object.values(totals).reduce((a, b) => a + b, 0)

  console.log('\n' + '━'.repeat(50))
  console.log('✅ SEED CONCLUÍDO')
  console.log('━'.repeat(50))
  console.log(`  TACO            (prio 100): ${totals.taco}`)
  console.log(`  USDA Foundation (prio  80): ${totals.foundation}`)
  console.log(`  Ciqual França   (prio  72): ${totals.ciqual}`)
  console.log(`  CoFID UK        (prio  68): ${totals.cofid}`)
  console.log(`  CNF Canada      (prio  70): ${totals.cnf}`)
  console.log(`  USDA SR Legacy  (prio  60): ${totals.srLegacy}`)
  console.log(`  USDA Survey     (prio  65): ${totals.survey}`)
  console.log(`  LIVS Suécia     (prio  50): ${totals.livs}`)
  console.log(`  OFF Brasil      (prio  40): ${totals.off}`)
  console.log('  ' + '─'.repeat(38))
  console.log(`  INSERIDOS NESTA EXECUÇÃO:  ${total}`)
  console.log(`  TOTAL NO BANCO:            ${afterCount}`)

  if (existsSync(CHECKPOINT_FILE)) {
    const { unlinkSync } = await import('fs')
    unlinkSync(CHECKPOINT_FILE)
    console.log('\n  Checkpoint removido.')
  }
}

main()
  .catch((err) => {
    console.error('\n❌ Erro fatal:', err)
    process.exit(1)
  })
  .finally(() => pool.end())
