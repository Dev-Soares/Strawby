export type UserPublic = {
  id: string
  name: string
  email: string
  role: 'patient' | 'nutritionist'
  patient: {
    weight: number | null
    height: number | null
    age: number | null
    gender: string | null
    nutritionistId: string | null
    nutritionist: { user: { name: string } } | null
  } | null
}
