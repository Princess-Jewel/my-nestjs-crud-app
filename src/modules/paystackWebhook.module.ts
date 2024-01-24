
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PaystackWebhookController } from 'src/controllers/paystackWebhook.controller';
import { usersProviders } from 'src/providers/users.providers';
import { PaymentReceiptService } from 'src/services/paymentReceipt.service';
import { UsersWalletsService } from 'src/services/usersWallets.service';



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
    UsersWalletsService,
    PaymentReceiptService
  ],
})
export class PaystackWebhookModule {}
