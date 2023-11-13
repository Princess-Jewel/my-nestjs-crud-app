import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { PostsController } from 'src/controllers/posts.controller';
import { PostsService } from 'src/services/posts.service';
import { postsProviders } from 'src/providers/posts.providers';
import { CommentsService } from 'src/services/comments.service';
import { commentsProviders } from 'src/providers/comments.providers';
import { PostsWithImagesService } from 'src/services/postsWithImages.service';
import { postsWithImagesProviders } from 'src/providers/postsWithImages.providers';



@Module({
  imports: [DatabaseConnectionModule],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [PostsController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    PostsService,
    ...postsProviders,
    CommentsService,
    PostsWithImagesService,
    ...commentsProviders,
    ...postsWithImagesProviders
  ],
})




export class PostsModule {}


