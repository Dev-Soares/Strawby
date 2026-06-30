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

const ICON_PATHS: Record<string, string> = {
  fire: 'M177.62,159.6a52,52,0,0,1-34,34,12.2,12.2,0,0,1-3.6.55,12,12,0,0,1-3.6-23.45,28,28,0,0,0,18.32-18.32,12,12,0,0,1,22.9,7.2ZM220,144a92,92,0,0,1-184,0c0-28.81,11.27-58.18,33.48-87.28a12,12,0,0,1,17.9-1.33L107.07,74.5,127,19.89a12,12,0,0,1,18.94-5.12C168.2,33.25,220,82.85,220,144Zm-24,0c0-41.71-30.61-78.39-52.52-99.29l-20.21,55.4a12,12,0,0,1-19.63,4.5L80.71,82.36C67,103.38,60,124.06,60,144a68,68,0,0,0,136,0Z',
  coffee:
    'M212,76H32A12,12,0,0,0,20,88v48a100.24,100.24,0,0,0,26.73,68H32a12,12,0,0,0,0,24H208a12,12,0,0,0,0-24H193.27a100.75,100.75,0,0,0,20-32A44,44,0,0,0,256,128v-8A44.05,44.05,0,0,0,212,76Zm-16,60a76.27,76.27,0,0,1-42,68H86a76.27,76.27,0,0,1-42-68V100H196Zm36-8a20,20,0,0,1-12.57,18.55A97.17,97.17,0,0,0,220,136V101.68A20,20,0,0,1,232,120ZM68,48V24a12,12,0,0,1,24,0V48a12,12,0,0,1-24,0Zm40,0V24a12,12,0,0,1,24,0V48a12,12,0,0,1-24,0Zm40,0V24a12,12,0,0,1,24,0V48a12,12,0,0,1-24,0Z',
  forkKnife:
    'M68,88V40a12,12,0,0,1,24,0V88a12,12,0,0,1-24,0ZM220,40V224a12,12,0,0,1-24,0V180H152a12,12,0,0,1-12-12,273.23,273.23,0,0,1,7.33-57.82C157.42,68.42,176.76,40.33,203.27,29A12,12,0,0,1,220,40ZM196,62.92C182.6,77,175,98,170.77,115.38A254.41,254.41,0,0,0,164.55,156H196ZM128,39A12,12,0,0,0,104,41l4,47.46a28,28,0,0,1-56,0L56,41A12,12,0,1,0,32,39L28,87c0,.34,0,.67,0,1a52.1,52.1,0,0,0,40,50.59V224a12,12,0,0,0,24,0V138.59A52.1,52.1,0,0,0,132,88c0-.33,0-.66,0-1Z',
  leaf: 'M227.42,39.86a12,12,0,0,0-11.28-11.28c-39.6-2.33-74.59,2.34-104,13.87C84,53.48,62.31,70.58,49.39,91.9c-17.62,29.11-17.66,64.45-.45,98.19L31.51,207.52a12,12,0,0,0,17,17l17.43-17.43c16.74,8.54,33.88,12.85,50.45,12.85a91.31,91.31,0,0,0,47.74-13.3c21.32-12.92,38.42-34.62,49.45-62.75C225.08,114.46,229.75,79.46,227.42,39.86ZM151.66,186.08C131.57,198.25,108,199.17,83.94,189l84.54-84.54a12,12,0,1,0-17-17L67,172.06c-10.14-24-9.22-47.63,3-67.72,20.91-34.53,70.54-53.72,134-52.25C205.38,115.53,186.19,165.17,151.66,186.08Z',
  moon: 'M236.37,139.4a12,12,0,0,0-12-3A84.07,84.07,0,0,1,119.6,31.59a12,12,0,0,0-15-15A108.86,108.86,0,0,0,49.69,55.07,108,108,0,0,0,136,228a107.09,107.09,0,0,0,64.93-21.69,108.86,108.86,0,0,0,38.44-54.94A12,12,0,0,0,236.37,139.4Zm-49.88,47.74A84,84,0,0,1,68.86,69.51,84.93,84.93,0,0,1,92.27,48.29Q92,52.13,92,56A108.12,108.12,0,0,0,200,164q3.87,0,7.71-.27A84.79,84.79,0,0,1,186.49,187.14Z',
  cookie:
    'M167.31,160.69a16,16,0,1,1-22.62,0A16,16,0,0,1,167.31,160.69Zm-86.62-8a16,16,0,1,0,22.62,0A16,16,0,0,0,80.69,152.69Zm14.62-33.38a16,16,0,1,0-22.62,0A16,16,0,0,0,95.31,119.31Zm48-6.62a16,16,0,1,0,0,22.62A16,16,0,0,0,143.31,112.69ZM236,128A108,108,0,1,1,128,20a12,12,0,0,1,12,12,36,36,0,0,0,36,36,12,12,0,0,1,12,12,36,36,0,0,0,36,36A12,12,0,0,1,236,128Zm-24.67,10.65A60.17,60.17,0,0,1,165,91a60.17,60.17,0,0,1-47.66-46.32,84,84,0,1,0,94,94Z',
  bowlFood:
    'M224,100h-4.78a92,92,0,0,0-182.44,0H32a12,12,0,0,0-12,12,108.38,108.38,0,0,0,56,94.68V208a20,20,0,0,0,20,20h64a20,20,0,0,0,20-20v-1.32A108.38,108.38,0,0,0,236,112,12,12,0,0,0,224,100ZM170.29,60.06A92,92,0,0,0,127.19,100H106a68.27,68.27,0,0,1,62-40C168.76,60,169.52,60,170.29,60.06Zm17.22,19.08A67.66,67.66,0,0,1,194.92,100H156.13A67.91,67.91,0,0,1,187.51,79.14ZM128,44c.83,0,1.65,0,2.48.06A92.3,92.3,0,0,0,80.37,100H61.08A68.1,68.1,0,0,1,128,44Zm35,144.39a12,12,0,0,0-7,10.91V204H100v-4.7a12,12,0,0,0-7-10.91A84.32,84.32,0,0,1,44.87,124H211.13A84.32,84.32,0,0,1,163,188.39Z',
};

