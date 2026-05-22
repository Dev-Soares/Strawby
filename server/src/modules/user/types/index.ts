import { User } from '@prisma/client';

export type UserPublic = Pick<User, 'id' | 'name' | 'email'>;

export const userSelect = {
  id: true,
  name: true,
  email: true,
} as const;
