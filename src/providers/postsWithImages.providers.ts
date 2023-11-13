
import { Images } from 'src/schema/postsWithImages.model';


export const postsWithImagesProviders = [
  {
    provide: 'POSTS_WITH_IMAGES_REPOSITORY',
    useValue: Images,
  },
];