import { Injectable, Logger } from '@nestjs/common'
import { FirebaseService } from '../firebase/firebase.service'
import { NotificationTokenService } from '../notification-token/notification-token.service'
import { mapPrismaError } from 'src/common/utils/prisma-error.mapper'

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  async sendOne(userId: string, title: string, body: string) {
    this.logger.log(`[sendOne] userId=${userId} title="${title}"`)
    const tokens = await this.notificationTokenService.getTokensByUserId(userId)
    this.logger.log(`[sendOne] tokens found: ${tokens.length} — ${JSON.stringify(tokens)}`)

    if (tokens.length === 0) {
      this.logger.warn(`[sendOne] no tokens for userId=${userId}, skipping`)
      return
    }

    try {
      const result = await this.firebaseService.sendMulticast(tokens, { title, body })
      this.logger.log(`[sendOne] sendMulticast success`)
      return result
    } catch (error) {
      this.logger.error(`[sendOne] sendMulticast failed: ${(error as Error)?.message}`, (error as Error)?.stack)
      mapPrismaError(error, 'Erro ao enviar notificação')
    }
  }

  async sendMany(userIds: string[], title: string, body: string) {
    this.logger.log(`[sendMany] userIds=${JSON.stringify(userIds)} title="${title}"`)
    const allTokens = await Promise.all(
      userIds.map((userId) => this.notificationTokenService.getTokensByUserId(userId)),
    )
    const tokens = allTokens.flat()
    this.logger.log(`[sendMany] total tokens: ${tokens.length}`)

    if (tokens.length === 0) {
      this.logger.warn(`[sendMany] no tokens found, skipping`)
      return
    }

    try {
      const result = await this.firebaseService.sendMulticast(tokens, { title, body })
      this.logger.log(`[sendMany] sendMulticast success`)
      return result
    } catch (error) {
      this.logger.error(`[sendMany] sendMulticast failed: ${(error as Error)?.message}`, (error as Error)?.stack)
      mapPrismaError(error, 'Erro ao enviar notificações')
    }
  }
}
