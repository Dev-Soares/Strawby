import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNotificationTokenDto } from './dto/create-notification-token.dto';
import { mapPrismaError } from 'src/common/utils/prisma-error.mapper';
import type { NotificationTokenPublic } from './types';

/**
 * Um token não tocado há esse tempo é de um aparelho que não abre mais o app
 * (o cliente re-registra a cada abertura). Mantê-lo faz o FCM entregar a mesma
 * push em duplicata enquanto a subscription velha ainda estiver viva.
 */
const STALE_TOKEN_DAYS = 30;

const tokenSelect = {
  id: true,
  userId: true,
  token: true,
  deviceId: true,
  createdAt: true,
} as const;

@Injectable()
export class NotificationTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateNotificationTokenDto,
  ): Promise<NotificationTokenPublic> {
    const staleCutoff = new Date(
      Date.now() - STALE_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    );

    try {
      return await this.prisma.$transaction(async (tx) => {
        // O token é @unique: se ele estiver preso em outra linha (aparelho antes
        // do deviceId, ou outra conta no mesmo aparelho), o upsert colidiria.
        await tx.notificationToken.deleteMany({
          where: {
            token: dto.token,
            NOT: { userId, deviceId: dto.deviceId },
          },
        });

        // Tokens mortos do mesmo usuário — sem isso cada aparelho antigo soma
        // uma entrega a mais na mesma notificação.
        await tx.notificationToken.deleteMany({
          where: {
            userId,
            updatedAt: { lt: staleCutoff },
            NOT: { deviceId: dto.deviceId },
          },
        });

        return await tx.notificationToken.upsert({
          where: { userId_deviceId: { userId, deviceId: dto.deviceId } },
          create: { userId, deviceId: dto.deviceId, token: dto.token },
          update: { token: dto.token },
          select: tokenSelect,
        });
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

  async remove(userId: string, token: string): Promise<void> {
    try {
      await this.prisma.notificationToken.deleteMany({
        where: { userId, token },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover token de notificação');
    }
  }

  /** Poda tokens de aparelhos que não abrem o app há STALE_TOKEN_DAYS. */
  async removeStale(): Promise<number> {
    const staleCutoff = new Date(
      Date.now() - STALE_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    );

    try {
      const { count } = await this.prisma.notificationToken.deleteMany({
        where: { updatedAt: { lt: staleCutoff } },
      });
      return count;
    } catch (error) {
      mapPrismaError(error, 'Erro ao remover tokens de notificação expirados');
    }
  }

  async findByToken(token: string): Promise<NotificationTokenPublic | null> {
    try {
      return await this.prisma.notificationToken.findUnique({
        where: { token },
        select: tokenSelect,
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

  async getTokensByUserIds(userIds: string[]): Promise<string[]> {
    if (userIds.length === 0) return [];
    try {
      const tokens = await this.prisma.notificationToken.findMany({
        where: { userId: { in: userIds } },
        select: { token: true },
      });
      return tokens.map((t) => t.token);
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar tokens de notificação por usuário');
    }
  }
}
