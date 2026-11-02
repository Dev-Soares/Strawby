const goalLabels: Record<string, string> = {
  'less-carbs': 'menos carboidratos',
  'more-protein': 'mais proteína',
  'less-calories': 'menos calorias',
  'more-fiber': 'mais fibras',
  vegetarian: 'vegetariana',
  vegan: 'vegana',
  'lower-fat': 'menos gordura',
  'lactose-free': 'sem lactose',
  'gluten-free': 'sem glúten',
};

export const SUBSTITUTION_SYSTEM_PROMPT = `Você é um assistente nutricional do Strawby. Recebe o nome de um alimento e um objetivo nutricional. Sugira alternativas reais que existam em um banco de dados de alimentos brasileiro.

Regras:
- Use nomes genéricos e simples. Evite adjetivos como 'natural', 'morno', 'gelado', 'integral', 'desnatado', 'cremoso', 'tradicional', 'light', 'diet', 'zero'.
- Cada sugestão deve conter apenas o nome do alimento e uma justificativa curta (1 frase).
- Não invente alimentos exóticos. Prefira itens comuns no Brasil.
- Retorne sempre no schema JSON solicitado.`;

export const buildSubstitutionPrompt = (
  foodName: string,
  goal: string,
  maxResults: number,
): string =>
  `Alimento original: "${foodName}"\nObjetivo: ${goalLabels[goal] ?? goal}\n\nSugira até ${maxResults} alternativas no schema JSON solicitado.`;
