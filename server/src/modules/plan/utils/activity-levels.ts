/**
 * Fatores de atividade física aplicados sobre a TMB para chegar no gasto
 * energético diário (TDEE = TMB × fator).
 *
 * São os fatores com que o Mifflin-St Jeor foi validado (1990) — usar valores
 * menores subestima o gasto e empilha com o déficit, gerando plano de fome.
 * A lista é a fonte da verdade: o cliente só pode mandar um destes valores.
 */
export const ACTIVITY_FACTORS = [1.2, 1.375, 1.55, 1.725, 1.9] as const;

export type ActivityFactor = (typeof ACTIVITY_FACTORS)[number];

/** Moderadamente ativo — padrão quando nada é escolhido. */
export const DEFAULT_ACTIVITY_FACTOR: ActivityFactor = 1.55;
