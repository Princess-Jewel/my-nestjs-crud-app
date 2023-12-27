import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { CommentsController } from 'src/controllers/comments.controller';
import { commentsProviders } from 'src/providers/comments.providers';
import { CommentsService } from 'src/services/comments.service';
import { PostsModule } from './posts.module';
import { PostsService } from 'src/services/posts.service';
import { postsProviders } from 'src/providers/posts.providers';
import { EmailService } from 'src/services/email.service';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [
    DatabaseConnectionModule,
    PostsModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
    name: 'emailSending',
  }),
  ],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [CommentsController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    CommentsService,
    ...commentsProviders,
    PostsService,
    ...postsProviders,
    EmailService
  ],
})
export class CommentsModule {}
