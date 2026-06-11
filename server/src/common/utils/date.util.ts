import { BadRequestException } from '@nestjs/common';

const APP_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converte 'YYYY-MM-DD' no início do dia em UTC.
 * Lança BadRequestException se a data for inválida.
 */
export function parseAppDay(day: string): Date {
  const start = new Date(day + 'T00:00:00.000Z');
  if (isNaN(start.getTime())) throw new BadRequestException('Data inválida');
  return start;
}

/**
 * Janela [start, end) de um único dia em UTC, a partir de 'YYYY-MM-DD'.
 */
export function appDayRange(day: string): { start: Date; end: Date } {
  const start = parseAppDay(day);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
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
