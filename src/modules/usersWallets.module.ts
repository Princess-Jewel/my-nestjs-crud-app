import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { usersProviders } from 'src/providers/users.providers';
import { PaystackModule } from './paystack.module';



@Module({
  imports: [
    DatabaseConnectionModule,
   PaystackModule
  ],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    ...usersProviders,
  ],
})
export class UsersWalletsModule {}
