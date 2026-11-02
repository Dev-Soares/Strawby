import type { MealType } from '../types/meal-suggestion.types';

export type SuggestedMealItem = {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type SuggestedMeal = {
  name: string;
  mealType: MealType;
  reason: string;
  items: SuggestedMealItem[];
};

const breakfast: SuggestedMeal[] = [
  {
    name: 'Ovos mexidos com torrada',
    mealType: 'breakfast',
    reason: 'Clássico prático com boa proteína para começar o dia.',
    items: [
      { name: 'Ovos mexidos', quantity: 2, unit: 'un', calories: 140, protein: 12, carbs: 1, fat: 10 },
      { name: 'Pão integral torrado', quantity: 2, unit: 'fatia', calories: 140, protein: 6, carbs: 24, fat: 2 },
      { name: 'Café preto', quantity: 1, unit: 'xícara', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
  },
  {
    name: 'Aveia com banana e mel',
    mealType: 'breakfast',
    reason: 'Energia de liberação gradual com fibras e sabor natural.',
    items: [
      { name: 'Aveia em flocos', quantity: 40, unit: 'g', calories: 150, protein: 5, carbs: 27, fat: 3 },
      { name: 'Banana', quantity: 1, unit: 'un', calories: 90, protein: 1, carbs: 23, fat: 0 },
      { name: 'Mel', quantity: 1, unit: 'colher de chá', calories: 60, protein: 0, carbs: 16, fat: 0 },
    ],
  },
  {
    name: 'Tapioca com queijo branco',
    mealType: 'breakfast',
    reason: 'Leve, sem glúten e rápido de preparar.',
    items: [
      { name: 'Tapioca', quantity: 1, unit: 'un', calories: 120, protein: 0, carbs: 30, fat: 0 },
      { name: 'Queijo branco', quantity: 40, unit: 'g', calories: 100, protein: 8, carbs: 2, fat: 7 },
      { name: 'Café preto', quantity: 1, unit: 'xícara', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
  },
  {
    name: 'Pão com abacate e ovo',
    mealType: 'breakfast',
    reason: 'Combinação de gorduras boas e proteína.',
    items: [
      { name: 'Pão integral', quantity: 2, unit: 'fatia', calories: 140, protein: 6, carbs: 24, fat: 2 },
      { name: 'Abacate', quantity: 50, unit: 'g', calories: 80, protein: 1, carbs: 4, fat: 7 },
      { name: 'Ovo cozido', quantity: 1, unit: 'un', calories: 70, protein: 6, carbs: 0, fat: 5 },
    ],
  },
  {
    name: 'Iogurte com granola e frutas',
    mealType: 'breakfast',
    reason: 'Refrescante, com probióticos e fibras.',
    items: [
      { name: 'Iogurte natural desnatado', quantity: 170, unit: 'g', calories: 90, protein: 8, carbs: 12, fat: 0 },
      { name: 'Granola', quantity: 30, unit: 'g', calories: 140, protein: 3, carbs: 20, fat: 6 },
      { name: 'Morangos', quantity: 100, unit: 'g', calories: 30, protein: 1, carbs: 7, fat: 0 },
    ],
  },
  {
    name: 'Crepioca de frango',
    mealType: 'breakfast',
    reason: 'Salgado leve e rico em proteína.',
    items: [
      { name: 'Tapioca', quantity: 1, unit: 'un', calories: 120, protein: 0, carbs: 30, fat: 0 },
      { name: 'Frango desfiado', quantity: 60, unit: 'g', calories: 100, protein: 18, carbs: 0, fat: 3 },
      { name: 'Requeijão light', quantity: 1, unit: 'colher de chá', calories: 40, protein: 1, carbs: 2, fat: 3 },
    ],
  },
  {
    name: 'Panqueca de banana e aveia',
    mealType: 'breakfast',
    reason: 'Opção doce sem farinha refinada.',
    items: [
      { name: 'Panqueca de banana', quantity: 2, unit: 'un', calories: 220, protein: 6, carbs: 38, fat: 6 },
      { name: 'Mel', quantity: 1, unit: 'colher de chá', calories: 60, protein: 0, carbs: 16, fat: 0 },
    ],
  },
  {
    name: 'Omelete de queijo e tomate',
    mealType: 'breakfast',
    reason: 'Salgado rápido e saciante.',
    items: [
      { name: 'Ovos', quantity: 2, unit: 'un', calories: 140, protein: 12, carbs: 1, fat: 10 },
      { name: 'Queijo muçarela', quantity: 30, unit: 'g', calories: 80, protein: 6, carbs: 1, fat: 6 },
      { name: 'Tomate', quantity: 50, unit: 'g', calories: 10, protein: 0, carbs: 2, fat: 0 },
    ],
  },
  {
    name: 'Smoothie de frutas com whey',
    mealType: 'breakfast',
    reason: 'Prático para tomar na correria.',
    items: [
      { name: 'Whey protein', quantity: 1, unit: 'scoop', calories: 110, protein: 20, carbs: 3, fat: 2 },
      { name: 'Banana', quantity: 1, unit: 'un', calories: 90, protein: 1, carbs: 23, fat: 0 },
      { name: 'Leite desnatado', quantity: 200, unit: 'ml', calories: 70, protein: 6, carbs: 10, fat: 0 },
    ],
  },
  {
    name: 'Pão de queijo com fruta',
    mealType: 'breakfast',
    reason: 'Sabor brasileiro em porção equilibrada.',
    items: [
      { name: 'Pão de queijo', quantity: 3, unit: 'un', calories: 200, protein: 4, carbs: 22, fat: 10 },
      { name: 'Laranja', quantity: 1, unit: 'un', calories: 60, protein: 1, carbs: 15, fat: 0 },
    ],
  },
];

const lunch: SuggestedMeal[] = [
  {
    name: 'Arroz, feijão, frango e salada',
    mealType: 'lunch',
    reason: 'Prato brasileiro completo e equilibrado.',
    items: [
      { name: 'Arroz branco', quantity: 100, unit: 'g', calories: 130, protein: 2, carbs: 28, fat: 0 },
      { name: 'Feijão carioca', quantity: 80, unit: 'g', calories: 90, protein: 6, carbs: 15, fat: 0 },
      { name: 'Peito de frango grelhado', quantity: 120, unit: 'g', calories: 180, protein: 30, carbs: 0, fat: 6 },
      { name: 'Salada verde', quantity: 80, unit: 'g', calories: 20, protein: 1, carbs: 3, fat: 0 },
    ],
  },
  {
    name: 'Arroz integral, carne moída e legumes',
    mealType: 'lunch',
    reason: 'Fibras do arroz integral e proteína da carne.',
    items: [
      { name: 'Arroz integral', quantity: 100, unit: 'g', calories: 110, protein: 2, carbs: 23, fat: 1 },
      { name: 'Carne moída refogada', quantity: 100, unit: 'g', calories: 180, protein: 20, carbs: 2, fat: 10 },
      { name: 'Legumes cozidos', quantity: 100, unit: 'g', calories: 50, protein: 2, carbs: 10, fat: 0 },
    ],
  },
  {
    name: 'Macarrão com molho e frango desfiado',
    mealType: 'lunch',
    reason: 'Opção reconfortante com carboidrato e proteína.',
    items: [
      { name: 'Macarrão cozido', quantity: 100, unit: 'g', calories: 130, protein: 5, carbs: 28, fat: 1 },
      { name: 'Molho de tomate', quantity: 80, unit: 'g', calories: 50, protein: 1, carbs: 8, fat: 2 },
      { name: 'Frango desfiado', quantity: 80, unit: 'g', calories: 130, protein: 24, carbs: 0, fat: 4 },
    ],
  },
  {
    name: 'Salada com atum, grão-de-bico e quinoa',
    mealType: 'lunch',
    reason: 'Leve, rica em proteína vegetal e ômega-3.',
    items: [
      { name: 'Quinoa cozida', quantity: 80, unit: 'g', calories: 95, protein: 3, carbs: 17, fat: 2 },
      { name: 'Atum em água', quantity: 80, unit: 'g', calories: 90, protein: 18, carbs: 0, fat: 1 },
      { name: 'Grão-de-bico', quantity: 60, unit: 'g', calories: 90, protein: 4, carbs: 14, fat: 2 },
      { name: 'Folhas verdes', quantity: 60, unit: 'g', calories: 15, protein: 1, carbs: 2, fat: 0 },
    ],
  },
  {
    name: 'Peixe grelhado com batata doce e brócolis',
    mealType: 'lunch',
    reason: 'Cardápio leve com carboidrato de baixo índice glicêmico.',
    items: [
      { name: 'Filé de peixe grelhado', quantity: 120, unit: 'g', calories: 150, protein: 25, carbs: 0, fat: 5 },
      { name: 'Batata doce cozida', quantity: 120, unit: 'g', calories: 115, protein: 2, carbs: 27, fat: 0 },
      { name: 'Brócolis cozido', quantity: 80, unit: 'g', calories: 30, protein: 2, carbs: 6, fat: 0 },
    ],
  },
  {
    name: 'Frango ao curry com arroz',
    mealType: 'lunch',
    reason: 'Sabor marcante sem exagerar nos temperos.',
    items: [
      { name: 'Arroz branco', quantity: 100, unit: 'g', calories: 130, protein: 2, carbs: 28, fat: 0 },
      { name: 'Frango ao curry', quantity: 120, unit: 'g', calories: 200, protein: 28, carbs: 4, fat: 7 },
      { name: 'Cenoura cozida', quantity: 60, unit: 'g', calories: 25, protein: 0, carbs: 6, fat: 0 },
    ],
  },
  {
    name: 'Escondidinho de frango com salada',
    mealType: 'lunch',
    reason: 'Sabor caseiro e saciante.',
    items: [
      { name: 'Escondidinho de frango', quantity: 200, unit: 'g', calories: 280, protein: 22, carbs: 25, fat: 10 },
      { name: 'Salada de alface e tomate', quantity: 80, unit: 'g', calories: 25, protein: 1, carbs: 4, fat: 0 },
    ],
  },
  {
    name: 'Risoto de frango com legumes',
    mealType: 'lunch',
    reason: 'Cremoso e equilibrado em macros.',
    items: [
      { name: 'Risoto de frango', quantity: 250, unit: 'g', calories: 350, protein: 22, carbs: 40, fat: 11 },
      { name: 'Brócolis no vapor', quantity: 60, unit: 'g', calories: 20, protein: 1, carbs: 4, fat: 0 },
    ],
  },
  {
    name: 'Yakissoba de frango',
    mealType: 'lunch',
    reason: 'Opção oriental com bastante vegetais.',
    items: [
      { name: 'Macarrão para yakissoba', quantity: 120, unit: 'g', calories: 180, protein: 6, carbs: 36, fat: 1 },
      { name: 'Frango em tiras', quantity: 100, unit: 'g', calories: 160, protein: 26, carbs: 0, fat: 6 },
      { name: 'Legumes salteados', quantity: 100, unit: 'g', calories: 60, protein: 2, carbs: 10, fat: 2 },
    ],
  },
  {
    name: 'Salada Caesar com frango',
    mealType: 'lunch',
    reason: 'Clássica, leve e com boa proteína.',
    items: [
      { name: 'Peito de frango grelhado', quantity: 120, unit: 'g', calories: 180, protein: 30, carbs: 0, fat: 6 },
      { name: 'Alface americana', quantity: 80, unit: 'g', calories: 15, protein: 1, carbs: 2, fat: 0 },
      { name: 'Croutons', quantity: 20, unit: 'g', calories: 80, protein: 2, carbs: 14, fat: 2 },
      { name: 'Molho Caesar light', quantity: 1, unit: 'colher de sopa', calories: 50, protein: 1, carbs: 3, fat: 4 },
    ],
  },
];

const snack: SuggestedMeal[] = [
  {
    name: 'Iogurte grego com frutas',
    mealType: 'snack',
    reason: 'Lanche leve com proteína e probióticos.',
    items: [
      { name: 'Iogurte grego natural', quantity: 120, unit: 'g', calories: 110, protein: 10, carbs: 8, fat: 4 },
      { name: 'Frutas vermelhas', quantity: 60, unit: 'g', calories: 30, protein: 0, carbs: 7, fat: 0 },
    ],
  },
  {
    name: 'Mix de castanhas',
    mealType: 'snack',
    reason: 'Gorduras boas e saciedade rápida.',
    items: [
      { name: 'Castanhas sortidas', quantity: 30, unit: 'g', calories: 180, protein: 5, carbs: 6, fat: 16 },
    ],
  },
  {
    name: 'Banana com pasta de amendoim',
    mealType: 'snack',
    reason: 'Combinação clássica de energia pré-treino.',
    items: [
      { name: 'Banana', quantity: 1, unit: 'un', calories: 90, protein: 1, carbs: 23, fat: 0 },
      { name: 'Pasta de amendoim', quantity: 1, unit: 'colher de sopa', calories: 95, protein: 4, carbs: 3, fat: 8 },
    ],
  },
  {
    name: 'Barra de proteína',
    mealType: 'snack',
    reason: 'Prática para a correria do dia.',
    items: [
      { name: 'Barra de proteína', quantity: 1, unit: 'un', calories: 180, protein: 15, carbs: 20, fat: 6 },
    ],
  },
  {
    name: 'Pão de queijo',
    mealType: 'snack',
    reason: 'Sabor brasileiro em porção controlada.',
    items: [
      { name: 'Pão de queijo', quantity: 3, unit: 'un', calories: 200, protein: 4, carbs: 22, fat: 10 },
    ],
  },
  {
    name: 'Hummus com cenoura',
    mealType: 'snack',
    reason: 'Vegetariano, leve e crocante.',
    items: [
      { name: 'Hummus', quantity: 50, unit: 'g', calories: 90, protein: 4, carbs: 8, fat: 5 },
      { name: 'Cenoura em palitos', quantity: 100, unit: 'g', calories: 35, protein: 1, carbs: 8, fat: 0 },
    ],
  },
  {
    name: 'Ovo cozido com torrada',
    mealType: 'snack',
    reason: 'Proteína simples e saciante.',
    items: [
      { name: 'Ovo cozido', quantity: 2, unit: 'un', calories: 140, protein: 12, carbs: 1, fat: 10 },
      { name: 'Torradinha integral', quantity: 2, unit: 'un', calories: 60, protein: 2, carbs: 10, fat: 1 },
    ],
  },
  {
    name: 'Smoothie de proteína',
    mealType: 'snack',
    reason: 'Refrescante e prático para qualquer hora.',
    items: [
      { name: 'Whey protein', quantity: 1, unit: 'scoop', calories: 110, protein: 20, carbs: 3, fat: 2 },
      { name: 'Leite desnatado', quantity: 200, unit: 'ml', calories: 70, protein: 6, carbs: 10, fat: 0 },
      { name: 'Gelo', quantity: 5, unit: 'cubo', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
  },
  {
    name: 'Tapioca com banana e canela',
    mealType: 'snack',
    reason: 'Doce leve e sem glúten.',
    items: [
      { name: 'Tapioca', quantity: 1, unit: 'un', calories: 120, protein: 0, carbs: 30, fat: 0 },
      { name: 'Banana', quantity: 1, unit: 'un', calories: 90, protein: 1, carbs: 23, fat: 0 },
      { name: 'Canela', quantity: 1, unit: 'pitada', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
  },
  {
    name: 'Gelatina natural com frutas',
    mealType: 'snack',
    reason: 'Opção bem leve para segurar a fome.',
    items: [
      { name: 'Gelatina zero', quantity: 1, unit: 'porção', calories: 20, protein: 2, carbs: 0, fat: 0 },
      { name: 'Pêssego em cubos', quantity: 80, unit: 'g', calories: 40, protein: 0, carbs: 10, fat: 0 },
    ],
  },
];

const dinner: SuggestedMeal[] = [
  {
    name: 'Sopa de legumes com frango',
    mealType: 'dinner',
    reason: 'Leve, aquecedora e nutritiva.',
    items: [
      { name: 'Sopa de legumes', quantity: 300, unit: 'ml', calories: 150, protein: 8, carbs: 25, fat: 3 },
      { name: 'Frango desfiado', quantity: 80, unit: 'g', calories: 130, protein: 24, carbs: 0, fat: 4 },
    ],
  },
  {
    name: 'Salada com peito de peru',
    mealType: 'dinner',
    reason: 'Jantar rápido e pouco calórico.',
    items: [
      { name: 'Peito de peru', quantity: 80, unit: 'g', calories: 90, protein: 14, carbs: 2, fat: 2 },
      { name: 'Folhas verdes', quantity: 80, unit: 'g', calories: 20, protein: 1, carbs: 3, fat: 0 },
      { name: 'Tomate cereja', quantity: 60, unit: 'g', calories: 20, protein: 1, carbs: 4, fat: 0 },
      { name: 'Azeite de oliva', quantity: 1, unit: 'colher de chá', calories: 40, protein: 0, carbs: 0, fat: 5 },
    ],
  },
  {
    name: 'Omelete com salada',
    mealType: 'dinner',
    reason: 'Proteína noturna leve.',
    items: [
      { name: 'Ovos', quantity: 2, unit: 'un', calories: 140, protein: 12, carbs: 1, fat: 10 },
      { name: 'Queijo branco', quantity: 30, unit: 'g', calories: 70, protein: 6, carbs: 1, fat: 5 },
      { name: 'Salada verde', quantity: 60, unit: 'g', calories: 15, protein: 1, carbs: 2, fat: 0 },
    ],
  },
  {
    name: 'Wrap de frango com salada',
    mealType: 'dinner',
    reason: 'Prático e balanceado para o fim do dia.',
    items: [
      { name: 'Wrap integral', quantity: 1, unit: 'un', calories: 130, protein: 4, carbs: 22, fat: 3 },
      { name: 'Frango grelhado em tiras', quantity: 80, unit: 'g', calories: 120, protein: 22, carbs: 0, fat: 4 },
      { name: 'Alface e tomate', quantity: 60, unit: 'g', calories: 15, protein: 1, carbs: 2, fat: 0 },
    ],
  },
  {
    name: 'Peixe grelhado com legumes',
    mealType: 'dinner',
    reason: 'Jantar leve rico em ômega-3.',
    items: [
      { name: 'Filé de peixe grelhado', quantity: 120, unit: 'g', calories: 150, protein: 25, carbs: 0, fat: 5 },
      { name: 'Abobrinha grelhada', quantity: 80, unit: 'g', calories: 25, protein: 1, carbs: 5, fat: 0 },
      { name: 'Cenoura cozida', quantity: 60, unit: 'g', calories: 25, protein: 0, carbs: 6, fat: 0 },
    ],
  },
  {
    name: 'Atum com salada e azeite',
    mealType: 'dinner',
    reason: 'Rápido, leve e proteico.',
    items: [
      { name: 'Atum em água', quantity: 100, unit: 'g', calories: 110, protein: 22, carbs: 0, fat: 1 },
      { name: 'Folhas verdes', quantity: 80, unit: 'g', calories: 20, protein: 1, carbs: 3, fat: 0 },
      { name: 'Azeite de oliva', quantity: 1, unit: 'colher de chá', calories: 40, protein: 0, carbs: 0, fat: 5 },
    ],
  },
  {
    name: 'Creme de abóbora com frango desfiado',
    mealType: 'dinner',
    reason: 'Sopa cremosa e saciante.',
    items: [
      { name: 'Creme de abóbora', quantity: 250, unit: 'ml', calories: 120, protein: 3, carbs: 22, fat: 3 },
      { name: 'Frango desfiado', quantity: 80, unit: 'g', calories: 130, protein: 24, carbs: 0, fat: 4 },
    ],
  },
  {
    name: 'Salada grega com frango',
    mealType: 'dinner',
    reason: 'Refrescante e com proteína magra.',
    items: [
      { name: 'Peito de frango grelhado', quantity: 100, unit: 'g', calories: 150, protein: 25, carbs: 0, fat: 5 },
      { name: 'Pepino', quantity: 60, unit: 'g', calories: 10, protein: 0, carbs: 2, fat: 0 },
      { name: 'Tomate', quantity: 60, unit: 'g', calories: 15, protein: 0, carbs: 3, fat: 0 },
      { name: 'Queijo feta', quantity: 30, unit: 'g', calories: 75, protein: 4, carbs: 1, fat: 6 },
    ],
  },
  {
    name: 'Ovos cozidos com salada e torrada',
    mealType: 'dinner',
    reason: 'Simples, proteico e fácil de preparar.',
    items: [
      { name: 'Ovos cozidos', quantity: 2, unit: 'un', calories: 140, protein: 12, carbs: 1, fat: 10 },
      { name: 'Torradas integrais', quantity: 2, unit: 'un', calories: 70, protein: 2, carbs: 12, fat: 1 },
      { name: 'Salada de folhas', quantity: 60, unit: 'g', calories: 15, protein: 1, carbs: 2, fat: 0 },
    ],
  },
  {
    name: 'Frango grelhado com salada verde',
    mealType: 'dinner',
    reason: 'Jantar clássico e leve.',
    items: [
      { name: 'Peito de frango grelhado', quantity: 120, unit: 'g', calories: 180, protein: 30, carbs: 0, fat: 6 },
      { name: 'Salada verde com azeite', quantity: 100, unit: 'g', calories: 50, protein: 1, carbs: 4, fat: 4 },
    ],
  },
];

const supper: SuggestedMeal[] = [
  {
    name: 'Chá com torrada',
    mealType: 'supper',
    reason: 'Ceia leve para não pesar antes de dormir.',
    items: [
      { name: 'Chá de camomila', quantity: 1, unit: 'xícara', calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: 'Torrada integral', quantity: 1, unit: 'un', calories: 70, protein: 2, carbs: 12, fat: 1 },
      { name: 'Requeijão light', quantity: 1, unit: 'colher de chá', calories: 40, protein: 1, carbs: 2, fat: 3 },
    ],
  },
  {
    name: 'Iogurte natural com canela',
    mealType: 'supper',
    reason: 'Ceia com probióticos e sabor reconfortante.',
    items: [
      { name: 'Iogurte natural desnatado', quantity: 120, unit: 'g', calories: 70, protein: 6, carbs: 8, fat: 0 },
      { name: 'Canela em pó', quantity: 1, unit: 'pitada', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
  },
  {
    name: 'Frutas vermelhas com iogurte',
    mealType: 'supper',
    reason: 'Leve, doce e antioxidante.',
    items: [
      { name: 'Iogurte natural', quantity: 100, unit: 'g', calories: 55, protein: 5, carbs: 7, fat: 0 },
      { name: 'Frutas vermelhas', quantity: 60, unit: 'g', calories: 30, protein: 0, carbs: 7, fat: 0 },
    ],
  },
  {
    name: 'Leite morno com mel e biscoito',
    mealType: 'supper',
    reason: 'Ceia reconfortante em dias frios.',
    items: [
      { name: 'Leite desnatado morno', quantity: 200, unit: 'ml', calories: 70, protein: 6, carbs: 10, fat: 0 },
      { name: 'Mel', quantity: 1, unit: 'colher de chá', calories: 60, protein: 0, carbs: 16, fat: 0 },
      { name: 'Biscoito de água e sal', quantity: 3, unit: 'un', calories: 45, protein: 1, carbs: 8, fat: 1 },
    ],
  },
  {
    name: 'Queijo branco com torrada',
    mealType: 'supper',
    reason: 'Proteína caseira antes de dormir.',
    items: [
      { name: 'Queijo branco', quantity: 40, unit: 'g', calories: 100, protein: 8, carbs: 2, fat: 7 },
      { name: 'Torrada integral', quantity: 1, unit: 'un', calories: 70, protein: 2, carbs: 12, fat: 1 },
    ],
  },
  {
    name: 'Gelatina zero com chantilly',
    mealType: 'supper',
    reason: 'Doce leve para fechar o dia.',
    items: [
      { name: 'Gelatina zero', quantity: 1, unit: 'porção', calories: 20, protein: 2, carbs: 0, fat: 0 },
      { name: 'Chantilly light', quantity: 2, unit: 'colher de chá', calories: 30, protein: 0, carbs: 2, fat: 2 },
    ],
  },
  {
    name: 'Maçã com canela',
    mealType: 'supper',
    reason: 'Fruta simples e de fácil digestão.',
    items: [
      { name: 'Maçã', quantity: 1, unit: 'un', calories: 80, protein: 0, carbs: 21, fat: 0 },
      { name: 'Canela em pó', quantity: 1, unit: 'pitada', calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
  },
  {
    name: 'Chá de ervas com barrinha de cereal',
    mealType: 'supper',
    reason: 'Combinação leve e prática.',
    items: [
      { name: 'Chá de ervas', quantity: 1, unit: 'xícara', calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: 'Barrinha de cereal', quantity: 1, unit: 'un', calories: 110, protein: 2, carbs: 20, fat: 3 },
    ],
  },
  {
    name: 'Panqueca de claras com queijo',
    mealType: 'supper',
    reason: 'Proteína leve para a noite.',
    items: [
      { name: 'Claras de ovo', quantity: 3, unit: 'un', calories: 60, protein: 12, carbs: 0, fat: 0 },
      { name: 'Queijo branco', quantity: 30, unit: 'g', calories: 75, protein: 6, carbs: 1, fat: 5 },
    ],
  },
  {
    name: 'Leite vegetal com cacau',
    mealType: 'supper',
    reason: 'Bebida reconfortante e pouco calórica.',
    items: [
      { name: 'Leite de amêndoas', quantity: 200, unit: 'ml', calories: 40, protein: 1, carbs: 2, fat: 3 },
      { name: 'Cacau em pó', quantity: 1, unit: 'colher de chá', calories: 15, protein: 1, carbs: 2, fat: 0 },
    ],
  },
];

export const SUGGESTED_MEALS: Record<MealType, SuggestedMeal[]> = {
  breakfast,
  lunch,
  snack,
  dinner,
  supper,
};
