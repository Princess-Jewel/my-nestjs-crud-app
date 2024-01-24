import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PaymentReceiptService } from 'src/services/paymentReceipt.service';
import { PaymentReceiptProcessor } from 'src/jobs/paymentReceipt.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'paymentReceipt',
    }),
  ],
  providers: [
    PaymentReceiptService,
    PaymentReceiptProcessor],
})
export class PaymentReceiptModule {}
