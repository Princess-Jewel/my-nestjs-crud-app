import { Injectable, Inject } from '@nestjs/common';
import { ViewsHistoryDtoWithoutId } from 'src/dto/viewsHistory.dto';
import { ViewsHistory } from 'src/schema/viewsHistory.model';

@Injectable()
export class ViewsHistoryService {
  constructor(
    @Inject('VIEWS_HISTORY_REPOSITORY')
    private viewsHistoryRepository: typeof ViewsHistory,
  ) {}

  async create(viewsHistory: ViewsHistoryDtoWithoutId): Promise<ViewsHistory> {
    try {
      console.log("princess is here",viewsHistory)
      return await this.viewsHistoryRepository.create(viewsHistory);
    } catch (error) {
      // Handle the error and throw a meaningful exception
      console.error('Error updating views history table:', error);
      throw new Error('Error updating views history table.');
    }
  }
}
