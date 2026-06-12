import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getMessaging, type Messaging } from 'firebase-admin/messaging'

interface NotificationPayload {
  title: string
  body: string
  data?: Record<string, string>
}

const INVALID_TOKEN_CODES = [
  'messaging/invalid-registration-token',
  'messaging/registration-token-not-registered',
]

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name)
  private messaging!: Messaging
  private clickLink?: string

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID')
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL')
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')

    if (!getApps().length) {
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    }
    this.messaging = getMessaging()

    // FCM exige HTTPS no link de clique — em dev (localhost http) fica sem link
    const appUrl = this.configService.get<string>('CORS_ORIGIN')?.split(',')[0]?.trim()
    this.clickLink = appUrl?.startsWith('https') ? `${appUrl}/app/home` : undefined
  }

  private webpushConfig() {
    return {
      headers: { TTL: '18000' },
      notification: { icon: '/logo.png' },
      ...(this.clickLink && { fcmOptions: { link: this.clickLink } }),
    }
  }

  async send(token: string, payload: NotificationPayload): Promise<void> {
    try {
      await this.messaging.send({
        token,
        notification: { title: payload.title, body: payload.body },
        webpush: this.webpushConfig(),
        ...(payload.data && { data: payload.data }),
      })
      this.logger.log('Notificação enviada')
    } catch (error) {
      this.logger.error(`Notificação não enviada: ${(error as Error).message}`)
      throw new InternalServerErrorException('Erro ao enviar notificação', { cause: error })
    }
  }

  /** Envia para todos os tokens e retorna os tokens inválidos (expirados/desregistrados) para limpeza. */
  async sendMulticast(tokens: string[], payload: NotificationPayload): Promise<string[]> {
    if (tokens.length === 0) return []

    try {
      const result = await this.messaging.sendEachForMulticast({
        tokens,
        notification: { title: payload.title, body: payload.body },
        webpush: this.webpushConfig(),
        ...(payload.data && { data: payload.data }),
      })
      if (result.failureCount > 0) {
        const reasons = result.responses
          .filter((r) => !r.success)
          .map((r) => r.error?.code)
          .join(', ')
        this.logger.warn(`Notificações: ${result.successCount} enviadas, ${result.failureCount} falharam (${reasons})`)
      } else {
        this.logger.log(`Notificações enviadas: ${result.successCount}`)
      }
      return result.responses
        .map((r, i) => (!r.success && INVALID_TOKEN_CODES.includes(r.error?.code ?? '') ? tokens[i] : null))
        .filter((t): t is string => t !== null)
    } catch (error) {
      this.logger.error(`Notificações não enviadas: ${(error as Error).message}`)
      throw new InternalServerErrorException('Erro ao enviar notificações', { cause: error })
    }
  }
}
