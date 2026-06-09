import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/verify-email')
  async sendVerificationEmail(@Body('email') email: string) {
    await this.emailService.sendVerificationEmail(email);
    return { message: 'Verification email sent' };
  }
}
