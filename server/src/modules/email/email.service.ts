import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getResendClient } from './resend/resend-client';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface CodeEmailParams {
  token: string;
  title: string;
  description: string;
  disclaimer: string;
  preheader: string;
}

@Injectable()
export class EmailService {
  constructor() {}

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    await this.sendCodeEmail(to, {
      token,
      title: 'Verifique seu e-mail',
      description: 'Use o código abaixo para confirmar seu endereço de e-mail e acessar o Strawby.',
      disclaimer: 'Se você não criou uma conta no Strawby, ignore este e-mail.',
      preheader: `Seu código Strawby: ${token} — expira em 1 hora.`,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    await this.sendCodeEmail(to, {
      token,
      title: 'Redefina sua senha',
      description: 'Use o código abaixo para criar uma nova senha na sua conta Strawby.',
      disclaimer: 'Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanece a mesma.',
      preheader: `Código de redefinição Strawby: ${token} — expira em 1 hora.`,
    });
  }

  private async sendCodeEmail(to: string, params: CodeEmailParams): Promise<void> {
    const { token, title, description, disclaimer, preheader } = params;
    const year = new Date().getFullYear();

    await this.sendEmail({
      to,
      subject: `${token} é seu código Strawby`,
      text: `${title}\n\n${description}\n\nSeu código: ${token}\n\nVálido por 1 hora.\n\n${disclaimer}\n\n© ${year} Strawby`,
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
  <title>${title} — Strawby</title>
  <style>
    :root { color-scheme: light only; }
    body, html { margin: 0; padding: 0; background-color: #ebebeb !important; }
    body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; }
    @media only screen and (max-width: 600px) {
      .outer { padding: 20px 16px !important; }
      .card { padding: 32px 24px !important; }
      .code-text { font-size: 32px !important; }
      .title-text { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#ebebeb;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td class="outer" align="center" style="padding:40px 24px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;">

          <!-- Card -->
          <tr>
            <td class="card" bgcolor="#ffffff" style="background-color:#ffffff;border-radius:8px;padding:44px 48px 40px;">

              <!-- Brand -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 0;">
                      <tr>
                        <td style="vertical-align:middle;padding-right:10px;">
                          <img src="https://strawby.site/logo.png" alt="Strawby" width="36" height="36" style="display:block;border:0;" />
                        </td>
                        <td style="vertical-align:middle;">
                          <span style="font-size:22px;font-weight:800;color:#e11d48;letter-spacing:-0.4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Strawby</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <p class="title-text" style="margin:0 0 14px;font-size:26px;font-weight:800;color:#111111;text-align:center;line-height:1.2;letter-spacing:-0.4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${title}</p>

              <!-- Description -->
              <p style="margin:0 0 32px;font-size:15px;color:#6b6b6b;text-align:center;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${description}</p>

              <!-- Code block (full width, like a button) -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;">
                <tr>
                  <td align="center" bgcolor="#e11d48" style="background-color:#e11d48;border-radius:6px;padding:18px 24px;">
                    <span class="code-text" style="font-size:40px;font-weight:900;color:#ffffff;letter-spacing:0.25em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:inline-block;">${token}</span>
                  </td>
                </tr>
              </table>

              <!-- Validity -->
              <p style="margin:0 0 28px;font-size:13px;color:#9b9b9b;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                Válido por 1 hora &nbsp;·&nbsp; Não compartilhe com ninguém
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0 0 20px;" />

              <!-- Disclaimer -->
              <p style="margin:0;font-size:12px;color:#b0b0b0;text-align:center;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${disclaimer}</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:18px;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
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
