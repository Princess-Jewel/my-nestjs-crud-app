import { Comments } from 'src/schema/comments.model';


export const commentsProviders = [
  {
    provide: 'COMMENTS_REPOSITORY',
    useValue: Comments,
  },
];