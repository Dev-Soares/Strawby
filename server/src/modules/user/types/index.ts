import { User } from '@prisma/client';

export type UserPublic = Pick<User, 'id' | 'name' | 'email' | 'role'> & {
  patient: {
    height: number | null;
    birthDate: Date | null;
    gender: string | null;
    targetWeight: number | null;
    nutritionistId: string | null;
    nutritionist: { user: { name: string } } | null;
  } | null;
  nutritionist: { id: string } | null;
};

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  patient: {
    select: {
      height: true,
      birthDate: true,
      gender: true,
      targetWeight: true,
      nutritionistId: true,
      nutritionist: { select: { user: { select: { name: true } } } },
    },
  },
  nutritionist: {
    select: { id: true },
  },
} as const;

export type UserCredentials = Pick<
  User,
  'id' | 'name' | 'password' | 'role' | 'emailVerified'
>;
