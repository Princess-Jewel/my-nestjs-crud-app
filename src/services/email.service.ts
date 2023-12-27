import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor( @InjectQueue('emailSending') private emailQueue: Queue) {}

  async sendCommentNotification(authorEmail: string, postTitle: string): Promise<void> {
    await this.emailQueue.add('send-email', { authorEmail, postTitle });
  }
}
