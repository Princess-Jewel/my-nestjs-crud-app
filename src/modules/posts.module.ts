import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { PostsController } from 'src/controllers/posts.controller';
import { PostsService } from 'src/services/posts.service';
import { postsProviders } from 'src/providers/posts.providers';
import { CommentsService } from 'src/services/comments.service';
import { commentsProviders } from 'src/providers/comments.providers';
import { PostImagesService } from 'src/services/postImages.service';
import { postImagesProviders } from 'src/providers/postImages.providers';
import { ViewsHistoriesService } from 'src/services/viewsHistories.service';
import { viewsHistoriesProviders } from 'src/providers/viewsHistories.providers';
import { BullModule } from '@nestjs/bull';
import { ViewsHistoriesModule } from './viewsHistories.module';


@Module({
  imports: [
    DatabaseConnectionModule,
    ViewsHistoriesModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
    name: 'updateViewsHistories',
  }),
   
  ],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [PostsController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    PostsService,
    ...postsProviders,
    CommentsService,
    PostImagesService,
    ...commentsProviders,
    ...postImagesProviders,
    ViewsHistoriesService,
    ...viewsHistoriesProviders
  ],
})
export class PostsModule {}
