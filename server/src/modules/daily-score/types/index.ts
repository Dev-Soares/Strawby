import { DailyScore } from '@prisma/client';

export type DailyScorePublic = Pick<
  DailyScore,
  'id' | 'date' | 'score' | 'userId' | 'createdAt' | 'updatedAt'
>;

export const dailyScoreSelect = {
  id: true,
  date: true,
  score: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;
