import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { CommentsController } from 'src/controllers/comments.controller';
import { commentsProviders } from 'src/providers/comments.providers';
import { CommentsService } from 'src/services/comments.service';
import { PostsModule } from './posts.module';
import { MailService } from 'src/services/mail.service';
import { MailModule } from './mail.module';
import { PostsService } from 'src/services/posts.service';
import { postsProviders } from 'src/providers/posts.providers';



@Module({
  imports: [DatabaseConnectionModule,
    PostsModule,
    //  MailModule
    ],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [CommentsController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    CommentsService,
    ...commentsProviders,
    PostsService,
    ...postsProviders,
    MailService,
    
  ],
})




export class CommentsModule {}


