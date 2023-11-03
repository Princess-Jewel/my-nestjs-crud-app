import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Delete,
  NotFoundException,
  UnauthorizedException,
  Inject,
  Param,
  Put,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreatePostsDto } from 'src/dto/posts.dto';
import { PostsService } from 'src/services/posts.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'src/guard/auth.guard';
import { Posts } from 'src/schema/posts.model';
import { EditPostsDto } from 'src/dto/editPosts.dto';

dotenv.config();

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    @Inject('POSTS_REPOSITORY')
    private postsRepository: typeof Posts,
  ) {}

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

        const postId = req.params.postId;
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
        res.status(200).json({status: 'success', message: 'Post deleted successfully', deletedPost: post });
      } else {
        return res
          .status(401)
          .json({ status: 'Error', message: 'Unauthorized to delete post' });
      }
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Unauthorized', error: error.message });
    }
  }

  // UPDATE A POST
  @Put(':id')
  async editPost(
    @Param('id') id: number,
    @Body() editPostDto: EditPostsDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
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

        const id = req.params.id; // Assuming the post ID is passed as a route parameter

        // Find the post by userId and id
        const post = await this.postsRepository.findOne({
          where: { userId, id },
        });

        // // Check if the post doesn't exist
        if (!post) {
          throw new NotFoundException('Post Not Found');
        }

        // Check if the post belongs to the current user
        if (post.userId !== userId) {
          throw new UnauthorizedException('Unauthorized');
        }

        // Update the post with the new title and content
        const updatedPost = await post.update(editPostDto);

        // Respond with a success message
        return res.status(200).json({
          status: 'Success',
          message: 'Post updated successfully',
          post: updatedPost,
        });
      } else {
        return res
          .status(401)
          .json({ status: 'Error', message: 'Unauthorized to update post' });
      }
    } catch (error) {
      // Handle different exception types and provide appropriate responses
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        res
          .status(error.getStatus())
          .json({ status: 'error', error: error.message });
      } else {
        res
          .status(500)
          .json({ status: 'error', error: 'Internal server error' });
      }
    }
  }
}

// Separate error handling functions
function handleJwtVerificationError(res: Response, error: any) {
  return res.status(401).json({
    status: 'Error',
    message: 'JWT verification failed',
    error: error.message,
  });
}

function handlePostCreationError(res: Response, error: any) {
  return res.status(500).json({
    status: 'Error',
    message: 'Post creation failed',
    error: error.message,
  });
}
