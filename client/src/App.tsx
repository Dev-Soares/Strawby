import { Routes } from 'react-router-dom'
import ScrollToTop from './shared/components/ScrollToTop'
import UnauthorizedListener from './shared/components/UnauthorizedListener'
import NotificationTokenRefresher from './modules/notifications/components/NotificationTokenRefresher'
import { publicRoutes } from './routes/publicRoutes'
import { authRoutes } from './routes/authRoutes'
import { homeRoutes } from './routes/homeRoutes'
import { mealRoutes } from './routes/mealRoutes'
import { foodRoutes } from './routes/foodRoutes'
import { recipeRoutes } from './routes/recipeRoutes'
import { planRoutes } from './routes/planRoutes'
import { scoreRoutes } from './routes/scoreRoutes'
import { profileRoutes } from './routes/profileRoutes'
import { nutritionistRoutes } from './routes/nutritionistRoutes'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <UnauthorizedListener />
      <NotificationTokenRefresher />
      <Routes>
        {publicRoutes}
        {authRoutes}
        {homeRoutes}
        {mealRoutes}
        {foodRoutes}
        {recipeRoutes}
        {planRoutes}
        {scoreRoutes}
        {profileRoutes}
        {nutritionistRoutes}
      </Routes>
    </>
  )
}
