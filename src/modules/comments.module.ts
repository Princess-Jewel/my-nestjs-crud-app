import { Module } from '@nestjs/common';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { CommentsController } from 'src/controllers/comments.controller';
import { commentsProviders } from 'src/providers/comments.providers';
import { CommentsService } from 'src/services/comments.service';



@Module({
  imports: [DatabaseConnectionModule],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [CommentsController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    CommentsService,
    ...commentsProviders,
  ],
})




export class CommentsModule {}


