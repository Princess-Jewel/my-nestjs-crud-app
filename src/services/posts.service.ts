import { Injectable, Inject } from '@nestjs/common';
import { CreatePostsWithoutId } from 'src/dto/posts.dto';
import { Posts } from 'src/schema/posts.model';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POSTS_REPOSITORY')
    private postsRepository: typeof Posts,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
   
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
  async incrementViews(postId: number): Promise<void> {
    try {
      const post = await Posts.findByPk(postId);
  
      if (post) {
        post.views++;
  
        // Save the updated view count in the database
        await post.save();
  
        // Store the updated view count in the cache
        await this.cacheManager.set(`views_${postId}`, post.views, 30000);
  
        // Log success if the cache was set
        console.log('Successfully set cache for', post.views);
      } else {
        throw new Error('Post not found');
      }
    } catch (error) {
      console.error('Error incrementing views:', error.message);
      throw new Error('Error incrementing views');
    }
  }
  
  
  
  
}
