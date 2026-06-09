import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getResendClient } from './resend/resend-client';

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
    await this.sendEmail({
      to,
      subject: `Seu código de verificação - ${verificationToken} - Strawby`,
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">
          <title>Verificação de E-mail</title>
          <style>:root { color-scheme: light only; }</style>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f5 !important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:48px 16px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                  <!-- Header -->
                  <tr>
                    <td style="background-color:#ffffff !important;border-radius:12px 12px 0 0;border:1px solid #e4e4e7;border-bottom:none;padding:24px 40px;">
                      <img src="${process.env.CORS_ORIGIN}/logo.png" alt="" width="28" height="28" style="display:inline-block;vertical-align:middle;border-radius:6px;margin-right:10px;" />
                      <span style="font-size:20px;font-weight:800;color:#18181b !important;letter-spacing:-0.5px;vertical-align:middle;">Strawby</span>
                    </td>
                  </tr>

                  <!-- Card -->
                  <tr>
                    <td style="background-color:#ffffff !important;border-radius:0 0 12px 12px;border:1px solid #e4e4e7;border-top:none;padding:36px 40px 32px;">

                      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#18181b;line-height:1.3;">Confirme seu e-mail</h1>
                      <p style="margin:0 0 28px;font-size:15px;color:#71717a;line-height:1.6;">Insira o código abaixo no app para verificar seu e-mail e ativar sua conta.</p>

                      <!-- Code block -->
                      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:2px;">Seu c&#243;digo de verifica&#231;&#227;o</p>
                      <div style="background-color:#fff5f5;border:2px solid #fca5a5;border-radius:10px;padding:22px;text-align:center;margin-bottom:28px;">
                        <span style="font-size:38px;font-weight:800;color:#dc2626;letter-spacing:12px;font-variant-numeric:tabular-nums;">${verificationToken}</span>
                      </div>

                      <p style="margin:0 0 24px;font-size:13px;color:#a1a1aa;line-height:1.6;">Este c&#243;digo expira em <strong style="color:#52525b;">1 hora</strong>. N&#227;o compartilhe com ningu&#233;m.</p>

                      <hr style="border:none;border-top:1px solid #f4f4f5;margin:0 0 20px;" />

                      <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.6;">Se voc&#234; n&#227;o criou uma conta na Strawby, ignore este e-mail. Nenhuma a&#231;&#227;o &#233; necess&#225;ria.</p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top:24px;">
                      <p style="margin:0;font-size:12px;color:#a1a1aa;">© 2025 Strawby. Todos os direitos reservados.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
  }

  private async sendEmail(options: SendEmailOptions): Promise<void> {
    const { error } = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM ?? 'Strawby <noreply@strawby.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      throw new InternalServerErrorException('Erro ao enviar e-mail', {
        cause: new Error(error.message),
      });
    }
  }
}
