import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNotificationTokenDto } from './dto/create-notification-token.dto';
import { mapPrismaError } from 'src/common/utils/prisma-error.mapper';
import type { NotificationTokenPublic } from './types';

@Injectable()
export class NotificationTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateNotificationTokenDto,
  ): Promise<NotificationTokenPublic> {
    try {
      return await this.prisma.notificationToken.upsert({
        where: { token: dto.token },
        create: { userId, token: dto.token },
        update: {},
        select: { id: true, userId: true, token: true, createdAt: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar token de notificação');
    }
  }

  async removeMany(tokens: string[]): Promise<void> {
    if (tokens.length === 0) return;
    try {
      await this.prisma.notificationToken.deleteMany({
        where: { token: { in: tokens } },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover tokens de notificação');
    }
  }

  async remove(token: string): Promise<void> {
    try {
      await this.prisma.notificationToken.delete({ where: { token } });
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover token de notificação');
    }
  }

  async findByToken(token: string): Promise<NotificationTokenPublic | null> {
    try {
      return await this.prisma.notificationToken.findUnique({
        where: { token },
        select: { id: true, userId: true, token: true, createdAt: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar token de notificação');
    }
  }

  async getTokensByUserId(userId: string): Promise<string[]> {
    try {
      const tokens = await this.prisma.notificationToken.findMany({
        where: { userId },
        select: { token: true },
      });
      return tokens.map((t) => t.token);
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar tokens de notificação por usuário');
    }
  }
}
