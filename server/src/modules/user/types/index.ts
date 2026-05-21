import { User } from '@prisma/client';

export type UserPublic = Pick<User, 'id' | 'name' | 'email'> & {
  score?: number | null;
};

export const userSelect = {
  id: true,
  name: true,
  email: true,
} as const;
