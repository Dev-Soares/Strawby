import type { PlanPublic } from '../../plan/types';
import type { MealPublic } from '../../meal/types';

export type PlanPdfData = {
  plan: PlanPublic;
  meals: MealPublic[];
  patientName: string;
  nutritionistName: string;
  generatedAt?: Date;
  logoBase64?: string;
};

const MEAL_CONFIG: Record<string, { label: string; accent: string; light: string; accentText: string; icon: string }> = {
  breakfast: { label: 'Café da manhã', accent: '#ea580c', light: '#fed7aa', accentText: '#c2410c', icon: 'ph-coffee' },
  lunch:     { label: 'Almoço',        accent: '#16a34a', light: '#bbf7d0', accentText: '#15803d', icon: 'ph-fork-knife' },
  snack:     { label: 'Lanche',        accent: '#2563eb', light: '#bfdbfe', accentText: '#1d4ed8', icon: 'ph-leaf' },
  dinner:    { label: 'Jantar',        accent: '#9333ea', light: '#e9d5ff', accentText: '#7e22ce', icon: 'ph-moon' },
  supper:    { label: 'Ceia',          accent: '#475569', light: '#cbd5e1', accentText: '#334155', icon: 'ph-cookie' },
};

const FALLBACK = { label: 'Refeição', accent: '#475569', light: '#cbd5e1', accentText: '#334155', icon: 'ph-bowl-food' };

function macroBar(pct: number, color: string): string {
  return `
    <div style="height:6px;background:#f1f5f9;border-radius:99px;overflow:hidden;margin-top:10px;">
      <div style="height:100%;width:${Math.min(pct, 100)}%;background:${color};border-radius:99px;"></div>
    </div>`;
}

function chip(label: string, value: number, accent: string, light: string, accentText: string): string {
  return `<span style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;padding:6px 14px;border-radius:99px;background:${light};color:${accentText};">${value}g ${label}</span>`;
}

