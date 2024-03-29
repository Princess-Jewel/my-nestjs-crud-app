import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Inject,
  Delete,
  NotFoundException,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'src/guard/auth.guard';
import { Posts } from 'src/schema/posts.model';
import { CreateCommentsDto } from 'src/dto/comments.dto';
import { CommentsService } from 'src/services/comments.service';
import { Comments } from 'src/schema/comments.model';
import { handleJwtVerificationError } from 'src/errorHandlers/handleJwtVerificationError';
import { PostsService } from 'src/services/posts.service';
import { EmailService } from 'src/services/email.service';

dotenv.config();

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    @Inject('COMMENTS_REPOSITORY')
    private commentsRepository: typeof Comments,
    private postsService: PostsService,
    private emailService: EmailService,
  ) {}
  // CREATE A COMMENT
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
        const authorEmail = decoded.email;
        const userId = parseInt(decoded.sub, 10); // User ID from JWT. I turned it to an integer to avoid errors

        // find post by postId passed with the payload
        const post = await Posts.findByPk(createCommentsDto.postId);

        // Check if the post doesn't exist
        if (!post) {
          return res.status(404).json({ error: 'Post Not Found' });
        }

        // Check if the post belongs to the current user
        // if (post.userId !== userId) {
        //   return res
        //     .status(401)
        //     .json({ status: 'error', error: 'Unauthorized heree' });
        // }

        createCommentsDto.userId = userId;

        //   Create a new comment associated with the post
        const newComment = await this.commentsService.create(createCommentsDto);

        // Get the post associated with this comment
        const associatedPost = await this.postsService.getPostById(
          createCommentsDto.postId,
        );

        // Check if the post exists and extract the title
        if (associatedPost) {
          const postTitle = associatedPost.title;

          // Notify the author via email
          await this.emailService.sendCommentNotification(
            authorEmail,
            postTitle,
          );
        }

        res.status(200).json({
          message: 'Comment posted successfully',
          post: newComment,
        });
      } else {
        return res
          .status(401)
          .json({
            status: 'Error',
            message: 'Unauthorized to comment on post',
          });
      }
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Unauthorized', error: error.message });
    }
  }

  // UPDATE A COMMENT
  @UseGuards(AuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
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

        const id = req.params.commentId; // Assuming the post ID is passed as a route parameter

        // Find the post by userId and id
        const comment = await this.commentsRepository.findOne({
          where: { userId, id },
        });

        // // Check if the post doesn't exist
        if (!comment) {
          throw new NotFoundException('Post Not Found');
        }

        // Check if the post belongs to the current user
        if (comment.userId !== userId) {
          throw new UnauthorizedException('Unauthorized');
        }

        // Delete the post
        await comment.destroy();

        // Respond with a success message
        res.status(200).json({
          status: 'success',
          message: 'Comment deleted successfully',
          deletedComment: comment,
        });
      } else {
        return res
          .status(401)
          .json({ status: 'Error', message: 'Unauthorized to delete comment' });
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
