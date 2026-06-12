import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getMessaging, type Messaging } from 'firebase-admin/messaging'

interface NotificationPayload {
  title: string
  body: string
  data?: Record<string, string>
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name)
  private messaging: Messaging

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID')
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL')
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')

    this.logger.log(`[init] projectId=${projectId} clientEmail=${clientEmail} privateKey=${privateKey ? 'SET' : 'MISSING'}`)

    if (!getApps().length) {
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
      this.logger.log('[init] Firebase Admin initialized')
    } else {
      this.logger.log('[init] Firebase Admin already initialized')
    }
    this.messaging = getMessaging()
  }

  async send(token: string, payload: NotificationPayload): Promise<void> {
    this.logger.log(`[send] token=${token.slice(0, 20)}... title="${payload.title}"`)
    try {
      const result = await this.messaging.send({
        token,
        notification: { title: payload.title, body: payload.body },
        ...(payload.data && { data: payload.data }),
      })
      this.logger.log(`[send] success messageId=${result}`)
    } catch (error) {
      this.logger.error(`[send] failed: ${(error as Error)?.message}`, (error as Error)?.stack)
      throw new InternalServerErrorException('Erro ao enviar notificação', { cause: error })
    }
  }

  async sendMulticast(tokens: string[], payload: NotificationPayload): Promise<void> {
    if (tokens.length === 0) return

    this.logger.log(`[sendMulticast] tokens=${tokens.length} title="${payload.title}"`)
    try {
      const result = await this.messaging.sendEachForMulticast({
        tokens,
        notification: { title: payload.title, body: payload.body },
        ...(payload.data && { data: payload.data }),
      })
      this.logger.log(`[sendMulticast] successCount=${result.successCount} failureCount=${result.failureCount}`)
      result.responses.forEach((r, i) => {
        if (!r.success) this.logger.error(`[sendMulticast] token[${i}] failed: ${r.error?.message}`)
        else this.logger.log(`[sendMulticast] token[${i}] ok messageId=${r.messageId}`)
      })
    } catch (error) {
      this.logger.error(`[sendMulticast] failed: ${(error as Error)?.message}`, (error as Error)?.stack)
      throw new InternalServerErrorException('Erro ao enviar notificações', { cause: error })
    }
  }
}
