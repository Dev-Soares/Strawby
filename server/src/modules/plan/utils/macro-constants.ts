/**
 * Constantes nutricionais do cálculo automático de plano.
 *
 * Ficam fora do service porque são parâmetros do domínio, não regra de
 * orquestração — ajustar a recomendação é mexer aqui, num só lugar.
 */

/**
 * Déficit/superávit como fração do TDEE, não em kcal fixas: 400 kcal é ~28% do
 * gasto de uma pessoa pequena e ~13% de uma grande.
 */
export const CALORIE_ADJUSTMENT_RATE: Record<string, number> = {
  lose: -0.18,
  gain: 0.12,
  maintain: 0,
};

/** Piso absoluto (kcal/dia) — nenhum plano é gerado abaixo disso. */
export const MIN_DAILY_CALORIES: Record<string, number> = {
  male: 1500,
  female: 1200,
};

/** Piso usado quando o sexo não é 'male' nem 'female'. */
export const FALLBACK_MIN_DAILY_CALORIES = 1300;

/** IMC a partir do qual o excesso de peso deixa de contar integralmente. */
export const ADJUSTED_WEIGHT_BMI_THRESHOLD = 30;

/** Teto do IMC saudável — base do peso ajustado. */
export const HEALTHY_BMI_CEILING = 25;

/** Fração do excesso de peso que ainda demanda proteína/gordura. */
export const EXCESS_WEIGHT_FACTOR = 0.25;

/** Mínimo de gordura como fração das calorias — função hormonal. */
export const MIN_FAT_CALORIE_SHARE = 0.2;

/**
 * Proteína em g/kg de peso ajustado. Mais alta em déficit (poupa massa magra) e
 * em superávit (hipertrofia); manutenção pede menos.
 */
export const PROTEIN_PER_KG: Record<string, number> = {
  lose: 1.8,
  gain: 1.9,
  maintain: 1.6,
};

/** Gordura em g/kg de peso ajustado. */
export const FAT_PER_KG: Record<string, number> = {
  lose: 0.8,
  gain: 1.0,
  maintain: 1.0,
};

/** Fallback de g/kg quando a meta não está no mapa. */
export const DEFAULT_PROTEIN_PER_KG = 1.6;
export const DEFAULT_FAT_PER_KG = 1.0;

/**
 * Teto de participação do carboidrato nas calorias. Sem ele o carboidrato é
 * puramente residual e, em TDEE alto, passa de 65% do plano.
 */
export const MAX_CARB_CALORIE_SHARE = 0.55;

/** Teto de proteína em g/kg — limita para onde o excedente do carboidrato vai. */
export const MAX_PROTEIN_PER_KG = 2.2;

/** Densidade energética dos macronutrientes (kcal/g). */
export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const;
