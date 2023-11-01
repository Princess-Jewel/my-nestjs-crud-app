import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { usersProviders } from 'src/providers/users.providers';
import { UsersModule } from './users.module';


@Module({
  imports: [DatabaseConnectionModule, UsersModule],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [AuthController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    AuthService,
    ...usersProviders,
  ],
})
export class AuthModule {}


