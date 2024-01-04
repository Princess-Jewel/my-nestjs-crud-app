import { Injectable, Inject } from '@nestjs/common';
import { ViewsHistoriesDtoWithoutId } from 'src/dto/viewsHistories.dto';
import { ViewsHistories } from 'src/schema/viewsHistories.model';

@Injectable()
export class ViewsHistoriesService {
  constructor(
    @Inject('VIEWS_HISTORIES_REPOSITORY')
    private viewsHistoriesRepository: typeof ViewsHistories,
  ) {}

  async create(viewsHistories: ViewsHistoriesDtoWithoutId): Promise<ViewsHistories> {
    try {
    
      return await this.viewsHistoriesRepository.create(viewsHistories);
    } catch (error) {
      // Handle the error and throw a meaningful exception
      console.error('Error updating views history table:', error);
      throw new Error('Error updating views history table.');
    }
  }
}
