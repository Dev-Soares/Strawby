import type { PlanPublic } from '../../plan/types';
import type { MealPublic } from '../../meal/types';

export type PlanPdfData = {
  plan: PlanPublic;
  meals: MealPublic[];
  patientName: string;
  nutritionistName: string;
  generatedAt?: Date;
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  lunch: 'Almoço',
  snack: 'Lanche',
  dinner: 'Jantar',
  supper: 'Ceia',
};

const MEAL_TYPE_COLORS: Record<string, string> = {
  breakfast: '#ea580c',
  lunch: '#16a34a',
  snack: '#2563eb',
  dinner: '#9333ea',
  supper: '#475569',
};

function macroBar(value: number, max: number, color: string): string {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return `
    <div style="height:6px;background:#f1f5f9;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${pct}%;background:${color};border-radius:99px;"></div>
    </div>`;
}

function foodRow(name: string, qty: number, cal: number, prot: number, carbs: number, fat: number): string {
  return `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9;">${name}</td>
      <td style="padding:8px 12px;font-size:13px;color:#64748b;text-align:right;border-bottom:1px solid #f1f5f9;">${qty}g</td>
      <td style="padding:8px 12px;font-size:13px;color:#dc2626;font-weight:700;text-align:right;border-bottom:1px solid #f1f5f9;">${Math.round(cal)}</td>
      <td style="padding:8px 12px;font-size:13px;color:#d97706;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${Math.round(prot)}g</td>
      <td style="padding:8px 12px;font-size:13px;color:#2563eb;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${Math.round(carbs)}g</td>
      <td style="padding:8px 12px;font-size:13px;color:#9333ea;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${Math.round(fat)}g</td>
    </tr>`;
}

