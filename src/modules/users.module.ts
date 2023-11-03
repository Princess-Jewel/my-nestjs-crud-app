import { Module } from '@nestjs/common';
import { usersProviders } from 'src/providers/users.providers';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';



@Module({
    imports: [DatabaseConnectionModule],
    controllers: [UsersController],
    providers: [
      UsersService,
      ...usersProviders,
    ],
    exports: [UsersService],
  })
export class UsersModule {}







