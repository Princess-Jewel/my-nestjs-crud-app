import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { usersProviders } from 'src/providers/users.providers';
import { UsersModule } from './users.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';


dotenv.config();
// import { jwtConstants } from 'src/constants/constants';
// import { jwtConstants } from './constants';


@Module({
  imports: [DatabaseConnectionModule, UsersModule,   JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '60d' },
  }),],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [AuthController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    AuthService,
    ...usersProviders,
  ],
})




export class AuthModule {}


