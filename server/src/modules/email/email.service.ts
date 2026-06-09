import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ResendClient } from './resend/resend-client';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  constructor() {}

  async sendVerificationEmail(
    to: string,
    verificationToken: string,
  ): Promise<void> {
    try {
      const sendEmailOptions: SendEmailOptions = {
        to,
        subject: 'Verificação de E-mail - Strawby',
        html: `
          <p>Olá,</p>
          <p>Use o código abaixo para verificar seu e-mail:</p>
          <h2>${verificationToken}</h2>
          <p>Este código é válido por 1 hora.</p>
          <p>Se você não solicitou este e-mail, ignore esta mensagem.</p>
          <p>Obrigado,<br/>Equipe Strawby</p>
        `,
      };

      await this.sendEmail(sendEmailOptions);       
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao enviar e-mail de verificação',
      );
    }
  }

  private async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      await ResendClient.emails.send({
        from: 'Strawby <noreply@strawby.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao enviar e-mail');
    }
  }
}
