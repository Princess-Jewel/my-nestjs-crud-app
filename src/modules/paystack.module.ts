
import { Module } from '@nestjs/common';
import { PaystackController } from 'src/controllers/paystack.controller';


@Module({
  controllers: [PaystackController],
})
export class PaystackModule {}
