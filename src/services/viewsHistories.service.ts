import { Injectable, Inject } from '@nestjs/common';
import { ViewsHistoriesDtoWithoutId } from 'src/dto/viewsHistories.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ViewsHistories } from 'src/schema/viewsHistories.model';
import { Posts } from 'src/schema/posts.model';

@Injectable()
export class ViewsHistoriesService {
  constructor(
    @InjectQueue('updateViewsHistories')
    private updateViewsHistoriesQueue: Queue,
    @Inject('VIEWS_HISTORIES_REPOSITORY')
    private viewsHistoriesRepository: typeof ViewsHistories,
  ) {}

  async updateViewsHistoriesNotification(
    viewsHistories: ViewsHistoriesDtoWithoutId,
  ): Promise<void> {
    try {
      await this.updateViewsHistoriesQueue.add('update_views_histories', {
        viewsHistories,
      });

    } catch (error) {
      console.error('Error adding job to queue:', error);
      throw new Error('Error adding job to queue.');
    }
  }


 

  async findViewsHistoryByUserId(userId: number): Promise<ViewsHistories[]> {
    try {
      return await this.viewsHistoriesRepository.findAll({  where: { userId },
        // include: [{ model: Posts, as: 'post' }], // Include associated post});
    })
    } catch (error) {
     console.log(error) 
    }
   }

}
