export type UserPublic = {
  id: string
  name: string
  email: string
  role: 'user' | 'patient' | 'nutritionist'
  patient: {
    height: number | null
    birthDate: string | null
    gender: string | null
    targetWeight: number | null
    nutritionistId: string | null
    nutritionist: { user: { name: string } } | null
  } | null
  nutritionist: { id: string } | null
}
