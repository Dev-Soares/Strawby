import type { Food } from '../types/food'
import FoodCard from './FoodCard'

interface FoodGridProps {
  foods: Food[]
  total: number
}

export default function FoodGrid({ foods, total }: FoodGridProps) {
  return (
    <div>
      <p className="text-sm text-neutral-500 mb-4">
        {total} alimento{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  )
}
