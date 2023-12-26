import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendCommentNotification(authorEmail: string, postTitle: string): Promise<void> {
    await this.mailerService.sendMail({
      to: authorEmail,
      subject: 'New Comment on Your Post',
      template: 'comment-notification', // Template file (HTML or EJS)
      context: {
        postTitle,
      },
    });
  }
}
