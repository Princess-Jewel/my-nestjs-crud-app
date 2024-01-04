import { Injectable, Inject } from '@nestjs/common';
import { ViewsHistoriesDtoWithoutId } from 'src/dto/viewsHistories.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ViewsHistoriesService {
  constructor(
    @InjectQueue('updateViewsHistories')
    private updateViewsHistoriesQueue: Queue,
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
}
