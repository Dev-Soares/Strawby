import type { FoodPublic } from '../../food/types';
import type { FoodService } from '../../food/food.service';

const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map<
  string,
  { result: FoodPublic | null; expiresAt: number }
>();

const SOURCE_PRIORITY: Record<string, number> = {
  TACO: 1,
  TBCA: 2,
  IBGE_POF: 3,
  USDA_FOUNDATION: 4,
  USDA_SR_LEGACY: 5,
  CNF: 6,
  LIVS: 7,
  MANUAL: 8,
  OFF: 9,
};

const BRAND_STOPWORDS = [
  'nestle',
  'bauducco',
  'lider',
  'vigor',
  'danone',
  'yakult',
  'oreo',
  'mcdonalds',
  'kfc',
  'subway',
  'pizza hut',
  'dominos',
  'swift',
  'sadia',
  'perdigao',
  'perdigão',
  'seara',
  'aurora',
  'frimesa',
  'marba',
  'catupiry',
  'taeq',
  'carrefour',
  'tio joao',
  'tio joão',
  'camil',
  'urbano',
  'primor',
  'elefante',
  'coamo',
  'tirol',
  'batavo',
  'dore',
  'becel',
  'qualy',
  'wafer',
  'recheio',
  'biscoito recheado',
  'salgadinho',
  'batata frita embalada',
  'coca',
  'pepsi',
  'guarana',
  'suco em po',
  'achocolatado em po',
  'leite condensado',
  'creme de leite',
  'granola keto',
  'barra de cereal',
  'protein bar',
  'salpicao',
  'salpicão',
  'empanado',
  'nuggets',
  'hamburguer congelado',
];

function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function isIndustrializedOrBrand(name: string): boolean {
  const normalized = normalize(name);
  return BRAND_STOPWORDS.some((term) => normalized.includes(term));
}

function sourcePriority(source: string): number {
  return SOURCE_PRIORITY[source] ?? 99;
}

export async function findPublicFoodMatch(
  name: string,
  food: FoodService,
): Promise<FoodPublic | null> {
  const trimmed = name.trim();
  if (trimmed.length < 2) return null;

  const cacheKey = normalize(trimmed);

  if (cache.size > 1000) cleanExpiredEntries();

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  const match = await searchPublicFoodMatch(trimmed, food);
  cache.set(cacheKey, { result: match, expiresAt: Date.now() + CACHE_TTL_MS });
  return match;
}

async function searchPublicFoodMatch(
  name: string,
  food: FoodService,
): Promise<FoodPublic | null> {
  const results = await food.search(name);
  if (results.length === 0) return null;

  const normalizedName = normalize(name);

  const exact = results.find((f) => normalize(f.name) === normalizedName);
  if (exact && !isIndustrializedOrBrand(exact.name)) return exact;

  const contains = results.find(
    (f) =>
      normalize(f.name).includes(normalizedName) &&
      !isIndustrializedOrBrand(f.name),
  );
  if (contains) return contains;

  const sortedBySource = results
    .filter((f) => !isIndustrializedOrBrand(f.name))
    .sort((a, b) => sourcePriority(a.source) - sourcePriority(b.source));

  if (sortedBySource.length > 0) return sortedBySource[0];

  return null;
}
