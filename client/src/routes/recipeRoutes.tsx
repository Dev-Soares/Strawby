import { Route } from 'react-router-dom'
import CreateRecipePage from '../pages/CreateRecipePage'
import RecipeDetailPage from '../pages/RecipeDetailPage'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export const recipeRoutes = [
  <Route key="recipe-new" path="/app/recipes/new" element={<ProtectedRoute><CreateRecipePage /></ProtectedRoute>} />,
  <Route key="recipe-detail" path="/app/recipes/:id" element={<ProtectedRoute><RecipeDetailPage /></ProtectedRoute>} />,
]
