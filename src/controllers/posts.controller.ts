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
  Get,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreatePostsDto } from 'src/dto/posts.dto';
import { PostsService } from 'src/services/posts.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthGuard } from 'src/guard/auth.guard';
import { Posts } from 'src/schema/posts.model';
import { Comments } from 'src/schema/comments.model';
import { handleJwtVerificationError } from 'src/errorHandlers/handleJwtVerificationError';
import { handlePostCreationError } from 'src/errorHandlers/handlePostCreationError';
import {
  AnyFilesInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express/multer';
import { uploadStream } from 'src/helper/uploadStream';
import { PostsWithImagesDto } from 'src/dto/postsWithImages.dto';
import { PostsWithImagesService } from 'src/services/postsWithImages.service';

dotenv.config();

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsWithImagesService: PostsWithImagesService,
    @Inject('POSTS_REPOSITORY')
    private postsRepository: typeof Posts,
    @Inject('COMMENTS_REPOSITORY')
    private commentsRepository: typeof Comments,
  ) {}

  // create posts with or without image(s)
  @UseGuards(AuthGuard)
  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  async createPost(
    @Body()  postsWithImagesDto: PostsWithImagesDto,
    // postsWithImagesDto: PostsWithImagesDto,
    @Res() res: Response,
    @Req() req: Request,
    @UploadedFiles() file: Array<Express.Multer.File>,
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

        // const email = decoded.email;
        const userId = parseInt(decoded.sub, 10);

        // createPostsDto.email = email;
        postsWithImagesDto.userId = userId;

        
        // find post by postId passed with the payload
        const post = await Posts.findByPk(postsWithImagesDto.postId);

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


      }
      // UPLOAD MULTIPLE IMAGES CONCURRENTLY
      const uploadPromises = file.map((fileItem) =>
        uploadStream(fileItem.buffer),
      );
      // THESE RETURNS THE ARRAY OF THE OBJECTS OF UPLOADED IMAGES
      const results = await Promise.all(uploadPromises);

      // I AM MAPPING THROUGH TO EXTRACT THE URLS OF EACH IMAGE UPLOADED
      const imageUrls = (results as { url: string }[]).map(
        (image) => image.url,
      );

      console.log(imageUrls);
      // console.log(createPostsDto)
     
      
      postsWithImagesDto.imageUrl = imageUrls;

      // console.log("createPostsDto", createPostsDto)
      console.log("postsWithImagesDto", postsWithImagesDto)
      // post a image url associated with the post
        const newPostWithImage = await this.postsWithImagesService.create(postsWithImagesDto);

        //  const newPost = await this.postsService.create(createPostsDto);
      return res.status(201).json({
        status: 'Success',
        message: 'Post created successfully',
        post: newPostWithImage,
      });

        
    } catch (error) {
      return handlePostCreationError(res, error);
    }
  }

  // DELETE A POST
  @UseGuards(AuthGuard)
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
        res.status(200).json({
          status: 'success',
          message: 'Post deleted successfully',
          deletedPost: post,
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

  // UPDATE A POST
  @UseGuards(AuthGuard)
  @Put(':id')
  async editPost(
    @Param('id') id: number,
    @Body() createPostsDto: CreatePostsDto,
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
        const updatedPost = await post.update(createPostsDto);

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

  // GET ALL POSTS AND COMMENTS
  @UseGuards(AuthGuard)
  @Get('allPostsAndComments')
  async getPostsAndComments(): Promise<any> {
    try {
      const posts = await this.postsRepository.findAll({
        include: [
          {
            model: this.commentsRepository,
            attributes: ['comment'],
          },
        ],
        order: [['id', 'DESC']],
      });

      if (!posts || posts.length === 0) {
        return { error: 'No Post(s)' };
      }

      // Process the data to separate comments
      const processedData = posts.map((post) => {
        const comments = post.comments.map((comment) => comment.comment);
        return {
          title: post.title,
          content: post.content,
          comments,
        };
      });

      return processedData;
    } catch (error) {
      throw error;
    }
  }
}
