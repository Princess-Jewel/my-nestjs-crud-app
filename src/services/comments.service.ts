import { Injectable, Inject } from '@nestjs/common';
import { CreateCommentsDtoWithoutId } from 'src/dto/comments.dto';
import { Comments } from 'src/schema/comments.model';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENTS_REPOSITORY')
    private commentsRepository: typeof Comments,
  ) {}

  async create(comments: CreateCommentsDtoWithoutId): Promise<Comments> {
    try {
      
      return await this.commentsRepository.create(comments);
    } catch (error) {
      // Handle the error and throw a meaningful exception
      console.error('Error posting comment:', error);
      throw new Error('Failed to post comment.');
    }
  }
}
