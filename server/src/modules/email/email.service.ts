import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getResendClient } from './resend/resend-client';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailService {
  constructor() {}

  async sendVerificationEmail(
    to: string,
    verificationToken: string,
  ): Promise<void> {
    const year = new Date().getFullYear();
    const logoUrl = `${process.env.CORS_ORIGIN}/logo.webp`;

    await this.sendEmail({
      to,
      subject: `${verificationToken} é seu código de verificação Strawby`,
      text: `Confirme seu e-mail no Strawby\n\nSeu código de verificação: ${verificationToken}\n\nEste código expira em 1 hora. Não compartilhe com ninguém.\n\nSe você não criou uma conta na Strawby, ignore este e-mail.\n\n© ${year} Strawby`,
      html: `<!DOCTYPE html>
<html lang="pt-BR" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Confirme seu e-mail — Strawby</title>
  <style>
    :root { color-scheme: light only; }
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    table { border-collapse: collapse !important; }
    @media only screen and (max-width: 600px) {
      .email-card { padding: 28px 24px !important; }
      .code-text { font-size: 34px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Seu código de verificação Strawby: ${verificationToken} — válido por 1 hora.&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:48px 16px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

          <!-- Brand header -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="vertical-align:middle;padding-right:10px;">
                    <img src="${logoUrl}" alt="Strawby" width="32" height="32" style="display:block;border-radius:8px;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:20px;font-weight:800;color:#111827;letter-spacing:-0.4px;">Strawby</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">

              <!-- Accent bar -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:linear-gradient(90deg,#e11d48 0%,#f43f5e 100%);height:3px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="email-card" style="padding:40px 48px 36px;">

                    <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111827;line-height:1.3;letter-spacing:-0.3px;">Confirme seu e-mail</h1>
                    <p style="margin:0 0 32px;font-size:15px;color:#6b7280;line-height:1.65;">
                      Olá! Use o código abaixo para verificar seu endereço de e-mail e ativar sua conta no Strawby.
                    </p>

                    <!-- Code label -->
                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1.5px;">
                      Código de verificação
                    </p>

                    <!-- Code block -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                      <tr>
                        <td align="center" style="background-color:#fff1f2;border:2px solid #fecdd3;border-radius:12px;padding:22px 16px;">
                          <span class="code-text" style="font-size:40px;font-weight:800;color:#e11d48;letter-spacing:10px;font-family:'Courier New',Courier,monospace;display:block;">${verificationToken}</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Notice -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:32px;">
                      <tr>
                        <td style="background-color:#f9fafb;border-left:3px solid #e5e7eb;border-radius:0 6px 6px 0;padding:12px 16px;">
                          <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.55;">
                            Este código expira em <strong style="color:#374151;">1 hora</strong>. Por segurança, não o compartilhe com ninguém.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 24px;" />

                    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.65;">
                      Se você não solicitou este código, pode ignorar este e-mail com segurança. Sua conta permanece protegida.
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 24px 0;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;line-height:1.6;">
                Este é um e-mail automático — não é necessário responder.
              </p>
              <p style="margin:0;font-size:11px;color:#d1d5db;">
                © ${year} Strawby. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
    });
  }

  private async sendEmail(options: SendEmailOptions): Promise<void> {
    const { error } = await getResendClient().emails.send({
      from: process.env.EMAIL_FROM ?? 'Strawby <noreply@strawby.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      throw new InternalServerErrorException('Erro ao enviar e-mail', {
        cause: new Error(error.message),
      });
    }
  }
}
