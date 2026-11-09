import { useContext } from 'react'
import { TourContext } from '../contexts/tour-context'

export const useTour = () => {
  const context = useContext(TourContext)
  if (!context) throw new Error('useTour precisa estar dentro de TourProvider')
  return context
}
