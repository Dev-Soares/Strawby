export type Patient = {
  id: string
  height: number | null
  birthDate: string | null
  gender: string | null
  goal: 'lose' | 'gain' | 'mantain' | null
  targetWeight: number | null
  currentStreak: number
  bestStreak: number
  weightRecord: { weight: number; date: string }[]
}
