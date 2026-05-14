import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MainPage from './pages/MainPage'
import FoodsPage from './pages/FoodsPage'
import PlanPage from './pages/PlanPage'
import CreateMealPage from './pages/CreateMealPage'
import SelectFoodPage from './pages/SelectFoodPage'
import ScorePage from './pages/ScorePage'
import ProtectedRoute from './shared/components/ProtectedRoute'
import PublicOnlyRoute from './shared/components/PublicOnlyRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/create-account" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />
      <Route path="/home" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
      <Route path="/score" element={<ProtectedRoute><ScorePage /></ProtectedRoute>} />
      <Route path="/foods" element={<ProtectedRoute><FoodsPage /></ProtectedRoute>} />
      <Route path="/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
      <Route path="/meals/new" element={<ProtectedRoute><CreateMealPage /></ProtectedRoute>} />
      <Route path="/foods/select" element={<ProtectedRoute><SelectFoodPage /></ProtectedRoute>} />
    </Routes>
  )
}
