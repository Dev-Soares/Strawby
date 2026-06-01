/**
 * Analisa e limpa o banco de Food.
 *
 * Uso:
 *   npx tsx prisma/scripts/clean-foods.ts          → relatório (sem alterar)
 *   npx tsx prisma/scripts/clean-foods.ts --fix    → aplica limpeza e correções
 */
import 'dotenv/config'
import pg from 'pg'
import { translateName, isTranslationGoodEnough, wordTranslations } from './translations.js'
import { isNutritionPlausible } from '../sources/common.js'

const FIX = process.argv.includes('--fix')
const pool = new pg.Pool({ connectionString: process.env.DIRECT_URL })

// ─── Detecção de inglês residual ──────────────────────────────────────────────

const ENGLISH_FOOD_WORDS = new Set([
  'raw','cooked','boiled','baked','fried','grilled','roasted','steamed','dried','smoked',
  'fresh','frozen','canned','salted','unsalted','sweetened','enriched','fortified',
  'whole','ground','lean','fat','boneless','skinless','reduced','lowfat','nonfat',
  'beef','chicken','pork','turkey','lamb','fish','shrimp','salmon','tuna','cod',
  'milk','cream','butter','cheese','yogurt','egg','eggs','bread','rice','pasta',
  'flour','sugar','oil','water','juice','tea','coffee','sauce','soup',
  'apple','banana','orange','grape','strawberry','blueberry','peach','pear',
  'tomato','potato','onion','garlic','carrot','spinach','broccoli','lettuce',
  'bean','beans','lentil','pea','peas','soy','tofu','nut','nuts','seed','seeds',
  'almond','walnut','cashew','peanut','sunflower','sesame','flax','chia',
  'with','without','plain','sweet','bitter','sour','light','heavy',
  'large','small','medium','baby','extra','prepared','instant','commercial',
])

function countEnglishWords(name: string): number {
  const words = name.toLowerCase().split(/[\s,\-\/()]+/).filter(w => w.length > 2)
  return words.filter(w => ENGLISH_FOOD_WORDS.has(w) && !wordTranslations[w]).length
}

