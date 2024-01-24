import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PaymentReceiptService {
  constructor(
    @InjectQueue('paymentReceipt') private paymentReceiptQueue: Queue,
  ) {}

  async paymentReceiptNotification(
    receipient: string,
    amount: string,
    reference: string,
    date: string,
    bank: number,
    cardType: string,
    lastFourDigits: number,
    currency: string,
    transactionType: string
  ): Promise<void> {

    // Add the job to the queue
    await this.paymentReceiptQueue.add('payment-receipt', {
      receipient,
      amount,
      reference,
      date,
      bank,
      cardType,
      lastFourDigits,
      currency,
      transactionType
    });
  }
}
