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


  // async getPostById(id: number): Promise<Posts | null> {
  //   return await this.postsRepository.findByPk(id);
  // }

  async getPostById(postId: number): Promise<Posts | null> {
    const post = await Posts.findByPk(postId);
    return post || null;
  }
  


  // For Post Views
  // async incrementViews(postId: number): Promise<void> {
  //   const post = await this.postsRepository.findByPk(postId);
  //   if (post) {
  //     post.views = (post.views || 0) + 1;
  //     await post.save();
  //   }
  // }

  async incrementViews(postId: number): Promise<void> {
    const post = await Posts.findByPk(postId);
    if (post) {
      post.views++;
      await post.save();
    }
  }
}
