import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { messaging } from './firebase-client'

interface NotificationPayload {
  title: string
  body: string
  data?: Record<string, string>
}

@Injectable()
export class FirebaseService {
  private readonly messaging = messaging

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
