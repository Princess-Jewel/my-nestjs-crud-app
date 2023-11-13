import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class PostsWithImagesDto {
  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  imageUrl: string[];

  @IsNotEmpty()
  userId: number;
}

// Omit the 'id' property
export type PostsWithImagesDtoWithoutId = Omit<PostsWithImagesDto, 'id'>;
