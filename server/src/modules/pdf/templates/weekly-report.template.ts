import type { PlanPublic } from '../../plan/types';
import type { MealPublic } from '../../meal/types';

export type WeeklyReportDay = {
  date: Date;
  score: number | null;
  meals: MealPublic[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
};

export type WeeklyReportPdfData = {
  patientName: string;
  nutritionistName: string;
  weekStart: Date;
  weekEnd: Date;
  plan: PlanPublic | null;
  days: WeeklyReportDay[];
  generatedAt?: Date;
};

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DAY_NAMES_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function scoreColor(score: number): string {
  if (score >= 0.85) return '#16a34a';
  if (score >= 0.65) return '#d97706';
  return '#dc2626';
}

function scoreBg(score: number): string {
  if (score >= 0.85) return '#f0fdf4';
  if (score >= 0.65) return '#fffbeb';
  return '#fef2f2';
}

function scoreBorder(score: number): string {
  if (score >= 0.85) return '#bbf7d0';
  if (score >= 0.65) return '#fde68a';
  return '#fecaca';
}

function scoreLabel(score: number): string {
  if (score >= 0.9) return 'Excelente';
  if (score >= 0.75) return 'Bom';
  if (score >= 0.6) return 'Regular';
  return 'Fraco';
}

function pct(actual: number, goal: number): number {
  if (!goal) return 0;
  return Math.min(Math.round((actual / goal) * 100), 100);
}

function miniBar(actual: number, goal: number, color: string): string {
  const p = pct(actual, goal);
  return `
    <div style="flex:1;height:5px;background:#f1f5f9;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${p}%;background:${color};border-radius:99px;"></div>
    </div>`;
}

function macroChip(label: string, actual: number, goal: number | undefined, color: string): string {
  const p = goal ? pct(actual, goal) : null;
  return `
    <div style="display:flex;flex-direction:column;gap:4px;flex:1;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span style="font-size:10px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.05em;">${label}</span>
        <span style="font-size:11px;font-weight:700;color:#334155;">${Math.round(actual)}g${goal ? ` <span style="color:#94a3b8;font-weight:500;">/ ${Math.round(goal)}g</span>` : ''}</span>
      </div>
      ${goal ? miniBar(actual, goal, color) : ''}
    </div>`;
}

function dayRow(day: WeeklyReportDay, plan: PlanPublic | null): string {
  const name = DAY_NAMES_FULL[day.date.getUTCDay()];
  const dateStr = day.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
  const score = day.score;
  const hasMeals = day.meals.length > 0;

  if (!hasMeals && score === null) {
    return `
      <div style="display:flex;align-items:center;gap:16px;padding:14px 20px;border-radius:12px;background:#f8fafc;border:1px solid #f1f5f9;margin-bottom:8px;opacity:0.6;">
        <div style="width:44px;text-align:center;">
          <p style="font-size:12px;font-weight:700;color:#94a3b8;">${DAY_NAMES[day.date.getUTCDay()]}</p>
          <p style="font-size:11px;color:#cbd5e1;">${dateStr}</p>
        </div>
        <div style="flex:1;">
          <p style="font-size:12px;color:#94a3b8;">Sem registro</p>
        </div>
        <div style="width:64px;height:64px;border-radius:50%;background:#f1f5f9;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:11px;font-weight:600;color:#cbd5e1;">—</span>
        </div>
      </div>`;
  }

  const sc = score ?? 0;
  const col = scoreColor(sc);
  const bg = scoreBg(sc);
  const border = scoreBorder(sc);

  return `
    <div style="padding:16px 20px;border-radius:12px;background:${bg};border:1px solid ${border};margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:${hasMeals ? '14px' : '0'};">
        <!-- Day label -->
        <div style="width:44px;text-align:center;flex-shrink:0;">
          <p style="font-size:13px;font-weight:800;color:#0f172a;">${DAY_NAMES[day.date.getUTCDay()]}</p>
          <p style="font-size:11px;color:#64748b;">${dateStr}</p>
        </div>

        <!-- Macros summary -->
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <div style="display:flex;align-items:baseline;gap:6px;">
            <span style="font-size:18px;font-weight:900;color:#0f172a;">${Math.round(day.totals.calories).toLocaleString('pt-BR')}</span>
            <span style="font-size:11px;color:#64748b;font-weight:600;">kcal</span>
            ${plan ? `<span style="font-size:11px;color:#94a3b8;">/ ${Math.round(plan.calories).toLocaleString('pt-BR')} meta</span>` : ''}
          </div>
          ${plan ? `
          <div style="height:4px;background:#e2e8f0;border-radius:99px;overflow:hidden;max-width:200px;">
            <div style="height:100%;width:${pct(day.totals.calories, plan.calories)}%;background:${col};border-radius:99px;"></div>
          </div>` : ''}
        </div>

        <!-- Score circle -->
        <div style="width:60px;height:60px;border-radius:50%;background:${col}18;border:2px solid ${col}40;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="font-size:15px;font-weight:900;color:${col};line-height:1;">${Math.round(sc * 100)}</span>
          <span style="font-size:9px;font-weight:700;color:${col};opacity:0.8;">%</span>
        </div>
      </div>

      ${hasMeals ? `
      <!-- Macros bars -->
      <div style="display:flex;gap:12px;padding-top:10px;border-top:1px solid ${border};">
        ${macroChip('Prot', day.totals.protein, plan?.protein, '#d97706')}
        ${macroChip('Carb', day.totals.carbs, plan?.carbs, '#2563eb')}
        ${macroChip('Gord', day.totals.fat, plan?.fat, '#9333ea')}
        <div style="flex:1;display:flex;flex-direction:column;gap:4px;justify-content:flex-end;">
          <span style="font-size:10px;font-weight:700;color:${col};text-align:right;">${scoreLabel(sc)}</span>
          <span style="font-size:10px;color:#94a3b8;text-align:right;">${day.meals.length} refeição${day.meals.length !== 1 ? 'ões' : ''}</span>
        </div>
      </div>` : ''}
    </div>`;
}

export function buildWeeklyReportHtml(data: WeeklyReportPdfData): string {
  const { patientName, nutritionistName, weekStart, weekEnd, plan, days, generatedAt = new Date() } = data;

  const scoredDays = days.filter((d) => d.score !== null);
  const avgScore = scoredDays.length > 0
    ? scoredDays.reduce((s, d) => s + (d.score ?? 0), 0) / scoredDays.length
    : null;
  const bestDay = scoredDays.length > 0
    ? scoredDays.reduce((a, b) => (b.score ?? 0) > (a.score ?? 0) ? b : a)
    : null;

  const weekStartStr = weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', timeZone: 'UTC' });
  const weekEndStr = weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const generatedStr = generatedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const avgCol = avgScore !== null ? scoreColor(avgScore) : '#94a3b8';
  const avgBg = avgScore !== null ? scoreBg(avgScore) : '#f8fafc';
  const avgBorder = avgScore !== null ? scoreBorder(avgScore) : '#f1f5f9';

  // Score bar per day (mini timeline)
  const scoreTimeline = days.map((d) => {
    const sc = d.score ?? 0;
    const col = d.score !== null ? scoreColor(sc) : '#e2e8f0';
    const h = d.score !== null ? Math.max(Math.round(sc * 48), 4) : 4;
    return `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="height:48px;display:flex;align-items:flex-end;">
          <div style="width:20px;height:${h}px;background:${col};border-radius:4px 4px 0 0;"></div>
        </div>
        <span style="font-size:9px;font-weight:700;color:#64748b;">${DAY_NAMES[d.date.getUTCDay()]}</span>
        <span style="font-size:9px;color:#94a3b8;">${d.score !== null ? Math.round(d.score * 100) + '%' : '—'}</span>
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Relatório Semanal — ${patientName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: #fff; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body style="padding:40px 48px;max-width:860px;margin:0 auto;">

  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #f1f5f9;">
    <div>
      <div style="font-size:11px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Relatório Semanal</div>
      <h1 style="font-size:26px;font-weight:900;color:#0f172a;margin-bottom:4px;">${patientName}</h1>
      <p style="font-size:13px;color:#64748b;">Nutricionista: <strong style="color:#334155;">${nutritionistName}</strong></p>
      <p style="font-size:13px;color:#64748b;margin-top:2px;">${weekStartStr} – ${weekEndStr}</p>
    </div>
    <div style="text-align:right;">
      <div style="width:44px;height:44px;background:#dc2626;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-left:auto;margin-bottom:8px;">
        <span style="color:#fff;font-size:20px;font-weight:900;">S</span>
      </div>
      <p style="font-size:11px;color:#94a3b8;">Gerado em ${generatedStr}</p>
    </div>
  </div>

  <!-- Summary row -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:28px;">

    <!-- Average score -->
    <div style="background:${avgBg};border:1px solid ${avgBorder};border-radius:14px;padding:18px;">
      <p style="font-size:10px;font-weight:800;color:${avgCol};text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Média semanal</p>
      <p style="font-size:36px;font-weight:900;color:#0f172a;line-height:1;">${avgScore !== null ? Math.round(avgScore * 100) : '—'}<span style="font-size:16px;color:#64748b;font-weight:600;">${avgScore !== null ? '%' : ''}</span></p>
      <p style="font-size:12px;color:${avgCol};font-weight:600;margin-top:4px;">${avgScore !== null ? scoreLabel(avgScore) : 'Sem dados'}</p>
    </div>

    <!-- Days tracked -->
    <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:14px;padding:18px;">
      <p style="font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Dias registrados</p>
      <p style="font-size:36px;font-weight:900;color:#0f172a;line-height:1;">${scoredDays.length}<span style="font-size:16px;color:#64748b;font-weight:600;"> / 7</span></p>
      <p style="font-size:12px;color:#64748b;font-weight:600;margin-top:4px;">${Math.round((scoredDays.length / 7) * 100)}% de adesão</p>
    </div>

    <!-- Best day -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:18px;">
      <p style="font-size:10px;font-weight:800;color:#16a34a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Melhor dia</p>
      <p style="font-size:20px;font-weight:900;color:#0f172a;line-height:1.2;margin-bottom:2px;">
        ${bestDay ? DAY_NAMES_FULL[bestDay.date.getUTCDay()] : '—'}
      </p>
      <p style="font-size:12px;color:#16a34a;font-weight:600;">${bestDay ? Math.round((bestDay.score ?? 0) * 100) + '% de aderência' : 'Sem dados'}</p>
    </div>
  </div>

  <!-- Score timeline chart -->
  <div style="background:#f8fafc;border:1px solid #f1f5f9;border-radius:14px;padding:20px;margin-bottom:28px;">
    <p style="font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Aderência por dia</p>
    <div style="display:flex;gap:8px;align-items:flex-end;">
      ${scoreTimeline}
    </div>
  </div>

  <!-- Section title -->
  <h2 style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:14px;">Detalhes por dia</h2>

  <!-- Day rows -->
  ${days.map((d) => dayRow(d, plan)).join('')}

  <!-- Footer -->
  <div style="margin-top:36px;padding-top:16px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;">
    <p style="font-size:11px;color:#cbd5e1;">Documento gerado automaticamente pelo Strawby.</p>
    <p style="font-size:11px;color:#cbd5e1;">Strawby © ${new Date().getFullYear()}</p>
  </div>

</body>
</html>`;
}
