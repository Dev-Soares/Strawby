/**
 * Importa a Tabela de Composição Nutricional dos Alimentos Consumidos no Brasil
 * (IBGE, POF 2008-2009) — dado público do governo, 100% pt-BR nativo.
 *
 * Fonte: ftp.ibge.gov.br/Orcamentos_Familiares/.../tabelacompleta.zip
 * Arquivo versionado em: prisma/data/ibge-pof-2008-2009.xls
 *
 * Cada alimento tem N preparações (cru, cozido, grelhado...). O nome final é
 * "Alimento, preparação" (ex: "Milho em grão, cozido"). Dedup cross-source pelo
 * nome normalizado — não insere se já existe alimento equivalente no banco.
 *
 * Uso:
 *   pnpm --filter server import:ibge            → insere (pula duplicados)
 *   pnpm --filter server import:ibge --dry-run  → apenas conta, não insere
 */
import 'dotenv/config'
import { join } from 'path'
import { randomUUID } from 'crypto'
import XLSX from 'xlsx'
import pg from 'pg'

// Scripts rodam a partir da raiz do server (via pnpm --filter server).
const XLS_PATH = join(process.cwd(), 'prisma', 'data', 'ibge-pof-2008-2009.xls')

const SOURCE = 'IBGE_POF'
const PRIORITY = 95 // BR-nativo oficial; logo abaixo de TACO (100)
const BATCH_SIZE = 500
const DRY_RUN = process.argv.includes('--dry-run')

// Índices de coluna na planilha "Tabela de Composição"
const COL = {
  foodCode: 0,
  foodName: 1,
  prepName: 3,
  calories: 6,
  protein: 7,
  fat: 8,
  carbs: 9,
  fiber: 10,
  sodium: 16,
} as const

const NO_PREP = 'NAO SE APLICA'

interface FoodEntry {
  name: string
  nameOriginal: string
  sourceId: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number | null
  sodium: number | null
}

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
})

// "-" e células vazias viram null; números válidos passam, negativos viram null
function num(val: unknown): number | null {
  if (val === null || val === undefined || val === '-' || val === '') return null
  const n = typeof val === 'number' ? val : parseFloat(String(val).replace(',', '.'))
  if (isNaN(n) || n < 0) return null
  return n
}

// "MILHO (EM GRAO)" -> "Milho (em Grao)"  /  título PT-BR sem gritar em CAPS.
// Usa split por espaço (NÃO \b — \b do JS é ASCII-only e quebra em acentos,
// transformando "FILÉ" em "FilÉ"). Acentos ausentes na origem (ex: "GRAO") não
// têm como ser recuperados, mas a busca usa unaccent, então não atrapalha.
const SMALL_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o', 'com', 'ao', 'à'])

function capitalizeFirstLetter(word: string): string {
  const idx = word.search(/[a-zà-ú]/i)
  if (idx === -1) return word
  return word.slice(0, idx) + word[idx].toUpperCase() + word.slice(idx + 1)
}

function titleCase(raw: string): string {
  const words = raw.toLowerCase().trim().split(/\s+/)
  return words
    .map((word, i) => {
      const letters = word.replace(/[^a-zà-ú]/gi, '')
      if (i > 0 && SMALL_WORDS.has(letters)) return word
      return capitalizeFirstLetter(word)
    })
    .join(' ')
}

// "CRU(A)" -> "cru" / "GRELHADO(A)/BRASA/CHURRASCO" -> "grelhado"
function prepLabel(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\(a\)/g, '')
    .split('/')[0]
    .trim()
}

function buildName(foodRaw: string, prepRaw: string): string {
  const food = titleCase(foodRaw)
  const prep = String(prepRaw).trim().toUpperCase()
  if (!prep || prep === NO_PREP) return food
  return `${food}, ${prepLabel(prepRaw)}`
}

function normalizeForCompare(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseSheet(): FoodEntry[] {
  const wb = XLSX.readFile(XLS_PATH)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null })

  const entries: FoodEntry[] = []
  // Linhas 0-3 são cabeçalho/título; dado começa na linha 4
  for (const row of rows.slice(4)) {
    const foodRaw = row[COL.foodName]
    const calories = num(row[COL.calories])
    if (typeof foodRaw !== 'string' || !foodRaw.trim() || calories === null) continue

    const protein = num(row[COL.protein]) ?? 0
    const carbs = num(row[COL.carbs]) ?? 0
    const fat = num(row[COL.fat]) ?? 0
    const name = buildName(foodRaw, String(row[COL.prepName] ?? ''))

    entries.push({
      name,
      nameOriginal: `${String(foodRaw).trim()}${row[COL.prepName] ? ` - ${String(row[COL.prepName]).trim()}` : ''}`,
      sourceId: `${row[COL.foodCode]}-${row[COL.prepName] ?? '0'}`,
      calories,
      protein,
      carbs,
      fat,
      fiber: num(row[COL.fiber]),
      sodium: num(row[COL.sodium]),
    })
  }
  return entries
}

async function fetchExistingNames(): Promise<Set<string>> {
  const { rows } = await pool.query<{ name: string }>('SELECT name FROM "Food"')
  return new Set(rows.map((r) => normalizeForCompare(r.name)))
}

async function insertBatch(batch: FoodEntry[]): Promise<number> {
  if (DRY_RUN || batch.length === 0) return batch.length

  const placeholders: string[] = []
  const values: unknown[] = []
  const now = new Date()

  batch.forEach((f, i) => {
    const b = i * 13
    placeholders.push(
      `($${b + 1},$${b + 2},$${b + 3},$${b + 4}::"FoodSource",$${b + 5},$${b + 6},$${b + 7},$${b + 8},$${b + 9},$${b + 10},$${b + 11},$${b + 12},$${b + 13})`,
    )
    values.push(
      randomUUID(), f.name, f.nameOriginal, SOURCE, f.sourceId, PRIORITY,
      f.calories, f.protein, f.carbs, f.fat, f.fiber, now, now,
    )
  })

  const { rowCount } = await pool.query(
    `INSERT INTO "Food"
       (id, name, "nameOriginal", source, "sourceId", priority,
        calories, protein, carbs, fat, fiber, "createdAt", "updatedAt")
     VALUES ${placeholders.join(',')}
     ON CONFLICT DO NOTHING`,
    values,
  )
  return rowCount ?? 0
}

async function main() {
  console.log(`Importando IBGE POF 2008-2009${DRY_RUN ? ' [DRY RUN]' : ''}`)

  const parsed = parseSheet()
  console.log(`Linhas válidas na planilha: ${parsed.length}`)

  const existing = await fetchExistingNames()
  console.log(`Nomes já no banco: ${existing.size}`)

  // Dedup interno (preparações repetidas geram nomes iguais) + cross-source
  const unique: FoodEntry[] = []
  for (const f of parsed) {
    const key = normalizeForCompare(f.name)
    if (!key || existing.has(key)) continue
    existing.add(key)
    unique.push(f)
  }
  console.log(`Únicos a inserir: ${unique.length} (${parsed.length - unique.length} duplicados pulados)`)

  let inserted = 0
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    inserted += await insertBatch(unique.slice(i, i + BATCH_SIZE))
  }

  console.log(`Inseridos: ${inserted}`)
}

main()
  .catch((e) => {
    console.error('Erro ao importar IBGE POF:', e)
    process.exit(1)
  })
  .finally(() => pool.end())
