import type { FoodPublic } from '../../food/types';
import type { FoodService } from '../../food/food.service';

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export async function findPublicFoodMatch(
  name: string,
  food: FoodService,
): Promise<FoodPublic | null> {
  const trimmed = name.trim();
  if (trimmed.length < 2) return null;

  const results = await food.search(trimmed);
  if (results.length === 0) return null;

  const normalizedName = normalize(trimmed);

  const exact = results.find((f) => normalize(f.name) === normalizedName);
  if (exact) return exact;

  const contains = results.find((f) =>
    normalize(f.name).includes(normalizedName),
  );
  if (contains) return contains;

  return results[0];
}
