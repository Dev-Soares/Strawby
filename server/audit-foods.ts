import 'dotenv/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './prisma/prisma/client.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

// Termos comuns que TODO app nutrição precisa ter
const ESSENTIAL_FOODS = {
  // Brasileiros essenciais
  br_basicos: [
    'arroz', 'feijão', 'feijão preto', 'feijão carioca', 'mandioca', 'farinha de mandioca',
    'tapioca', 'milho', 'pão francês', 'pão de forma', 'pão de queijo', 'cuscuz',
    'quibe', 'açaí', 'cupuaçu', 'guaraná', 'caju', 'pequi', 'jabuticaba', 'pitanga',
    'graviola', 'pinha', 'jaca', 'umbu', 'cajá', 'goiaba', 'maracujá',
  ],
  carnes: [
    'picanha', 'alcatra', 'maminha', 'fraldinha', 'contrafilé', 'patinho', 'músculo',
    'costela', 'cupim', 'acém', 'paleta', 'pernil', 'lombo', 'pancetta', 'bacon',
    'linguiça', 'salsicha', 'mortadela', 'presunto', 'salame', 'copa', 'peito de peru',
  ],
  peixes_frutos: [
    'tilápia', 'salmão', 'atum', 'sardinha', 'bacalhau', 'cação', 'pintado', 'tambaqui',
    'pirarucu', 'merluza', 'pescada', 'badejo', 'robalo', 'camarão', 'lula', 'polvo',
    'caranguejo', 'siri', 'mexilhão', 'ostra', 'lagosta',
  ],
  vegetais: [
    'alface', 'tomate', 'pepino', 'cebola', 'alho', 'pimentão', 'cenoura', 'beterraba',
    'rabanete', 'couve', 'brócolis', 'couve-flor', 'abobrinha', 'berinjela', 'chuchu',
    'jiló', 'quiabo', 'maxixe', 'palmito', 'aspargo', 'espinafre', 'rúcula', 'agrião',
    'mostarda', 'taioba', 'almeirão', 'escarola', 'salsão', 'erva-doce',
  ],
  frutas: [
    'maçã', 'banana', 'laranja', 'mamão', 'abacaxi', 'manga', 'melancia', 'melão',
    'uva', 'morango', 'kiwi', 'pera', 'pêssego', 'ameixa', 'tangerina', 'limão',
    'abacate', 'coco', 'figo', 'damasco',
  ],
  graos_cereais: [
    'aveia', 'quinoa', 'amaranto', 'chia', 'linhaça', 'gergelim', 'trigo', 'centeio',
    'cevada', 'painço', 'soja', 'grão-de-bico', 'lentilha', 'ervilha', 'fava',
  ],
  laticinios: [
    'leite', 'queijo minas', 'queijo prato', 'mussarela', 'parmesão', 'requeijão',
    'iogurte', 'manteiga', 'creme de leite', 'leite condensado', 'whey',
    'queijo coalho', 'ricota', 'queijo cottage',
  ],
  nozes_sementes: [
    'castanha-do-pará', 'castanha de caju', 'amêndoa', 'noz', 'avelã', 'pistache',
    'macadâmia', 'amendoim', 'pinhão', 'semente de girassol', 'semente de abóbora',
  ],
  bebidas: [
    'café', 'chá', 'água de coco', 'suco de laranja', 'cerveja', 'vinho', 'cachaça',
    'refrigerante', 'energético', 'isotônico',
  ],
  oleos_gorduras: [
    'azeite', 'óleo de soja', 'óleo de coco', 'óleo de girassol', 'óleo de canola',
    'banha', 'margarina', 'manteiga ghee',
  ],
  industrializados_br: [
    'nescau', 'toddy', 'leite ninho', 'danone', 'activia', 'sucrilhos', 'nesfit',
    'mucilon', 'farinha láctea', 'maizena', 'fermento', 'açúcar', 'sal', 'vinagre',
  ],
}

async function searchExists(term: string): Promise<{ count: number; first?: string }> {
  const results = await db.food.findMany({
    where: {
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { nameOriginal: { contains: term, mode: 'insensitive' } },
      ],
    },
    select: { name: true, source: true },
    take: 1,
  })
  const total = await db.food.count({
    where: {
      OR: [
        { name: { contains: term, mode: 'insensitive' } },
        { nameOriginal: { contains: term, mode: 'insensitive' } },
      ],
    },
  })
  return { count: total, first: results[0] ? `[${results[0].source}] ${results[0].name}` : undefined }
}

