import { Injectable, Inject } from '@nestjs/common';
// import { CreatePostsWithoutId } from 'src/dto/posts.dto';
import { PostsWithImagesDto, PostsWithImagesDtoWithoutId } from 'src/dto/postsWithImages.dto';
// import { Posts } from 'src/schema/posts.model';
import { Images } from 'src/schema/postsWithImages.model';

@Injectable()
export class PostsWithImagesService {
  constructor(
    @Inject('POSTS_WITH_IMAGES_REPOSITORY')
    private postsWithImagesRepository: typeof Images,
   
  ) {}

  async create(postsWithImages: PostsWithImagesDtoWithoutId): Promise<Images> {
    try {
      return await this.postsWithImagesRepository.create(postsWithImages);
    } catch (error) {
      // Handle the error and throw a meaningful exception
      console.error('Error creating user:', error);
      throw new Error('Failed to create a user.');
    }
  }

 
}
