import { applyDecorators } from '@nestjs/common';
import { Matches } from 'class-validator';

/**
 * Valida que o campo é uma data pura no formato 'YYYY-MM-DD'.
 *
 * USO: campos de "dia" consumidos por parseAppDay/appDayRange (DailyScore,
 * PatientWeight). Diferente de @IsDateString(), rejeita timestamps com hora
 * ('2026-05-20T15:30:00Z'), que produziriam Date inválido em parseAppDay.
 *
 * NÃO usar em Meal.date (timestamp ISO completo) — esse campo usa @IsDateString.
 */
export function IsAppDay(): PropertyDecorator {
  return applyDecorators(
    Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'A data deve estar no formato YYYY-MM-DD',
    }),
  );
}
