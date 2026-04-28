import 'dotenv/config'
import { readFileSync } from 'fs'
import { join } from 'path'
import axios from 'axios'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/client.js'

// ─── Prisma Setup ───
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

// ─── Constants ───
const BATCH_SIZE = 500
const MAX_RETRIES = 8
const BASE_DELAY = 10000
const REQUEST_DELAY = 3000
const MAX_PAGES = 60 // 60 páginas × 100 produtos = 6000 candidatos

// ─── Interfaces ───
interface FoodEntry {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

// ─── Helpers ───
function round2(val: number): number {
  return Math.round(val * 100) / 100
}

function safeNum(val: unknown): number {
  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (trimmed === '' || trimmed === 'NA' || trimmed === 'Tr') return 0
    const parsed = parseFloat(trimmed)
    return isNaN(parsed) || parsed < 0 ? 0 : parsed
  }
  if (typeof val === 'number') return isNaN(val) || val < 0 ? 0 : val
  return 0
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Normalização para deduplicação ───
function normalizeForCompare(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // remove acentos
    .replace(/[^a-z0-9\s]/g, ' ')      // remove pontuação
    .replace(/\s+/g, ' ')
    .trim()
}

// ─── Filtro de qualidade de nome ───
const FOREIGN_WORDS = /\b(chicken|crispy|beef|pork|turkey|lamb|pollo|poulet|boeuf|burger|nugget|steak|wrap|sandwich|smoothie|sauce|dressing|flavour|flavor)\b/i

function isValidFoodName(name: string): boolean {
  // Comprimento razoável
  if (name.length < 3 || name.length > 70) return false
  // Máximo de 7 palavras
  if (name.split(/\s+/).length > 7) return false
  // Caracteres de produto comercial
  if (/[%*|#@[\]{}\\<>]/.test(name)) return false
  // Parênteses
  if (name.includes('(')) return false
  // Medidas embutidas
  if (/\d+(g|ml|kg|l\b|mg|kcal|cal)\b/i.test(name)) return false
  // Começa com número
  if (/^\d/.test(name)) return false
  // Tudo em maiúsculo (marca gritando)
  if (name.length > 5 && name === name.toUpperCase()) return false
  // Separador de marca "Produto - Marca"
  if (/ - /.test(name)) return false
  // Duas ou mais vírgulas/ponto-e-vírgulas (lista de ingredientes)
  if (/[,;].*[,;]/.test(name)) return false
  // URL
  if (/https?:\/\/|www\./.test(name)) return false
  // Palavras em idioma estrangeiro
  if (FOREIGN_WORDS.test(name)) return false

  return true
}

// ─── Validação nutricional ───
function isNutritionPlausible(calories: number, protein: number, carbs: number, fat: number): boolean {
  const totalMacros = protein + carbs + fat
  // Macros não podem ultrapassar 105g por 100g de alimento
  if (totalMacros > 105) return false
  // Calorias estimadas pelos macros
  const estimated = protein * 4 + carbs * 4 + fat * 9
  // Deve estar dentro de 35% das calorias declaradas
  if (calories > 10 && estimated > 10) {
    const ratio = Math.abs(calories - estimated) / calories
    if (ratio > 0.35) return false
  }
  return true
}

// ─── Load TACO ───
function loadTaco(): FoodEntry[] {
  const raw = readFileSync(join(__dirname, 'taco.json'), 'utf-8')
  const items: any[] = JSON.parse(raw)
  const foods: FoodEntry[] = []

  for (const item of items) {
    const name = item.description?.trim()
    if (!name) continue

    const calories = round2(safeNum(item.energy_kcal))
    const protein = round2(safeNum(item.protein_g))
    const carbs = round2(safeNum(item.carbohydrate_g))
    const fat = round2(safeNum(item.lipid_g))

    foods.push({ name, calories, protein, carbs, fat })
  }

  console.log(`[TACO] ${foods.length} alimentos carregados`)
  return foods
}

// ─── Load Open Food Facts (apenas Brasil, por popularidade) ───
async function loadOpenFoodFacts(): Promise<FoodEntry[]> {
  const foods: FoodEntry[] = []
  let page = 1
  let failures = 0
  let emptyPages = 0

  console.log('[OFF] Buscando produtos brasileiros por popularidade...')

  while (page <= MAX_PAGES) {
    let success = false

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await axios.get('https://world.openfoodfacts.org/api/v2/search', {
          params: {
            countries_tags: 'en:brazil',
            fields: 'product_name,nutriments',
            sort_by: 'unique_scans_n',
            page_size: 100,
            page,
          },
          timeout: 30000,
        })

        const products: any[] = resp.data?.products ?? []

        if (products.length === 0) {
          emptyPages++
          if (emptyPages >= 3) {
            console.log('[OFF] Sem mais produtos, finalizando.')
            return foods
          }
          success = true
          break
        }

        emptyPages = 0

        for (const p of products) {
          const name = p.product_name?.trim()
          if (!name || !isValidFoodName(name)) continue

          const n = p.nutriments ?? {}
          const calories = round2(safeNum(n['energy-kcal_100g']))
          const protein = round2(safeNum(n['proteins_100g']))
          const carbs = round2(safeNum(n['carbohydrates_100g']))
          const fat = round2(safeNum(n['fat_100g']))

          if (calories === 0 && protein === 0 && carbs === 0 && fat === 0) continue
          if (!isNutritionPlausible(calories, protein, carbs, fat)) continue

          foods.push({ name, calories, protein, carbs, fat })
        }

        success = true
        break
      } catch (err: any) {
        const status = err.response?.status
        const retryable = status === 503 || status === 429 || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT'
        if (attempt < MAX_RETRIES && retryable) {
          const delay = BASE_DELAY * attempt
          console.warn(`[OFF] p${page} tentativa ${attempt}/${MAX_RETRIES} — aguardando ${delay / 1000}s...`)
          await sleep(delay)
        } else {
          console.warn(`[OFF] Falha definitiva p${page}: ${err.message}`)
        }
      }
    }

    if (!success) failures++

    console.log(`[OFF] p${page}/${MAX_PAGES} — ${foods.length} válidos até agora (${failures} falhas)`)
    page++
    await sleep(REQUEST_DELAY)
  }

  console.log(`[OFF] ${foods.length} alimentos carregados`)
  return foods
}

// ─── Deduplicação TACO-first com similaridade ───
function deduplicateTacoFirst(tacoFoods: FoodEntry[], offFoods: FoodEntry[]): FoodEntry[] {
  // Monta set de palavras-chave por alimento TACO
  const tacoNormalized = new Set(tacoFoods.map((f) => normalizeForCompare(f.name)))

  const tacoWordSets = tacoFoods.map((f) =>
    new Set(normalizeForCompare(f.name).split(' ').filter((w) => w.length > 3)),
  )

  function isTacoDuplicate(offName: string): boolean {
    const normalized = normalizeForCompare(offName)

    // Match exato
    if (tacoNormalized.has(normalized)) return true

    // Match por sobreposição de palavras-chave (>= 80%)
    const offWords = normalized.split(' ').filter((w) => w.length > 3)
    if (offWords.length === 0) return false

    for (const tacoWords of tacoWordSets) {
      if (tacoWords.size === 0) continue
      const overlap = offWords.filter((w) => tacoWords.has(w)).length
      const similarity = overlap / Math.max(offWords.length, tacoWords.size)
      if (similarity >= 0.8) return true
    }

    return false
  }

  // Deduplicação interna do OFF
  const seen = new Set(tacoNormalized)
  const filteredOff: FoodEntry[] = []

  for (const food of offFoods) {
    if (isTacoDuplicate(food.name)) continue
    const key = normalizeForCompare(food.name)
    if (seen.has(key)) continue
    seen.add(key)
    filteredOff.push(food)
  }

  return [...tacoFoods, ...filteredOff]
}

// ─── Insert in Batches ───
async function insertBatch(foods: FoodEntry[]): Promise<number> {
  let inserted = 0

  for (let i = 0; i < foods.length; i += BATCH_SIZE) {
    const batch = foods.slice(i, i + BATCH_SIZE)
    const result = await db.food.createMany({ data: batch, skipDuplicates: true })
    inserted += result.count
    console.log(`[DB] Lote ${Math.floor(i / BATCH_SIZE) + 1}: ${result.count} inseridos`)
  }

  return inserted
}

// ─── Main ───
async function main() {
  console.log('Iniciando seed de alimentos (TACO + OFF Brasil)...\n')

  const tacoFoods = loadTaco()
  const offFoods = await loadOpenFoodFacts()

  console.log(`\n[DEDUP] Deduplicando OFF contra TACO...`)
  const allFoods = deduplicateTacoFirst(tacoFoods, offFoods)
  console.log(`[TOTAL] ${allFoods.length} alimentos únicos (${tacoFoods.length} TACO + ${allFoods.length - tacoFoods.length} OFF)`)

  await db.food.deleteMany()
  console.log('[DB] Tabela Food limpa')

  const inserted = await insertBatch(allFoods)
  console.log(`\n✅ Seed concluído: ${inserted} alimentos inseridos no banco`)
}

main()
  .catch((err) => {
    console.error('Erro fatal no seed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
    await pool.end()
  })
