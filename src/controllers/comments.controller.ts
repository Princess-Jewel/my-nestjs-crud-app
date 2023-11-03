import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Inject,

} from '@nestjs/common';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'src/guard/auth.guard';
import { Posts } from 'src/schema/posts.model';
import { CreateCommentsDto } from 'src/dto/comments.dto';
import { CommentsService } from 'src/services/comments.service';
import { Comments } from 'src/schema/comments.model';

dotenv.config();

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    @Inject('COMMENTS_REPOSITORY')
    private commentsRepository: typeof Comments,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createComment(
    @Body() createCommentsDto: CreateCommentsDto,
    @Req()
    req: Request,
    @Res() res: Response,
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

        // find post by postId passed with the payload
        const post = await Posts.findByPk(createCommentsDto.postId);

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

        createCommentsDto.userId = userId;

        //   Create a new comment associated with the post
        const newComment = await this.commentsService.create(createCommentsDto);

        res.status(200).json({
          message: 'Comment posted successfully',
          post: newComment,
        });
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
}

// Separate error handling functions
function handleJwtVerificationError(res: Response, error: any) {
  return res.status(401).json({
    status: 'Error',
    message: 'JWT verification failed',
    error: error.message,
  });
}
