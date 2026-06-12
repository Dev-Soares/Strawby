import type { NotificationToken } from '@prisma/client'

export type NotificationTokenPublic = Pick<NotificationToken, 'id' | 'userId' | 'token' | 'createdAt'>
