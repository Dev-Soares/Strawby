import { BadRequestException } from '@nestjs/common';

const APP_TIMEZONE = 'America/Sao_Paulo';

/**
 * Offset fixo de São Paulo (UTC-3). O Brasil não adota horário de verão
 * desde 2019, então o offset é constante. Em horas.
 */
const APP_TZ_OFFSET_HOURS = -3;

/**
 * Converte 'YYYY-MM-DD' para a meia-noite UTC daquele dia.
 *
 * USO: chave de colunas `@db.Date` (ex.: DailyScore.date, PatientWeight.date).
 * O Prisma grava a parte UTC do Date na coluna Date, então a meia-noite UTC
 * é exatamente o valor desejado para essas colunas — NÃO aplicar offset aqui.
 *
 * Lança BadRequestException se a data for inválida.
 */
export function parseAppDay(day: string): Date {
  const start = new Date(day + 'T00:00:00.000Z');
  if (isNaN(start.getTime())) throw new BadRequestException('Data inválida');
  return start;
}

/**
 * Janela [start, end) de um único dia em UTC, a partir de 'YYYY-MM-DD'.
 *
 * USO: chave de colunas `@db.Date`. Para filtrar timestamps reais
 * (Meal.date) use appDayRangeTz, que considera o fuso de São Paulo.
 */
export function appDayRange(day: string): { start: Date; end: Date } {
  const start = parseAppDay(day);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

/**
 * Janela [start, end) de um dia no fuso de São Paulo, em instantes UTC.
 *
 * USO: filtrar timestamps reais com hora (Meal.date). A meia-noite local de
 * SP (UTC-3) equivale a day 03:00Z; o fim é a meia-noite local seguinte.
 * Assim refeições logadas entre 21h–24h local caem no dia correto.
 *
 * Ex.: '2026-06-30' -> [2026-06-30T03:00:00Z, 2026-07-01T03:00:00Z)
 */
export function appDayRangeTz(day: string): { start: Date; end: Date } {
  const utcMidnight = parseAppDay(day);
  // local midnight = utc midnight - offset (offset é negativo => soma 3h)
  const start = new Date(
    utcMidnight.getTime() - APP_TZ_OFFSET_HOURS * 60 * 60 * 1000,
  );
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export function todayInAppTz(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: APP_TIMEZONE });
}

export function yesterdayInAppTz(): string {
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: APP_TIMEZONE });
  const [y, m, d] = todayStr.split('-').map(Number);
  const todayUtc = Date.UTC(y, m - 1, d);
  const yesterdayUtc = new Date(todayUtc - 86_400_000);
  return yesterdayUtc.toISOString().slice(0, 10);
}
