export const cloudinary = require('cloudinary').v2;
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: 'dpqxraalv',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
