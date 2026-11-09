import { Beer, Cake, Carrot, Wine as Champagne, Citrus, Coffee, Cookie, CookingPot, Croissant, CupSoda, Egg, Fish, Hamburger, IceCreamCone, Leaf, Martini, Nut, Pizza, Salad, Shrimp, Soup, Vegan, Wheat, Wine } from 'lucide-react'
import type { LucideIcon as Icon } from 'lucide-react'

export interface FoodItem {
  icon: Icon
  color: string
}

/** Ícones do mosaico de alimentos — usado no FoodShowcase e no DifferentialsSection. */
export const foodShowcaseItems: FoodItem[] = [
  { icon: Citrus,  color: 'text-orange-500'  },
  { icon: Salad,      color: 'text-lime-500'    },
  { icon: Carrot,       color: 'text-orange-500'  },
  { icon: Fish,         color: 'text-cyan-500'    },
  { icon: Egg,          color: 'text-yellow-400'  },
  { icon: Pizza,        color: 'text-red-500'     },
  { icon: Coffee,       color: 'text-amber-800'   },
  { icon: CupSoda,       color: 'text-green-600'   },
  { icon: Hamburger,    color: 'text-yellow-600'  },
  { icon: Leaf,         color: 'text-green-500'   },
  { icon: Wheat,       color: 'text-yellow-500'  },
  { icon: Wine,         color: 'text-rose-600'    },
  { icon: Champagne,    color: 'text-yellow-400'  },
  { icon: Martini,      color: 'text-indigo-500'  },
  { icon: Beer,    color: 'text-amber-400'   },
  { icon: Shrimp,       color: 'text-pink-500'    },
  { icon: Croissant,        color: 'text-amber-500'   },
  { icon: Cookie,       color: 'text-orange-600'  },
  { icon: IceCreamCone,     color: 'text-fuchsia-500' },
  { icon: CookingPot,   color: 'text-teal-600'    },
  { icon: Soup,    color: 'text-cyan-600'    },
  { icon: Vegan,       color: 'text-red-600'     },
  { icon: Cake,         color: 'text-pink-500'    },
  { icon: Nut,          color: 'text-amber-600'   },
]
