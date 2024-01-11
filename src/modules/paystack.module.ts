
import { Module } from '@nestjs/common';
import { PaystackController } from 'src/controllers/paystack.controller';
import { usersProviders } from 'src/providers/users.providers';
import { UsersWalletsService } from 'src/services/usersWallets.service';


@Module({
  controllers: [PaystackController],
  providers: [
    ...usersProviders,
    UsersWalletsService
  ],
})
export class PaystackModule {}
