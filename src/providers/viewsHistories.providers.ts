import { ViewsHistories} from "src/schema/viewsHistories.model";




export const viewsHistoriesProviders = [
  {
    provide: 'VIEWS_HISTORIES_REPOSITORY',
    useValue: ViewsHistories,
  },
];