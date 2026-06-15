import { User } from '@prisma/client';

export type UserPublic = Pick<User, 'id' | 'name' | 'email' | 'role'> & {
  patient: {
    weight: number | null;
    height: number | null;
    birthDate: Date | null;
    gender: string | null;
    nutritionistId: string | null;
    nutritionist: { user: { name: string } } | null;
  } | null;
};

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  patient: {
    select: {
      weight: true,
      height: true,
      birthDate: true,
      gender: true,
      nutritionistId: true,
      nutritionist: { select: { user: { select: { name: true } } } },
    },
  },
} as const;

export type UserCredentials = Pick<User, 'id' | 'name' | 'password' | 'role' | 'emailVerified'>;
