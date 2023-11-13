import { Injectable, Inject } from '@nestjs/common';
// import { CreatePostsWithoutId } from 'src/dto/posts.dto';
import { PostImagesDto, PostImagesDtoWithoutId } from 'src/dto/postImages.dto';
// import { Posts } from 'src/schema/posts.model';
import { Images } from 'src/schema/postImages.model';

@Injectable()
export class PostImagesService {
  constructor(
    @Inject('POST_IMAGES_REPOSITORY')
    private postImagesRepository: typeof Images,
   
  ) {}

  async create(postImages: PostImagesDtoWithoutId): Promise<Images> {
    try {
      return await this.postImagesRepository.create(postImages);
    } catch (error) {
      // Handle the error and throw a meaningful exception
      console.error('Error creating user:', error);
      throw new Error('Failed to create a user.');
    }
  }

 
}
