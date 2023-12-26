import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
// import * as dotenv from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseConnectionModule } from './modules/databaseConnection.module';
import { Users } from './schema/users.model';
import { PostsModule } from './modules/posts.module';
import { Posts } from './schema/posts.model';
import { CommentsModule } from './modules/comments.module';
import { Comments } from './schema/comments.model';
import { Images } from './schema/postImages.model';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailTesterModule } from './modules/emailTester.module';
import { MailModule } from './modules/mail.module';
require('dotenv').config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "signups",
      models: [Users, Posts, Comments, Images],
    }),
    AuthModule,
    DatabaseConnectionModule,
    EmailTesterModule,
    MailModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: process.env.TRANSPORT_PORT,
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS,
        },
      },
    }),
  ],
})
export class AppModule {}
