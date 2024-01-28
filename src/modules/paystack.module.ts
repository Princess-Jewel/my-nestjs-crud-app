
import { Module } from '@nestjs/common';
import { PaystackController } from 'src/controllers/paystack.controller';
import { usersProviders } from 'src/providers/users.providers';
import { transactionsProviders } from 'src/providers/transactions.providers';
import { TransactionsService } from 'src/services/transactions.service';


@Module({
  controllers: [PaystackController],
  providers: [
    ...usersProviders,
    TransactionsService,
    ...transactionsProviders
  ],
})
export class PaystackModule {}
