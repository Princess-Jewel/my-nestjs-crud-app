import { Body, Controller, Post, Res, Req, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { CreatePostsDto } from 'src/dto/posts.dto';
import { PostsService } from 'src/services/posts.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'src/guard/auth.guard';

dotenv.config();

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @UseGuards(AuthGuard)
  @Post('create')
  async createPost(
    @Body() createPostsDto: CreatePostsDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      // Extract the Bearer token from the Authorization header
      const token = req.headers.authorization;

      // Check if the token exists and starts with 'Bearer '
      if (token && token.startsWith('Bearer ')) {
        // Remove 'Bearer ' to get just the token
        const authToken = token.slice(7);

        // Verify and decode the JWT
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        // Handle JWT verification errors
        if (typeof decoded === 'string') {
          return handleJwtVerificationError(res, decoded);
        }

        const email = decoded.email;
        const userId = parseInt(decoded.sub, 10);

        createPostsDto.email = email;
        createPostsDto.userId = userId;
      }
      const newPost = await this.postsService.create(createPostsDto);
      return res.status(201).json({
        status: 'Success',
        message: 'Post created successfully',
        post: newPost,
      });
    } catch (error) {
      return handlePostCreationError(res, error);
    }
  }
}

// Separate error handling functions
function handleJwtVerificationError(res: Response, error: string) {
  console.error('JWT verification failed:', error);
  return res.status(401).json({
    status: 'Error',
    message: 'JWT verification failed',
  });
}

function handlePostCreationError(res: Response, error: any) {
  console.error('Error creating post:', error);
  return res.status(500).json({
    status: 'Error',
    message: 'Post creation failed',
    error: error.message,
  });
}
