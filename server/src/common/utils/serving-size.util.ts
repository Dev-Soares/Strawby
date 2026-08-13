/** Porção padrão em gramas, usada quando o alimento não define uma válida */
export const DEFAULT_SERVING_SIZE = 100;

/**
 * Converte o servingSize (String livre no schema, ex.: '100', '100g', '')
 * para número utilizável como divisor.
 *
 * Valores não numéricos, zero ou negativos caem no padrão — sem isso,
 * `Number('100g')` retorna NaN e contamina calorias/macros gravados.
 */
export const parseServingSize = (
  servingSize: string | null | undefined,
): number => {
  const parsed = servingSize ? Number(servingSize) : NaN;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_SERVING_SIZE;
};
