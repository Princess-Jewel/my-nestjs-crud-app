import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

@Module({
  // CONTROLLERS ARE FOR HANDLING REQUESTS
  controllers: [AuthController],
  //   PROVIDERS/SERVICES IS FOR HANDLING BUSINESS LOGICS
  providers: [AuthService],
})
export class AuthModule {}
