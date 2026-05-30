import { Route } from 'react-router-dom'
import CreateMealPage from '../pages/CreateMealPage'
import MealDetailPage from '../pages/MealDetailPage'
import SelectFoodPage from '../pages/SelectFoodPage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const mealRoutes = [
  <Route key="meal-new" path="/app/meals/new" element={<ProtectedRoute><CreateMealPage /></ProtectedRoute>} />,
  <Route key="meal-detail" path="/app/meals/:id" element={<ProtectedRoute><MealDetailPage /></ProtectedRoute>} />,
  <Route key="food-select" path="/app/foods/select" element={<ProtectedRoute><SelectFoodPage /></ProtectedRoute>} />,
]