async function main() {
  console.log('═══ AUDITORIA DE COBERTURA ═══\n')

  // Totais gerais
  const total = await db.food.count()
  console.log(`Total alimentos: ${total}\n`)

  const bySource = await db.food.groupBy({
    by: ['source'],
    _count: true,
  })
  console.log('Por fonte:')
  for (const s of bySource) console.log(`  ${s.source.padEnd(20)} ${s._count}`)

  // ═══ Lacunas por categoria essencial ═══
  console.log('\n═══ COBERTURA POR CATEGORIA ═══')
  for (const [cat, terms] of Object.entries(ESSENTIAL_FOODS)) {
    console.log(`\n▼ ${cat.toUpperCase()} (${terms.length} termos)`)
    const missing: string[] = []
    const lowCoverage: string[] = []
    for (const term of terms) {
      const r = await searchExists(term)
      if (r.count === 0) missing.push(term)
      else if (r.count < 2) lowCoverage.push(`${term} (${r.count})`)
    }
    if (missing.length === 0 && lowCoverage.length === 0) {
      console.log(`  ✅ Cobertura completa`)
    } else {
      if (missing.length > 0) console.log(`  ❌ AUSENTES (${missing.length}):`, missing.join(', '))
      if (lowCoverage.length > 0) console.log(`  ⚠️  POUCAS variantes:`, lowCoverage.join(', '))
    }
  }

  // ═══ Qualidade nutricional ═══
  console.log('\n═══ QUALIDADE NUTRICIONAL ═══')
  const zeroKcal = await db.food.count({ where: { calories: 0 } })
  const onlyMacroZero = await db.food.count({
    where: { AND: [{ calories: 0 }, { protein: 0 }, { carbs: 0 }, { fat: 0 }] },
  })
  const noFiber = await db.food.count({ where: { fiber: null } })
  const noSodium = await db.food.count({ where: { sodium: null } })
  const noOriginal = await db.food.count({ where: { nameOriginal: null } })

  console.log(`  0 kcal:                     ${zeroKcal}/${total} (${((zeroKcal / total) * 100).toFixed(1)}%)`)
  console.log(`  Tudo zerado (lixo total):   ${onlyMacroZero}`)
  console.log(`  Sem fibra:                  ${noFiber}/${total}`)
  console.log(`  Sem sódio:                  ${noSodium}/${total}`)
  console.log(`  Sem nome original:          ${noOriginal} (TACO + OFF marca BR)`)

  // ═══ Distribuição calorias ═══
  console.log('\n═══ DISTRIBUIÇÃO CALORIAS ═══')
  const buckets = [0, 50, 100, 200, 400, 600, 800, 950]
  for (let i = 0; i < buckets.length - 1; i++) {
    const c = await db.food.count({
      where: { AND: [{ calories: { gte: buckets[i] } }, { calories: { lt: buckets[i + 1] } }] },
    })
    console.log(`  ${buckets[i]}-${buckets[i + 1]} kcal: ${c}`)
  }

  // ═══ Palavras suspeitas remanescentes ═══
  console.log('\n═══ PALAVRAS EN/SV NÃO TRADUZIDAS (top problemáticas) ═══')
  const suspicious = ['cheese', 'beef', 'pork', 'fish', 'milk', 'with', 'raw', 'cooked', 'fett', 'protein,', 'sauce', 'oil']
  for (const w of suspicious) {
    const c = await db.food.count({
      where: { name: { contains: ` ${w}`, mode: 'insensitive' } },
    })
    if (c > 0) console.log(`  "${w}" aparece em ${c} nomes`)
  }

  // ═══ Top 10 mais longos (provavel lixo) ═══
  console.log('\n═══ TOP 10 NOMES MAIS LONGOS (possível lixo) ═══')
  const longNames = await db.$queryRawUnsafe<{ name: string; source: string; len: number }[]>(
    `SELECT name, source::text, length(name) as len FROM "Food" ORDER BY length(name) DESC LIMIT 10`,
  )
  for (const f of longNames) console.log(`  [${f.source}] (${f.len}) ${f.name}`)

  // ═══ Duplicatas por nome ═══
  console.log('\n═══ NOMES DUPLICADOS NO BANCO ═══')
  const dups = await db.$queryRawUnsafe<{ name: string; n: bigint }[]>(
    `SELECT name, COUNT(*) as n FROM "Food" GROUP BY name HAVING COUNT(*) > 1 ORDER BY n DESC LIMIT 10`,
  )
  console.log(`  ${dups.length} nomes duplicados (top 10):`)
  for (const d of dups) console.log(`    "${d.name}" × ${d.n}`)

  // ═══ Resumo final ═══
  console.log('\n═══ RESUMO ═══')
  console.log(`Total: ${total} | Zerados: ${zeroKcal} | Sem original: ${noOriginal}`)
}

main()
  .catch((e) => console.error('Erro:', e))
  .finally(async () => {
    await db.$disconnect()
    await pool.end()
  })
