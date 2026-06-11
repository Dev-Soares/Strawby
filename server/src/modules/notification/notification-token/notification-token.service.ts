import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateNotificationTokenDto } from './dto/create-notification-token.dto'
import { mapPrismaError } from 'src/common/utils/prisma-error.mapper'
import type { NotificationTokenPublic } from './types'

@Injectable()
export class NotificationTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateNotificationTokenDto): Promise<NotificationTokenPublic> {
    try {
      return await this.prisma.notificationToken.create({
        data: { userId, token: dto.token },
        select: { id: true, userId: true, token: true, createdAt: true },
      })
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar token de notificação')
    }
  }

  async remove(token: string): Promise<void> {
    try {
      await this.prisma.notificationToken.delete({ where: { token } })
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover token de notificação')
    }
  }

  async findByToken(token: string): Promise<NotificationTokenPublic | null> {
    try {
      return await this.prisma.notificationToken.findUnique({
        where: { token },
        select: { id: true, userId: true, token: true, createdAt: true },
      })
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar token de notificação')
    }
  }

  async getTokensByUserId(userId: string): Promise<string[]> {
    try {
      const tokens = await this.prisma.notificationToken.findMany({
        where: { userId },
        select: { token: true },
      })
      return tokens.map((t) => t.token)
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar tokens de notificação por usuário')
    }
  }
}
