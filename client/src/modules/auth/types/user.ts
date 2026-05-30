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
  } | null
}
