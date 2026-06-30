import { lazy } from 'react'
import { Route } from 'react-router-dom'
import ProtectedRoute from '../shared/components/ProtectedRoute'

const CreateRecipePage = lazy(() => import('../pages/CreateRecipePage'))
const RecipeDetailPage = lazy(() => import('../pages/RecipeDetailPage'))

export const recipeRoutes = [
  <Route key="recipe-new" path="/app/recipes/new" element={<ProtectedRoute><CreateRecipePage /></ProtectedRoute>} />,
  <Route key="recipe-detail" path="/app/recipes/:id" element={<ProtectedRoute><RecipeDetailPage /></ProtectedRoute>} />,
]
