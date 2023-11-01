import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseConnectionModule } from './modules/databaseConnection.module';
import { Users } from './schema/users.model';
import { PostsModule } from './modules/posts.module';
import { Posts } from './schema/posts.model';


@Module({
  imports: [SequelizeModule.forRoot({
    dialect: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password:"",
    database: "signups",
    models:[Users, Posts],


  }),AuthModule, DatabaseConnectionModule, UsersModule, PostsModule]


})
export class AppModule {}
