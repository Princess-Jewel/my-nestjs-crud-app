import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseConnectionModule } from './modules/databaseConnection.module';
import { Users } from './schema/users.model';

@Module({
  imports: [SequelizeModule.forRoot({
    dialect: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password:"",
    database: "signups",
    models:[Users],


  }),AuthModule, DatabaseConnectionModule, UsersModule]
  // ERROR [ExceptionHandler] Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument UsersRepository at index [0] is available in the AuthModule context.
  // i faced this error because i added AuthModule in line 19


})
export class AppModule {}
