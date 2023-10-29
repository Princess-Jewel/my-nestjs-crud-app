import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseConnectionModule } from './databaseConnection/databaseConnection.module';

@Module({
  imports: [SequelizeModule.forRoot({
    dialect: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password:"",
    database: "signups",
    models:[],


  }), DatabaseConnectionModule, AuthModule, UserModule]


})
export class AppModule {}
