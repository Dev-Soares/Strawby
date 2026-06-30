import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const CreateMealPage = lazy(() => import('../pages/CreateMealPage'))
const MealDetailPage = lazy(() => import('../pages/MealDetailPage'))
const SelectFoodPage = lazy(() => import('../pages/SelectFoodPage'))

export const mealRoutes = [
  <Route key="meal-new" path="/app/meals/new" element={<ProtectedRoute><CreateMealPage /></ProtectedRoute>} />,
  <Route key="meal-detail" path="/app/meals/:id" element={<ProtectedRoute><MealDetailPage /></ProtectedRoute>} />,
  <Route key="food-select" path="/app/foods/select" element={<ProtectedRoute><SelectFoodPage /></ProtectedRoute>} />,
]
