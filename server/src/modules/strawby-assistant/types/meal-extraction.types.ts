import { z } from 'zod';

const mealTypeSchema = z.enum([
  'breakfast',
  'lunch',
  'snack',
  'dinner',
  'supper',
]);

const preparationSchema = z.enum([
  'cru',
  'cozido',
  'grelhado',
  'assado',
  'frito',
  'refogado',
]);

export const assistantExtractedItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  /**
   * Como o alimento foi consumido. Campo próprio em vez de adjetivo colado no
   * `name` porque a busca precisa dele separado: arroz cru tem 358 kcal/100g
   * contra 128 do cozido, e sem esse sinal o banco entrega sempre o cru.
   */
  preparation: preparationSchema.nullable(),
});

export const assistantExtractedMealSchema = z.object({
  name: z.string().min(1),
  mealType: mealTypeSchema.nullable(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable(),
  observations: z.string().nullable(),
  /**
   * Sem `.min(1)`: o prompt manda devolver lista vazia quando a mensagem não
   * tem comida ("não comi nada hoje"), e exigir um item aqui fazia a validação
   * do schema falhar 3 vezes e devolver "Erro ao gerar objeto com IA" — além
   * de tornar inalcançável o tratamento de `items.length === 0` que já existe
   * em `previewMealFromMessage`.
   */
  items: z.array(assistantExtractedItemSchema),
});

export type AssistantExtractedItem = z.infer<
  typeof assistantExtractedItemSchema
>;

export type AssistantExtractedMeal = z.infer<
  typeof assistantExtractedMealSchema
>;
