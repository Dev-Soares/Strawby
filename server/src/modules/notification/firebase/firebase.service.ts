import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common'
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
  private messaging: Messaging

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        }),
      })
    }
    this.messaging = getMessaging()
  }

  async send(token: string, payload: NotificationPayload): Promise<void> {
    try {
      await this.messaging.send({
        token,
        notification: { title: payload.title, body: payload.body },
        ...(payload.data && { data: payload.data }),
      })
    } catch (error) {
      throw new InternalServerErrorException('Erro ao enviar notificação', {
        cause: error,
      })
    }
  }

  async sendMulticast(tokens: string[], payload: NotificationPayload): Promise<void> {
    if (tokens.length === 0) return

    try {
      await this.messaging.sendEachForMulticast({
        tokens,
        notification: { title: payload.title, body: payload.body },
        ...(payload.data && { data: payload.data }),
      })
    } catch (error) {
      throw new InternalServerErrorException('Erro ao enviar notificações', {
        cause: error,
      })
    }
  }
}
