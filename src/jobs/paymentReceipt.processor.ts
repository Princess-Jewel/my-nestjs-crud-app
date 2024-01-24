import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('paymentReceipt')
export class PaymentReceiptProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('payment-receipt') // Handle jobs with the name 'payment-receipt'
  async paymentReceiptNotification(
    job: Job<{
      receipient: string;
      amount: number;
      reference: string;
      date: string;
      bank: number;
      cardType: string;
      lastFourDigits: number;
      currency: string;
      transactionType: string;
    }>,
  ): Promise<void> {
    const { data } = job;
    const { receipient, amount, reference, date, bank, cardType, lastFourDigits, currency, transactionType } =
      data; // Extract data from the job

    // Send the email using the mailer service
    await this.mailerService.sendMail({
      to: receipient,
      subject: 'Payment Receipt',
      template: 'paymentReceipt',
      context: {
      amount, reference, date, bank, cardType, lastFourDigits, currency, transactionType
      },
    });
  }
}
