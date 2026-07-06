export type Patient = {
  id: string
  height: number | null
  birthDate: string | null
  gender: string | null
  targetWeight: number | null
  currentStreak: number
  bestStreak: number
  weightRecord: { weight: number; date: string }[]
}
