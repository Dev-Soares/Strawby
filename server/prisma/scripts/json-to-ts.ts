import * as fs from 'fs'

const inputPath = 'C:\\Users\\Bernardo\\AppData\\Local\\Temp\\opencode\\suggested-meals-matched.json'
const raw = fs.readFileSync(inputPath, 'utf16le').replace(/^\uFEFF/, '')
const data = JSON.parse(raw)

const indent = (lines: string, spaces: number): string =>
  lines
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : ' '.repeat(spaces) + line))
    .join('\n')

const formatItem = (item: any): string => {
  return `{
  foodId: '${item.foodId}',
  name: '${item.name.replace(/'/g, "\\'")}',
  quantity: ${item.quantity},
  unit: '${item.unit}',
  calories: ${item.calories},
  protein: ${item.protein},
  carbs: ${item.carbs},
  fat: ${item.fat},
}`
}

const formatMeal = (meal: any): string => {
  const items = meal.items.map(formatItem).join(',\n')
  return `{
  name: '${meal.name.replace(/'/g, "\\'")}',
  mealType: '${meal.mealType}',
  reason: '${meal.reason.replace(/'/g, "\\'")}',
  items: [
${indent(items, 4)}
  ],
}`
}

const sections: string[] = []
for (const [mealType, meals] of Object.entries(data)) {
  const mealsFormatted = (meals as any[]).map(formatMeal).join(',\n')
  sections.push(`const ${mealType}: SuggestedMeal[] = [
${indent(mealsFormatted, 2)}
];`)
}

const output = `import type { MealType } from '../types/meal-suggestion.types';

export type SuggestedMealItem = {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type SuggestedMeal = {
  name: string;
  mealType: MealType;
  reason: string;
  items: SuggestedMealItem[];
};

${sections.join('\n\n')}

export const SUGGESTED_MEALS: Record<MealType, SuggestedMeal[]> = {
  ${Object.keys(data).join(',\n  ')},
};
`

fs.writeFileSync('C:\\Users\\Bernardo\\AppData\\Local\\Temp\\opencode\\suggested-meals.data.ts', output, 'utf-8')
console.log('TS file written to C:\\Users\\Bernardo\\AppData\\Local\\Temp\\opencode\\suggested-meals.data.ts')
