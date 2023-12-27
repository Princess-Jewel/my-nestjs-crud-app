import { Module } from '@nestjs/common';
import { EmailService } from 'src/services/email.service';
import { commentsProviders } from 'src/providers/comments.providers';
import { EmailProcessor } from 'src/jobs/email.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),
  ],
  providers: [...commentsProviders, EmailService, EmailProcessor],
})
export class MailModule {}
