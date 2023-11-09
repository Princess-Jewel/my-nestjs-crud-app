
import { Readable } from 'stream';
import { cloudinary } from './cloudinary.config';

export async function uploadStream(buffer) {
    return new Promise((res, rej) => {
      const theTransformStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (err, result) => {
          if (err) return rej(err);
          res(result);
        },
      );
      let str = Readable.from(buffer);
      str.pipe(theTransformStream);
    });
  }