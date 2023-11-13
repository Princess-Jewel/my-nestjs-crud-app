
import { Images } from 'src/schema/postImages.model';


export const postImagesProviders = [
  {
    provide: 'POST_IMAGES_REPOSITORY',
    useValue: Images,
  },
];