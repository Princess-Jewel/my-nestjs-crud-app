import { Module } from '@nestjs/common';
// import { EmailService } from 'src/services/email.service';
// import { commentsProviders } from 'src/providers/comments.providers';
// import { EmailProcessor } from 'src/jobs/email.processor';
import { BullModule } from '@nestjs/bull';
import { viewsHistoriesProviders } from 'src/providers/viewsHistories.providers';
import { ViewsHistoriesService } from 'src/services/viewsHistories.service';
import { ViewsHistoriesProcessor } from 'src/jobs/viewsHistories.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'updateViewsHistories',
    }),
  ],
  providers: [...viewsHistoriesProviders, ViewsHistoriesService, ViewsHistoriesProcessor],
})
export class ViewsHistoriesModule {}
