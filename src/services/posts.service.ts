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


  // DELETE A POST
  // async findPostById(userId: string): Promise<Posts | null> {
  //   return await Posts.findByPk(userId);
  // }

  // async deletePost(postId: number): Promise<void> {
  // try { 
  //   console.log("princess is here with postId", postId);

  //     // await Posts.destroy({ where: { postId } });
  // } catch (error) {
  //    // Handle the error and throw a meaningful exception
  //    console.error('Error deleting post:', error);
  //    throw new Error('Failed to delete post.');
  // }
  
  // }


 
}