function foodItem(name: string, qty: number, cal: number): string {
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;">
      <div>
        <p style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;color:#0f172a;margin:0;">${name}</p>
        <p style="font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;color:#94a3b8;margin:0;">${Math.round(qty)}g</p>
      </div>
      <span style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:#475569;">${Math.round(cal)} kcal</span>
    </div>`;
}

function mealCard(meal: MealPublic): string {
  const cfg = MEAL_CONFIG[meal.mealType ?? ''] ?? FALLBACK;
  const kcal = Math.round(meal.totals.calories);

  const items: string[] = [];
  for (const item of meal.items) {
    const name = item.food?.name ?? item.privateFood?.name ?? '—';
    items.push(foodItem(name, item.quantity, item.calories));
  }
  for (const recipe of meal.recipes) {
    const recalc = recipe.items.reduce((a, i) => a + i.calories, 0);
    items.push(foodItem(recipe.name, recipe.items.reduce((a, i) => a + i.quantity, 0), recalc));
  }

  return `
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:16px;">
      <!-- Card body -->
      <div style="padding:18px 20px;">
        <!-- Top row: icon + name -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div style="width:44px;height:44px;border-radius:12px;background:${cfg.light};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="ph-bold ${cfg.icon}" style="font-size:20px;color:${cfg.accentText};"></i>
          </div>
          <div>
            <span style="font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">${cfg.label}</span>
            ${meal.time ? `<p style="font-family:'Outfit',sans-serif;font-size:12px;color:#94a3b8;margin:0;">${meal.time}</p>` : ''}
          </div>
        </div>

        <!-- Kcal -->
        <div style="margin-bottom:12px;">
          <span style="font-family:'Outfit',sans-serif;font-size:42px;font-weight:900;color:${cfg.accent};line-height:1;">${kcal}</span>
          <span style="font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;color:#94a3b8;margin-left:6px;">kcal</span>
        </div>

        <!-- Macro chips -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${chip('Proteína', Math.round(meal.totals.protein), cfg.accent, cfg.light, cfg.accentText)}
          ${chip('Carbos', Math.round(meal.totals.carbs), cfg.accent, cfg.light, cfg.accentText)}
          ${chip('Gordura', Math.round(meal.totals.fat), cfg.accent, cfg.light, cfg.accentText)}
        </div>
      </div>

      ${items.length > 0 ? `
      <!-- Food list -->
      <div style="border-top:1px solid #f1f5f9;padding:4px 20px 12px;">
        ${items.join('')}
      </div>` : ''}
    </div>`;
}

export function buildPlanHtml(data: PlanPdfData): string {
  const { plan, meals, patientName, nutritionistName, generatedAt = new Date(), logoBase64 } = data;
  const logoSrc = logoBase64 ? `data:image/png;base64,${logoBase64}` : null;

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
  <title>Plano de ${patientName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff;
      color: #0f172a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body style="padding:40px 44px;max-width:880px;margin:0 auto;">

  <!-- Red accent top bar -->
  <div style="height:4px;background:#dc2626;border-radius:99px;margin-bottom:32px;"></div>

  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:32px;">
    <div>
      <p style="font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px;">Plano Alimentar</p>
      <h1 style="font-family:'Outfit',sans-serif;font-size:30px;font-weight:900;color:#0f172a;line-height:1.1;margin-bottom:5px;">${patientName}</h1>
      <p style="font-family:'Outfit',sans-serif;font-size:13px;color:#64748b;">Nutricionista: <strong style="color:#334155;">${nutritionistName}</strong></p>
    </div>
    <div style="text-align:right;">
      <!-- Logo -->
      <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-bottom:8px;">
        ${logoSrc ? `<img src="${logoSrc}" alt="Strawby" style="width:32px;height:32px;object-fit:contain;" />` : ''}
        <span style="font-family:'Outfit',sans-serif;font-size:22px;font-weight:900;color:#0f172a;letter-spacing:-0.02em;">Strawby</span>
      </div>
      <p style="font-family:'Outfit',sans-serif;font-size:11px;color:#94a3b8;">Gerado em ${dateStr}</p>
    </div>
  </div>

  <!-- Macro summary: 2-column like PlanPage -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:36px;">

    <!-- Left: Calorie card -->
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:20px;padding:24px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px;">
        <i class="ph-bold ph-fire" style="font-size:16px;color:#dc2626;"></i>
        <span style="font-family:'Outfit',sans-serif;font-size:10px;font-weight:800;color:#dc2626;text-transform:uppercase;letter-spacing:0.1em;">Meta calórica diária</span>
      </div>
      <p style="font-family:'Outfit',sans-serif;font-size:64px;font-weight:900;color:#0f172a;line-height:1;letter-spacing:-0.02em;">${Math.round(plan.calories).toLocaleString('pt-BR')}</p>
      <p style="font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;color:#64748b;margin-top:4px;">kcal por dia</p>
    </div>

    <!-- Right: 3 macro cards stacked -->
    <div style="display:flex;flex-direction:column;gap:10px;">

      <!-- Protein -->
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:14px 18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
            <span style="font-family:'Outfit',sans-serif;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Proteína</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:2px;">
            <span style="font-family:'Outfit',sans-serif;font-size:22px;font-weight:900;color:#0f172a;">${Math.round(plan.protein)}</span>
            <span style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:#94a3b8;">g</span>
          </div>
        </div>
        ${macroBar(protPct, '#f59e0b')}
      </div>

      <!-- Carbs -->
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:14px 18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:50%;background:#3b82f6;display:inline-block;"></span>
            <span style="font-family:'Outfit',sans-serif;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Carboidratos</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:2px;">
            <span style="font-family:'Outfit',sans-serif;font-size:22px;font-weight:900;color:#0f172a;">${Math.round(plan.carbs)}</span>
            <span style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:#94a3b8;">g</span>
          </div>
        </div>
        ${macroBar(carbsPct, '#3b82f6')}
      </div>

      <!-- Fat -->
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:14px 18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:10px;height:10px;border-radius:50%;background:#a855f7;display:inline-block;"></span>
            <span style="font-family:'Outfit',sans-serif;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Gordura</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:2px;">
            <span style="font-family:'Outfit',sans-serif;font-size:22px;font-weight:900;color:#0f172a;">${Math.round(plan.fat)}</span>
            <span style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:#94a3b8;">g</span>
          </div>
        </div>
        ${macroBar(fatPct, '#a855f7')}
      </div>
    </div>
  </div>

  <!-- Divider -->
  <div style="height:1px;background:#f1f5f9;margin-bottom:24px;"></div>

  <!-- Meals header -->
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
    <h2 style="font-family:'Outfit',sans-serif;font-size:18px;font-weight:900;color:#0f172a;">Refeições planejadas</h2>
    <span style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:#94a3b8;">${sortedMeals.length} ${sortedMeals.length !== 1 ? 'refeições' : 'refeição'}</span>
  </div>

  <!-- Meal cards -->
  ${sortedMeals.map(mealCard).join('')}

  <!-- Footer -->
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;">
    <p style="font-family:'Outfit',sans-serif;font-size:11px;color:#cbd5e1;">Uso exclusivo do paciente e nutricionista responsável.</p>
    <p style="font-family:'Outfit',sans-serif;font-size:11px;color:#cbd5e1;">Strawby © ${new Date().getFullYear()}</p>
  </div>

</body>
</html>`;
}
