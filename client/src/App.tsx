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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-account" element={<SignUpPage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/score" element={<ScorePage />} />
      <Route path="/foods" element={<FoodsPage />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/meals/new" element={<CreateMealPage />} />
      <Route path="/foods/select" element={<SelectFoodPage />} />
    </Routes>
  )
}
