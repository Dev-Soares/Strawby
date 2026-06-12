import { Injectable } from '@nestjs/common'
import { FirebaseService } from '../firebase/firebase.service'
import { NotificationTokenService } from '../notification-token/notification-token.service'
import { mapPrismaError } from 'src/common/utils/prisma-error.mapper'

@Injectable()
export class NotificationService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  async sendOne(userId: string, title: string, body: string) {
    const tokens = await this.notificationTokenService.getTokensByUserId(userId)

    if (tokens.length === 0) return

    try {
      return await this.firebaseService.sendMulticast(tokens, { title, body })
    } catch (error) {
      mapPrismaError(error, 'Erro ao enviar notificação')
    }
  }

  async sendMany(userIds: string[], title: string, body: string) {
    const allTokens = await Promise.all(
      userIds.map((userId) => this.notificationTokenService.getTokensByUserId(userId)),
    )
    const tokens = allTokens.flat()

    if (tokens.length === 0) return

    try {
      return await this.firebaseService.sendMulticast(tokens, { title, body })
    } catch (error) {
      mapPrismaError(error, 'Erro ao enviar notificações')
    }
  }
}
