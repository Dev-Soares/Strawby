import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class EmailService {
  private resend: Resend

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'))
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const baseUrl = this.configService.get<string>('APP_URL')
    const link = `${baseUrl}/auth/verify-email?token=${token}`

    await this.resend.emails.send({
        from: 'Strawby <strawbyapp@gmail.com>',
        to,
        subject: 'Confirme seu e-mail',
        html: `<p>Clique no link para confirmar: <a href="${link}">${link}</a></p>`,
      })
  }

}
