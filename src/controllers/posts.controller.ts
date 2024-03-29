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
import { AnyFilesInterceptor } from '@nestjs/platform-express/multer';
import { uploadStream } from 'src/helper/uploadStream';
import { PostImagesDto } from 'src/dto/postImages.dto';
import { PostImagesService } from 'src/services/postImages.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ViewsHistoriesDto } from 'src/dto/viewsHistories.dto';
import { ViewsHistoriesService } from 'src/services/viewsHistories.service';
import { ViewsHistories } from 'src/schema/viewsHistories.model';
// import { Transactions } from 'src/schema/transactions.model';
import { Sequelize } from 'sequelize-typescript';
import {
  paymentForPost,
  paymentForPostCurrency,
} from 'src/constants/payment.constant';
import { generateRandomString } from 'src/utils/generateRandomString.utils';
import { Transactions } from 'src/schema/transactions.model';
// import("nanoid").then((nanoid_1) => {
//   const generateReference = nanoid_1;
//   console.log(generateReference)
// }).catch((error) => {
//   console.error("Error importing nanoid:", error);
// });

// import { Users } from 'src/schema/users.model';

dotenv.config();

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postImagesService: PostImagesService,
    @Inject('POSTS_REPOSITORY')
    private postsRepository: typeof Posts,
    @Inject('COMMENTS_REPOSITORY')
    private commentsRepository: typeof Comments,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private viewsHistoriesService: ViewsHistoriesService,
    @Inject('VIEWS_HISTORIES_REPOSITORY')
    private viewsHistoriesRepository: typeof ViewsHistories,
  ) {}

  // upload image(s) with post
  @UseGuards(AuthGuard)
  @Post('create/images')
  @UseInterceptors(AnyFilesInterceptor())
  async createPostAndUploadImage(
    @Body() postImagesDto: PostImagesDto,
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
        const { sub: userId } = jwt.verify(
          authToken,
          process.env.JWT_SECRET,
        ) as { sub: string };
        // Update userId in the DTO
        postImagesDto.userId = parseInt(userId, 10);
        // Find post by postId passed with the payload
        const post = await Posts.findByPk(postImagesDto.postId);
        // Check if the post doesn't exist
        if (!post) {
          return res.status(404).json({ error: 'Post Not Found' });
        }
        // Check if the post belongs to the current user
        if (post.userId !== postImagesDto.userId) {
          return res
            .status(401)
            .json({ status: 'error', error: 'Unauthorized' });
        }
      }
      // UPLOAD MULTIPLE IMAGES CONCURRENTLY
      const uploadPromises = file.map((fileItem) =>
        uploadStream(fileItem.buffer),
      );
      // These return the array of the objects of uploaded images
      const results = await Promise.all(uploadPromises);
      // Map through to extract the URLs of each image uploaded
      const imageUrls = (
        results as unknown as {
          [x: string]: any;
          url: string;
        }
      ).map((image) => image.url);
      // i want to upload each image individually instead of an array of objects
      for (const imageUrl of imageUrls) {
        // Create a new DTO for each iteration
        const dtoForIteration: PostImagesDto = {
          postId: postImagesDto.postId,
          userId: postImagesDto.userId,
          imageUrl: imageUrl,
        };
        // Use the new DTO to create an entry in the database
        await this.postImagesService.create(dtoForIteration);
      }
      return res.status(201).json({
        status: 'Success',
        message: 'Image(s) uploaded successfully',
      });
    } catch (error) {
      return handlePostCreationError(res, error);
    }
  }

  // CREATE ONLY POST
  @UseGuards(AuthGuard)
  @Post('create/post')
  async createPost(
    @Body() createPostsDto: CreatePostsDto,

    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      // Extract the Bearer token from the Authorization header
      const token = req.headers.authorization;
      // Check if the token exists and starts with 'Bearer '
      if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid or missing token' });
      }
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

      const walletBalance = await Transactions.findAll({
        attributes: [
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                'CASE WHEN transactionType = "credit" THEN amount ELSE 0 END',
              ),
            ),
            'totalCredits',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                'CASE WHEN transactionType = "debit" THEN amount ELSE 0 END',
              ),
            ),
            'totalDebits',
          ],
        ],
        where: { userId },
        raw: true,
      });

      const balance =
        (walletBalance[0].totalCredits || 0) -
        (walletBalance[0].totalDebits || 0);

      const randomReference = generateRandomString(10);

      if (balance > paymentForPost) {
      
        await Transactions.create({
          userId,
          email,
          reference: randomReference,
          currency: paymentForPostCurrency,
          amount: paymentForPost,
          transactionType: 'debit',
        });

        // Deduct the paymentForPost from the user' wallet balance
        const newWalletBalance = balance - paymentForPost;
      } else {
        return res.status(500).json({
          status: 'Error',
          message: 'Insuffient balance, please top up wallet',
        });
      }

      // Proceed to create Post if payment is successful
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

  // GET POST VIEWS HISTORY
  @Get('viewshistory')
  async getPostsViewsHistory(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const token = req.headers.authorization;
      if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid or missing token' });
      }
      const authToken = token.slice(7);
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
      if (typeof decoded === 'string') {
        return handleJwtVerificationError(res, decoded);
      }

      const userId = parseInt(decoded.sub, 10);

      const viewsHistory =
        await this.viewsHistoriesService.findViewsHistoryByUserId(userId);

      return res.status(201).json({
        status: 'Success',
        // message: 'Post created successfully',
        post: viewsHistory,
      });
      // } else {
      //   return res.status(401).json({ error: 'Invalid token' }); // Handle cases where there's no or invalid token
      // }
    } catch (error) {
      console.error('Error fetching views history:', error);
      throw new Error('Error fetching views history');
    }
  }

  // GET A SINGLE POST
  @UseGuards(AuthGuard)
  @Get(':id')
  async getPostById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
    @Body() viewsHistoriesDto: ViewsHistoriesDto,
  ) {
    try {
      const postId = parseInt(id, 10);

      // Fetch the post details by ID
      const post = await this.postsService.getPostById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post Not Found' });
      }

      // Retrieve user ID from JWT
      const token = req.headers.authorization;
      const authToken = token.slice(7);
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

      if (typeof decoded === 'string') {
        return handleJwtVerificationError(res, decoded);
      }

      const userId = parseInt(decoded.sub, 10);

      // Increment the view count for users other than the creator
      if (userId !== post.userId) {
        await this.postsService.incrementViews(postId);
      }

      viewsHistoriesDto.userId = userId;
      viewsHistoriesDto.postId = postId;

      // Update ViewsHistory table with createdAt, postId and userId
      await this.viewsHistoriesService.updateViewsHistoriesNotification(
        viewsHistoriesDto,
      );

      // // Check if the data exists in the cache
      const cachedData = await this.cacheManager.get(`views_${postId}`);
      if (cachedData) {
        console.log('Getting data from cache:', cachedData);
        return res
          .status(200)
          .json({ views: cachedData, post, cachedData: 'cachedData' });
      }

      // Update the cache with the new views count if available
      if (post && post.views) {
        await this.cacheManager.set(`views_${postId}`, post.views, 30000);
      }

      return res
        .status(200)
        .json({ views: post.views, post, updatedData: 'updatedData' });
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching post princess' });
    }
  }
}
