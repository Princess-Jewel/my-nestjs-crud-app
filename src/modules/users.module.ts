import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from 'src/schema/users.model';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';

@Module({
    imports: [SequelizeModule.forFeature([Users])],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
