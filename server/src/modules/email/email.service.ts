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

    await this.sendEmail({
      to,
      subject: `${verificationToken} é seu código de verificação Strawby`,
      text: `Confirme seu e-mail no Strawby\n\nSeu código de verificação: ${verificationToken}\n\nEste código expira em 1 hora. Não compartilhe com ninguém.\n\nSe você não solicitou este código, ignore este e-mail.\n\n© ${year} Strawby`,
      html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <title>Confirme seu e-mail — Strawby</title>
  <style>
    :root { color-scheme: light only; }
    body, html { margin: 0; padding: 0; background-color: #f6f6f6 !important; }
    body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; }
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 24px 16px !important; }
      .card { padding: 32px 24px !important; }
      .code { font-size: 32px !important; letter-spacing: 8px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f6;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Seu código Strawby: ${verificationToken} — expira em 1 hora.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#f6f6f6">
    <tr>
      <td class="wrapper" align="center" style="padding:48px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;">

          <!-- Brand name -->
          <tr>
            <td align="left" style="padding-bottom:16px;">
              <span style="font-size:15px;font-weight:700;color:#111111;letter-spacing:-0.2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Strawby</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="card" bgcolor="#ffffff" style="background-color:#ffffff;border-radius:12px;padding:40px 44px;border:1px solid #e8e8e8;">

              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#e11d48;text-transform:uppercase;letter-spacing:1px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Verificação de conta</p>

              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111111;line-height:1.25;letter-spacing:-0.4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">Confirme seu e-mail</h1>

              <p style="margin:0 0 32px;font-size:15px;color:#555555;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Use o código abaixo para ativar sua conta no Strawby. Ele é válido por <strong style="color:#111111;">1 hora</strong>.
              </p>

              <!-- Code -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:32px;">
                <tr>
                  <td align="center" bgcolor="#fafafa" style="background-color:#fafafa;border:2px solid #eeeeee;border-radius:10px;padding:24px 16px;">
                    <span class="code" style="font-size:42px;font-weight:800;color:#111111;letter-spacing:12px;font-family:'Courier New',Courier,monospace;display:inline-block;">${verificationToken}</span>
                  </td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #eeeeee;margin:0 0 24px;" />

              <p style="margin:0;font-size:13px;color:#999999;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Se você não solicitou este código, ignore este e-mail. Nenhuma alteração foi feita em sua conta.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                © ${year} Strawby &nbsp;·&nbsp; E-mail automático, não responda
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