function mealSection(meal: MealPublic): string {
  const color = MEAL_TYPE_COLORS[meal.mealType ?? ''] ?? '#64748b';
  const label = MEAL_TYPE_LABELS[meal.mealType ?? ''] ?? meal.name;

  const rows: string[] = [];

  for (const item of meal.items) {
    const name = item.food?.name ?? item.privateFood?.name ?? '—';
    rows.push(foodRow(name, item.quantity, item.calories, item.protein, item.carbs, item.fat));
  }

  for (const recipe of meal.recipes) {
    const recipeTotals = recipe.items.reduce(
      (acc, i) => ({ cal: acc.cal + i.calories, prot: acc.prot + i.protein, carbs: acc.carbs + i.carbs, fat: acc.fat + i.fat }),
      { cal: 0, prot: 0, carbs: 0, fat: 0 },
    );
    const totalQty = recipe.items.reduce((s, i) => s + i.quantity, 0);
    rows.push(foodRow(`🍽 ${recipe.name}`, totalQty, recipeTotals.cal, recipeTotals.prot, recipeTotals.carbs, recipeTotals.fat));
  }

  return `
    <div style="margin-bottom:28px;border-radius:16px;overflow:hidden;border:1px solid #f1f5f9;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
      <!-- Meal header -->
      <div style="background:${color}12;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid ${color}30;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:10px;height:10px;border-radius:50%;background:${color};"></div>
          <span style="font-size:15px;font-weight:800;color:${color};">${label}</span>
          ${meal.time ? `<span style="font-size:12px;color:#94a3b8;font-weight:500;">${meal.time}</span>` : ''}
        </div>
        <div style="display:flex;gap:16px;align-items:baseline;">
          <span style="font-size:20px;font-weight:900;color:${color};">${Math.round(meal.totals.calories)}</span>
          <span style="font-size:12px;color:#94a3b8;font-weight:600;">kcal</span>
          <span style="font-size:12px;color:#d97706;font-weight:700;">P ${Math.round(meal.totals.protein)}g</span>
          <span style="font-size:12px;color:#2563eb;font-weight:700;">C ${Math.round(meal.totals.carbs)}g</span>
          <span style="font-size:12px;color:#9333ea;font-weight:700;">G ${Math.round(meal.totals.fat)}g</span>
        </div>
      </div>

      <!-- Foods table -->
      ${rows.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:8px 12px;font-size:11px;font-weight:700;color:#94a3b8;text-align:left;text-transform:uppercase;letter-spacing:0.05em;">Alimento</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;color:#94a3b8;text-align:right;text-transform:uppercase;letter-spacing:0.05em;">Qtd</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;color:#dc2626;text-align:right;text-transform:uppercase;letter-spacing:0.05em;">Kcal</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;color:#d97706;text-align:right;text-transform:uppercase;letter-spacing:0.05em;">Prot</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;color:#2563eb;text-align:right;text-transform:uppercase;letter-spacing:0.05em;">Carb</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;color:#9333ea;text-align:right;text-transform:uppercase;letter-spacing:0.05em;">Gord</th>
          </tr>
        </thead>
        <tbody>${rows.join('')}</tbody>
      </table>` : `
      <p style="padding:16px 20px;font-size:13px;color:#94a3b8;">Nenhum alimento adicionado.</p>`}
    </div>`;
}

export function buildPlanHtml(data: PlanPdfData): string {
  const { plan, meals, patientName, nutritionistName, generatedAt = new Date() } = data;

  const sortedMeals = [...meals].sort((a, b) => {
    const order = ['breakfast', 'lunch', 'snack', 'dinner', 'supper'];
    return order.indexOf(a.mealType ?? '') - order.indexOf(b.mealType ?? '');
  });

  const dateStr = generatedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const protPct = Math.round(((plan.protein * 4) / plan.calories) * 100);
  const carbsPct = Math.round(((plan.carbs * 4) / plan.calories) * 100);
  const fatPct = Math.round(((plan.fat * 9) / plan.calories) * 100);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plano Alimentar — ${patientName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: #fff; color: #0f172a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body style="padding:40px 48px;max-width:900px;margin:0 auto;">

  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:36px;padding-bottom:24px;border-bottom:2px solid #f1f5f9;">
    <div>
      <div style="font-size:11px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Plano Alimentar</div>
      <h1 style="font-size:28px;font-weight:900;color:#0f172a;line-height:1.1;margin-bottom:4px;">${patientName}</h1>
      <p style="font-size:13px;color:#64748b;">Nutricionista: <strong style="color:#334155;">${nutritionistName}</strong></p>
    </div>
    <div style="text-align:right;">
      <div style="width:48px;height:48px;background:#dc2626;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-left:auto;margin-bottom:8px;">
        <span style="color:#fff;font-size:22px;font-weight:900;line-height:1;">S</span>
      </div>
      <p style="font-size:11px;color:#94a3b8;">Gerado em ${dateStr}</p>
    </div>
  </div>

  <!-- Macro summary cards -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:36px;">

    <!-- Calories -->
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:14px;padding:18px 16px;">
      <p style="font-size:10px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Meta calórica</p>
      <p style="font-size:30px;font-weight:900;color:#0f172a;line-height:1;">${Math.round(plan.calories).toLocaleString('pt-BR')}</p>
      <p style="font-size:12px;color:#dc2626;font-weight:600;margin-top:2px;">kcal / dia</p>
    </div>

    <!-- Protein -->
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:18px 16px;">
      <p style="font-size:10px;font-weight:800;color:#d97706;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Proteína</p>
      <p style="font-size:30px;font-weight:900;color:#0f172a;line-height:1;">${Math.round(plan.protein)}<span style="font-size:14px;font-weight:600;color:#64748b;">g</span></p>
      <p style="font-size:12px;color:#d97706;font-weight:600;margin-top:2px;">${protPct}% das calorias</p>
      ${macroBar(protPct, 100, '#f59e0b')}
    </div>

    <!-- Carbs -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:18px 16px;">
      <p style="font-size:10px;font-weight:800;color:#2563eb;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Carboidratos</p>
      <p style="font-size:30px;font-weight:900;color:#0f172a;line-height:1;">${Math.round(plan.carbs)}<span style="font-size:14px;font-weight:600;color:#64748b;">g</span></p>
      <p style="font-size:12px;color:#2563eb;font-weight:600;margin-top:2px;">${carbsPct}% das calorias</p>
      ${macroBar(carbsPct, 100, '#3b82f6')}
    </div>

    <!-- Fat -->
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:18px 16px;">
      <p style="font-size:10px;font-weight:800;color:#9333ea;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Gordura</p>
      <p style="font-size:30px;font-weight:900;color:#0f172a;line-height:1;">${Math.round(plan.fat)}<span style="font-size:14px;font-weight:600;color:#64748b;">g</span></p>
      <p style="font-size:12px;color:#9333ea;font-weight:600;margin-top:2px;">${fatPct}% das calorias</p>
      ${macroBar(fatPct, 100, '#a855f7')}
    </div>
  </div>

  <!-- Section title -->
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
    <h2 style="font-size:17px;font-weight:800;color:#0f172a;">Refeições do plano</h2>
    <span style="font-size:12px;font-weight:600;color:#94a3b8;">${sortedMeals.length} refeição${sortedMeals.length !== 1 ? 'ões' : ''}</span>
  </div>

  <!-- Meals -->
  ${sortedMeals.map(mealSection).join('')}

  <!-- Footer -->
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;">
    <p style="font-size:11px;color:#cbd5e1;">Este documento é de uso exclusivo do paciente e do nutricionista responsável.</p>
    <p style="font-size:11px;color:#cbd5e1;">Strawby © ${new Date().getFullYear()}</p>
  </div>

</body>
</html>`;
}
