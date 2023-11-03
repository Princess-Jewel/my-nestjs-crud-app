import { Injectable, Inject } from '@nestjs/common';
import { CreatePostsWithoutId } from 'src/dto/posts.dto';
import { Posts } from 'src/schema/posts.model';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_REPOSITORY')
    private postsRepository: typeof Posts,
   
  ) {}

  async create(post: CreatePostsWithoutId): Promise<Posts> {
    try {
      return await this.postsRepository.create(post);
    } catch (error) {
      // Handle the error and throw a meaningful exception
      console.error('Error creating user:', error);
      throw new Error('Failed to create a user.');
    }
  }

//   async update(post: CreatePostsWithoutId): Promise<Posts> {
//     try {
//       console.log(post)
// return
//     } catch (error) {
//       // Handle the error and throw a meaningful exception
//       console.error('Error creating user:', error);
//       throw new Error('Failed to create a user.');
//     }
//   }

 
}
