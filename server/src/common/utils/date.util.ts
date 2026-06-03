const APP_TIMEZONE = 'America/Sao_Paulo';

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
