
import { Module } from '@nestjs/common';
import { TestEmailController } from 'src/controllers/emailTester.controller';


@Module({
  controllers: [TestEmailController],
})
export class EmailTesterModule {}
