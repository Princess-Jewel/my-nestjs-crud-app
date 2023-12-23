import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { PostsController } from 'src/controllers/posts.controller';
import { PostsService } from 'src/services/posts.service';
import { postsProviders } from 'src/providers/posts.providers';
import { CommentsService } from 'src/services/comments.service';
import { commentsProviders } from 'src/providers/comments.providers';
import { PostImagesService } from 'src/services/postImages.service';
import { postImagesProviders } from 'src/providers/postImages.providers';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    DatabaseConnectionModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
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
  ],
})
export class PostsModule {}
