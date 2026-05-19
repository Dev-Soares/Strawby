import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MainPage from './pages/MainPage'
import FoodsPage from './pages/FoodsPage'
import PlanPage from './pages/PlanPage'
import CreateMealPage from './pages/CreateMealPage'
import MealDetailPage from './pages/MealDetailPage'
import SelectFoodPage from './pages/SelectFoodPage'
import ScorePage from './pages/ScorePage'
import ProtectedRoute from './shared/components/ProtectedRoute'
import PublicOnlyRoute from './shared/components/PublicOnlyRoute'
import ScrollToTop from './shared/components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/app/create-account" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />
      <Route path="/app/home" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
      <Route path="/app/score" element={<ProtectedRoute><ScorePage /></ProtectedRoute>} />
      <Route path="/app/foods" element={<ProtectedRoute><FoodsPage /></ProtectedRoute>} />
      <Route path="/app/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
      <Route path="/app/meals/new" element={<ProtectedRoute><CreateMealPage /></ProtectedRoute>} />
      <Route path="/app/meals/:id" element={<ProtectedRoute><MealDetailPage /></ProtectedRoute>} />
      <Route path="/app/foods/select" element={<ProtectedRoute><SelectFoodPage /></ProtectedRoute>} />
    </Routes>
    </>
  )
}