function iconSvg(
  name: keyof typeof ICON_PATHS,
  size: number,
  color: string,
): string {
  const d = ICON_PATHS[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" fill="${color}"><path d="${d}"/></svg>`;
}

const MEAL_CONFIG: Record<
  string,
  {
    label: string;
    accent: string;
    light: string;
    accentText: string;
    icon: keyof typeof ICON_PATHS;
  }
> = {
  breakfast: {
    label: 'Café da manhã',
    accent: '#ea580c',
    light: '#fed7aa',
    accentText: '#c2410c',
    icon: 'coffee',
  },
  lunch: {
    label: 'Almoço',
    accent: '#16a34a',
    light: '#bbf7d0',
    accentText: '#15803d',
    icon: 'forkKnife',
  },
  snack: {
    label: 'Lanche',
    accent: '#2563eb',
    light: '#bfdbfe',
    accentText: '#1d4ed8',
    icon: 'leaf',
  },
  dinner: {
    label: 'Jantar',
    accent: '#9333ea',
    light: '#e9d5ff',
    accentText: '#7e22ce',
    icon: 'moon',
  },
  supper: {
    label: 'Ceia',
    accent: '#475569',
    light: '#cbd5e1',
    accentText: '#334155',
    icon: 'cookie',
  },
};

const FALLBACK = {
  label: 'Refeição',
  accent: '#475569',
  light: '#cbd5e1',
  accentText: '#334155',
  icon: 'bowlFood' as keyof typeof ICON_PATHS,
};

function macroBar(pct: number, color: string): string {
  return `
    <div style="height:6px;background:#f1f5f9;border-radius:99px;overflow:hidden;margin-top:10px;">
      <div style="height:100%;width:${Math.min(pct, 100)}%;background:${color};border-radius:99px;"></div>
    </div>`;
}

function chip(
  label: string,
  value: number,
  accent: string,
  light: string,
  accentText: string,
): string {
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
    items.push(
      foodItem(
        recipe.name,
        recipe.items.reduce((a, i) => a + i.quantity, 0),
        recalc,
      ),
    );
  }

  return `
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);margin-bottom:16px;">
      <!-- Card body -->
      <div style="padding:18px 20px;">
        <!-- Top row: icon + name -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div style="width:44px;height:44px;border-radius:12px;background:${cfg.light};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${iconSvg(cfg.icon, 22, cfg.accentText)}
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

      ${
        items.length > 0
          ? `
      <!-- Food list -->
      <div style="border-top:1px solid #f1f5f9;padding:4px 20px 12px;">
        ${items.join('')}
      </div>`
          : ''
      }
    </div>`;
}

export function buildPlanHtml(data: PlanPdfData): string {
  const {
    plan,
    meals,
    patientName,
    nutritionistName,
    generatedAt = new Date(),
    logoBase64,
  } = data;
  const logoSrc = logoBase64 ? `data:image/png;base64,${logoBase64}` : null;

  const sortedMeals = [...meals].sort((a, b) => {
    const order = ['breakfast', 'lunch', 'snack', 'dinner', 'supper'];
    return order.indexOf(a.mealType ?? '') - order.indexOf(b.mealType ?? '');
  });

  const dateStr = generatedAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const protPct = Math.round(((plan.protein * 4) / plan.calories) * 100);
  const carbsPct = Math.round(((plan.carbs * 4) / plan.calories) * 100);
  const fatPct = Math.round(((plan.fat * 9) / plan.calories) * 100);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Plano de ${patientName}</title>
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
        ${iconSvg('fire', 16, '#dc2626')}
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