function isJunkName(name: string): boolean {
  if (!name || name.length < 2) return true
  if (/[@[\]{}\\<>]/.test(name)) return true   // % é válido em "infusão 5%", "2% milkfat"
  if (/https?:\/\//.test(name)) return true
  if (/\b(NFS|NS as to|babyfood|baby food)\b/i.test(name)) return true
  if (name.length > 200) return true
  return false
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 Analisando banco de Food... (modo: ${FIX ? 'FIX' : 'DRY RUN'})\n`)

  const { rows: foods } = await pool.query<{
    id: string; name: string; nameOriginal: string | null
    calories: number; protein: number; carbs: number; fat: number
    source: string
  }>('SELECT id, name, "nameOriginal", calories, protein, carbs, fat, source FROM "Food"')

  console.log(`Total no banco: ${foods.length}\n`)

  // Índice de nomes com macros para verificar antes de deletar zero-macros
  const namesWithMacros = new Set(
    foods
      .filter(f => f.calories > 0 || f.protein > 0 || f.carbs > 0 || f.fat > 0)
      .map(f => f.name.toLowerCase().trim())
  )

  const toDelete: string[] = []
  const toUpdate: { id: string; newName: string; oldName: string }[] = []
  const issues = { zeroMacros: 0, zeroMacrosKept: 0, implausible: 0, junkName: 0, stillEnglish: 0, improved: 0 }

  for (const food of foods) {
    // Lixo: macros zerados
    if (food.calories === 0 && food.protein === 0 && food.carbs === 0 && food.fat === 0) {
      // Só deleta se outra entrada com mesmo nome E com macros existir
      const hasBetterVersion = namesWithMacros.has(food.name.toLowerCase().trim())
      if (hasBetterVersion) {
        issues.zeroMacros++; toDelete.push(food.id)
      } else {
        issues.zeroMacrosKept++ // mantém — sem alternativa no banco
      }
      continue
    }

    // Lixo: nutrição fisicamente impossível (ignora ratio — álcool e fibras distorcem)
    const totalMacros = food.protein + food.carbs + food.fat
    if (totalMacros > 105 || food.calories > 960) {
      issues.implausible++; toDelete.push(food.id); continue
    }

    // Lixo: nome inválido
    if (isJunkName(food.name)) {
      issues.junkName++; toDelete.push(food.id); continue
    }

    // Tradução ruim: tenta corrigir via nameOriginal
    if (food.nameOriginal) {
      const retranslated = translateName(food.nameOriginal)
      const currentEnglish = countEnglishWords(food.name)
      const newEnglish = countEnglishWords(retranslated)

      const improved =
        retranslated !== food.name &&
        retranslated.length >= 2 &&
        newEnglish < currentEnglish &&
        isTranslationGoodEnough(retranslated, food.nameOriginal)

      if (improved) {
        issues.improved++
        toUpdate.push({ id: food.id, newName: retranslated, oldName: food.name })
      } else if (currentEnglish > 0) {
        issues.stillEnglish++
      }
    } else if (countEnglishWords(food.name) > 1) {
      issues.stillEnglish++
    }
  }

  // Relatório
  console.log('=== PROBLEMAS ENCONTRADOS ===')
  console.log(`  Macros zerados (deletar):          ${issues.zeroMacros}`)
  console.log(`  Macros zerados (manter sem alt.):  ${issues.zeroMacrosKept}`)
  console.log(`  Nutrição implausível (deletar):    ${issues.implausible}`)
  console.log(`  Nome inválido (deletar):           ${issues.junkName}`)
  console.log(`  Ainda em inglês (sem fix):         ${issues.stillEnglish}`)
  console.log(`  Tradução melhorável (corrigir):    ${issues.improved}`)
  console.log(`\n  Total a deletar:   ${toDelete.length}`)
  console.log(`  Total a atualizar: ${toUpdate.length}`)

  // Amostras
  if (toDelete.length > 0) {
    const sample = await pool.query(
      `SELECT name, source, calories, protein, carbs, fat FROM "Food" WHERE id = ANY($1) LIMIT 8`,
      [toDelete.slice(0, 100)]
    )
    console.log('\n--- Amostra de deleções:')
    sample.rows.forEach(r =>
      console.log(`  [${r.source}] "${r.name}" cal=${r.calories} p=${r.protein} c=${r.carbs} f=${r.fat}`)
    )
  }

  if (toUpdate.length > 0) {
    console.log('\n--- Amostra de correções:')
    toUpdate.slice(0, 12).forEach(u => console.log(`  "${u.oldName}"\n  → "${u.newName}"\n`))
  }

  if (!FIX) {
    console.log('\n⚠️  Dry run — rode com --fix para aplicar.')
    await pool.end(); return
  }

  // Aplicar deleções
  if (toDelete.length > 0) {
    let deleted = 0
    for (let i = 0; i < toDelete.length; i += 500) {
      const { rowCount } = await pool.query('DELETE FROM "Food" WHERE id = ANY($1)', [toDelete.slice(i, i + 500)])
      deleted += rowCount ?? 0
    }
    console.log(`\n  ✅ ${deleted} foods deletados`)
  }

  // Aplicar correções de tradução
  if (toUpdate.length > 0) {
    let updated = 0
    for (const u of toUpdate) {
      await pool.query('UPDATE "Food" SET name = $1, "updatedAt" = NOW() WHERE id = $2', [u.newName, u.id])
      updated++
    }
    console.log(`  ✅ ${updated} traduções corrigidas`)
  }

  const { rows: [{ count }] } = await pool.query('SELECT COUNT(*) FROM "Food"')
  console.log(`\n📊 Total após limpeza: ${count} foods`)
  await pool.end()
}

main().catch(e => { console.error(e); process.exit(1) })
