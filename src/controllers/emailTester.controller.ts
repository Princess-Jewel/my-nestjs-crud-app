import { Get, Controller } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('test-email')
export class TestEmailController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  async sendTestEmail(): Promise<string> {
    try {
      await this.mailerService.sendMail({
        to: 'princessjewel80@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email from NestJS Mailer.',
      });
      return 'Test email sent successfully YEAH!';
    } catch (error) {
      console.error('Error sending test email:', error);
      return 'Test email failed to send. Check your configuration.';
    }
  }
}
