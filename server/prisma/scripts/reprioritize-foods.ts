import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

/**
 * Reordena priority por qualidade real do texto, não pela fonte em si.
 * OFF tem nomes em pt-BR nativos (rótulos reais) — qualidade alta apesar de
 * ser fonte "secundária". LIVS está em sueco (não traduzido) e SR_LEGACY tem
 * tradução automática muito quebrada — ambos vão pro fim da fila.
 */
const PRIORITY_BY_SOURCE: Record<string, number> = {
  TACO: 100,
  OFF: 90,
  USDA_FOUNDATION: 70,
  USDA_SR_LEGACY: 30,
  LIVS: 10,
}

// CNF tinha 3 tiers (68/70/72) sem dedução documentada — preserva o espaçamento
// relativo só deslocando a faixa pra baixo.
const CNF_PRIORITY_MAP: Record<number, number> = {
  68: 52,
  70: 54,
  72: 56,
}

async function main() {
  for (const [source, priority] of Object.entries(PRIORITY_BY_SOURCE)) {
    const result = await prisma.food.updateMany({
      where: { source: source as never },
      data: { priority },
    })
    console.log(`${source}: ${result.count} alimentos -> priority ${priority}`)
  }

  for (const [oldPriority, newPriority] of Object.entries(CNF_PRIORITY_MAP)) {
    const result = await prisma.food.updateMany({
      where: { source: 'CNF', priority: Number(oldPriority) },
      data: { priority: newPriority },
    })
    console.log(`CNF (era ${oldPriority}): ${result.count} alimentos -> priority ${newPriority}`)
  }
}

main()
  .catch((e) => {
    console.error('Erro ao repriorizar alimentos:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
