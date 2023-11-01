import { Posts } from '../schema/posts.model';

export const postsProviders = [
  {
    provide: 'POSTS_REPOSITORY',
    useValue: Posts,
  },
];