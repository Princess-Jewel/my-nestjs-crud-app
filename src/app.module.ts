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
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ViewsHistories} from './schema/viewsHistories.model';
import { ViewsHistoriesModule } from './modules/viewsHistories.module';
import { PaystackModule } from './modules/paystack.module';
import { UsersWallets } from './schema/usersWallets.model';
import { UsersWalletsModule } from './modules/usersWallets.module';
import { PaystackWebhookModule } from './modules/paystackWebhook.module';
import { PaymentReceiptModule } from './modules/paymentReceipt.module';

require('dotenv').config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'signups',
      models: [Users, Posts, Comments, Images, ViewsHistories, UsersWallets],
    }),
    AuthModule,
    DatabaseConnectionModule,
    EmailTesterModule,
    MailModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    ViewsHistoriesModule,
    PaystackModule,
    UsersWalletsModule,
    PaystackWebhookModule,
    PaymentReceiptModule,
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
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),
    BullModule.registerQueue({
      name: 'updateViewsHistories',
    }),
    BullModule.registerQueue({
      name: 'paymentReceipt',
    }),
  ],
})
export class AppModule {}
