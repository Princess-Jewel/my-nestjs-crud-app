import { ViewsHistory } from "src/schema/viewsHistory.model";




export const viewsHistoryProviders = [
  {
    provide: 'VIEWS_HISTORY_REPOSITORY',
    useValue: ViewsHistory,
  },
];