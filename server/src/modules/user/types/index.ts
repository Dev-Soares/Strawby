import { User } from '@prisma/client';

export type UserPublic = Pick<User, 'id' | 'name' | 'email' | 'role'> & {
  patient: { weight: number | null; height: number | null; age: number | null; gender: string | null } | null;
};

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  patient: { select: { weight: true, height: true, age: true, gender: true } },
} as const;

export type UserCredentials = Pick<User, 'id' | 'name' | 'password' | 'role'>;
