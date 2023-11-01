import { Module } from '@nestjs/common';
// import { AuthController } from '../controllers/auth.controller';
// import { AuthService } from '../services/auth.service';
import { DatabaseConnectionModule } from './databaseConnection.module';
import { usersProviders } from 'src/providers/users.providers';
// import { UsersModule } from './users.module';
// import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PostsController } from 'src/controllers/posts.controller';
import { PostsService } from 'src/services/posts.service';
import { postsProviders } from 'src/providers/posts.providers';


dotenv.config();
// import { jwtConstants } from 'src/constants/constants';
// import { jwtConstants } from './constants';


@Module({
  imports: [DatabaseConnectionModule],
  //   // Controllers are responsible for handling incoming HTTP requests and returning responses.
  controllers: [PostsController],
  //   //   Providers (or services) contain the business logic and provide functionality to controllers and other parts of the application.
  providers: [
    PostsService,
    ...postsProviders,
  ],
})




export class PostsModule {}


