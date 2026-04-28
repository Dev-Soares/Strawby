import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/client.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const BATCH_SIZE = 500

const FOREIGN_WORDS = [
  'chicken', 'crispy', 'beef', 'pork', 'turkey', 'lamb', 'fish',
  'pollo', 'poulet', 'hähnchen', 'poulet', 'boeuf',
  'burger', 'nugget', 'steak', 'wrap', 'sandwich', 'smoothie',
]

function isJunk(name: string): boolean {
  // Muito longo
  if (name.length > 70) return true
  // Muitas palavras
  if (name.split(/\s+/).length > 7) return true
  // Caracteres especiais de produto comercial (regex separado para garantir cada um)
  if (/[%|#@{}\\<>]/.test(name)) return true
  if (name.includes('*')) return true
  // Medidas embutidas (500g, 1kg, 200ml...)
  if (/\d+(g|ml|kg|l|mg|kcal|cal)\b/i.test(name)) return true
  // Começa com número
  if (/^\d/.test(name)) return true
  // Tudo em maiúsculo
  if (name.length > 5 && name === name.toUpperCase()) return true
  // Parênteses
  if (name.includes('(')) return true
  // Duas ou mais vírgulas/ponto-e-vírgulas (lista de ingredientes)
  if (/[,;].*[,;]/.test(name)) return true
  // URL ou e-mail
  if (/https?:\/\/|www\./.test(name)) return true
  // Separador de marca: "Produto - Marca"
  if (/ - /.test(name)) return true
  // Palavras em idioma estrangeiro
  const lower = name.toLowerCase()
  if (FOREIGN_WORDS.some((w) => new RegExp(`\\b${w}\\b`).test(lower))) return true

  return false
}

async function main() {
  const total = await db.food.count()
  console.log(`[DB] Total atual: ${total} alimentos\n`)

  let cursor: string | undefined = undefined
  let deleted = 0
  let checked = 0

  while (true) {
    const batch = await db.food.findMany({
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: 'asc' },
      select: { id: true, name: true },
    })

    if (batch.length === 0) break

    const junkIds = batch.filter((f) => isJunk(f.name)).map((f) => f.id)

    if (junkIds.length > 0) {
      await db.food.deleteMany({ where: { id: { in: junkIds } } })
      deleted += junkIds.length
    }

    checked += batch.length
    cursor = batch[batch.length - 1].id

    console.log(`[LIMPEZA] ${checked}/${total} verificados — ${deleted} deletados até agora`)
  }

  const remaining = await db.food.count()
  console.log(`\n✅ Limpeza concluída: ${deleted} removidos, ${remaining} alimentos restantes`)
}

main()
  .catch((err) => {
    console.error('Erro:', err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
    await pool.end()
  })
