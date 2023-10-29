import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  // CONTROLLERS ARE FOR HANDLING REQUESTS
  controllers: [AuthController],
  //   PROVIDERS/SERVICES IS FOR HANDLING BUSINESS LOGICS
  providers: [AuthService],
})
export class AuthModule {}
