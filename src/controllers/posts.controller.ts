import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreatePostsDto } from 'src/dto/posts.dto';
import { PostsService } from 'src/services/posts.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'src/guard/auth.guard';
import { Posts } from 'src/schema/posts.model';

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

  // DELETE A POST
  @Delete(':postId')
  async deletePost(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers.authorization;

      if (token && token.startsWith('Bearer ')) {
        const authToken = token.slice(7);

        // Verify and decode the JWT
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        // Handle JWT verification errors
        if (typeof decoded === 'string') {
          return handleJwtVerificationError(res, decoded);
        }
        const userId = parseInt(decoded.sub, 10); // User ID from JWT. I turned it to an integer to avoid errors

        const postId = req.params.postId; // Assuming the post ID is passed as a route parameter
        const post = await Posts.findByPk(postId);

        // Check if the post doesn't exist
        if (!post) {
          return res.status(404).json({ error: 'Post Not Found' });
        }

        // Check if the post belongs to the current user
        if (post.userId !== userId) {
          return res
            .status(401)
            .json({ status: 'error', error: 'Unauthorized' });
        }

        // Delete the post
        await post.destroy();

        // Respond with a success message
        res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        return res
          .status(401)
          .json({ status: 'Error', message: 'Unauthorized to delete post' });
      }
    } catch (error) {
      console.error('Error verifying JWT:', error);
      return res
        .status(401)
        .json({ message: 'Unauthorized', error: error.message });
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
