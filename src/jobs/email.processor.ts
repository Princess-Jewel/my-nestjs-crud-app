import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('emailSending')
export class EmailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send-email') // Handle jobs with the name 'send-email'
  async sendCommentNotification(job: Job<{ authorEmail: string; postTitle: string }>): Promise<void> {
    const { data } = job;
    const { authorEmail, postTitle } = data; // Extract data from the job

    // Send the email using the mailer service
    await this.mailerService.sendMail({
      to: authorEmail,
      subject: 'New Comment on Your Post',
      template: 'commentNotification',
      context: {
        postTitle,
      },
    });
  }
}
