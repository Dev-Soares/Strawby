import type { Patient } from '@prisma/client'

export type PatientStreakPublic = Pick<Patient, 'currentStreak' | 'bestStreak'>

export type StreakProcessResult = {
  incremented: string[]
  reset: string[]
}
