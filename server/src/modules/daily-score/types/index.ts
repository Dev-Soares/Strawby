import { DailyScore } from '@prisma/client';

export type DailyScorePublic = Pick<
  DailyScore,
  'id' | 'date' | 'score' | 'patientId' | 'createdAt' | 'updatedAt'
>;

export type DailyScoreEntry = Pick<DailyScore, 'patientId' | 'score'>;

export const dailyScoreSelect = {
  id: true,
  date: true,
  score: true,
  patientId: true,
  createdAt: true,
  updatedAt: true,
} as const;
