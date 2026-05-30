import { User } from '@prisma/client';

export type UserPublic = Pick<User, 'id' | 'name' | 'email' | 'role'>;

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export type UserCredentials = Pick<User, 'id' | 'name' | 'password' | 'role'>;