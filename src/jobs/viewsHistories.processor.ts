import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import {
  ViewsHistoriesDtoWithoutId,
} from 'src/dto/viewsHistories.dto';
import { ViewsHistories } from 'src/schema/viewsHistories.model';


@Processor('updateViewsHistories')
export class ViewsHistoriesProcessor {
  constructor(
    @Inject('VIEWS_HISTORIES_REPOSITORY')
    private viewsHistoriesRepository: typeof ViewsHistories,
  ) {}

  @Process('update_views_histories')
  async updateViewsHistoriesNotification(
    job: Job<{ viewsHistories: ViewsHistoriesDtoWithoutId }>,
  ): Promise<void> {
    const { data } = job;

    try {
      await this.viewsHistoriesRepository.create(data.viewsHistories);
    } catch (error) {
      console.error('Error creating views history entry:', error);
      throw new Error('Error creating views history entry.');
    }
  }
}
