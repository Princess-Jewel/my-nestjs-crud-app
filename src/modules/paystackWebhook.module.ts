
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PaystackWebhookController } from 'src/controllers/paystackWebhook.controller';
import { usersProviders } from 'src/providers/users.providers';
import { PaymentReceiptService } from 'src/services/paymentReceipt.service';
import { TransactionsService } from 'src/services/transactions.service';



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
  controllers: [PaystackWebhookController],
  providers: [
    ...usersProviders,
    TransactionsService,
    PaymentReceiptService
  ],
})
export class PaystackWebhookModule {}
